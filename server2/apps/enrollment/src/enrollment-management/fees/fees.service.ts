import { Injectable } from '@nestjs/common';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { Fees } from './interface/fees.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';

@Injectable()
export class FeesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly microserviceUtilityService: MicroserviceUtilityService,
  ) {}

  public async gettGradeLevelsAndFees(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const data: Fees['gradeLevelAndFees'] =
      await this.prisma.grade_level_offered.findMany({
        where: {
          school_id: schoolId,
          is_active: true,
        },
        select: {
          grade_level: {
            select: {
              grade_level_code: true,
              grade_level: true,
            },
          },
          grade_section_program: {
            select: {
              enrollment_fee: {
                select: {
                  fee_id: true,
                  name: true,
                  amount: true,
                  description: true,
                  due_date: true,
                },
              },
            },
          },
        },
      });

    if (!data) return this.microserviceUtilityService.returnSuccess([]);

    const finalDataHolder: Fees['fetchValue'][] =
      await this.processFetchedData(data);

    return this.microserviceUtilityService.returnSuccess(finalDataHolder);
  }

  public async saveFees(
    schoolId: number,
    receivedData: Fees['receivedData'],
  ): Promise<MicroserviceUtility['returnValue']> {
    if (await this.isModifiable(schoolId))
      return this.microserviceUtilityService.conflictExceptionReturn(
        'Payment records exists, fees cannot be modified',
      );

    try {
      console.log(receivedData);
      const result = await this.prisma.$transaction(async (prisma) => {
        const gradeSectionProgramIds: number[] =
          await this.retrieveSectionProgramIds(schoolId, receivedData, prisma);

        console.log('gradeSectionProgramIds: ', gradeSectionProgramIds);
        const fees: Fees['retrievedFeesCollection'] = await this.retrieveFees(
          gradeSectionProgramIds,
          prisma,
        );

        console.log('fees: ', fees);
        const { feesToUpdate, feesToDelete, feesToInsert } =
          await this.filterToUpdateandDelete(fees, receivedData);

        console.log('feesToUpdate: ', feesToUpdate);
        console.log('feesToDelete: ', feesToDelete);
        console.log('feesToInsert: ', feesToInsert);
        await this.updateFees(feesToUpdate, prisma);
        await this.deleteFees(feesToDelete, prisma);
        await this.insertFees(gradeSectionProgramIds, feesToInsert, prisma);

        console.log('Fees saved successfully');
        return 'Fees saved successfully';
      });
      console.log(result);

      return this.microserviceUtilityService.returnSuccess({ message: result });
      // eslint-disable-next-line
    } catch (err) {
      console.log(err);
      return this.microserviceUtilityService.internalServerErrorReturn(
        'An error has occured while applying changes',
      );
    }
  }

  public async getGradeLevels(
    schoolId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const data = await this.prisma.grade_level_offered.findMany({
      where: {
        school_id: schoolId,
        is_active: true,
        grade_section_program: {
          some: {
            grade_level_offered_id: {
              not: undefined,
            },
          },
        },
      },
      select: {
        grade_level_code: true,
        grade_level: {
          select: {
            grade_level: true,
          },
        },
      },
    });

    const finalData: Fees['grade_level'] = data.map((d) => ({
      gradeLevelCode: d.grade_level_code,
      gradeLevel: d.grade_level.grade_level,
    }));

    return this.microserviceUtilityService.returnSuccess(finalData);
  }

  // UTILITY FUNCTIONS

  // this is for fetching
  private async processFetchedData(
    data: Fees['gradeLevelAndFees'],
  ): Promise<Fees['fetchValue'][]> {
    const finalDataHolder: Fees['fetchValue'][] = [];

    for (const d of data) {
      const fees: Fees['fetchValue']['fees'] = d.grade_section_program.flatMap(
        (p) =>
          p.enrollment_fee.map((e) => ({
            feeId: e.fee_id,
            feeName: e.name,
            amount: e.amount.toNumber(),
            description: e.description,
            dueDate: e.due_date,
          })),
      );

      finalDataHolder.push({
        gradeLevelCode: d.grade_level.grade_level_code,
        gradeLevel: d.grade_level.grade_level,
        fees: fees,
      });
    }

    return finalDataHolder;
  }

  // this is for storing
  private async isModifiable(schoolId: number): Promise<boolean> {
    const data = await this.prisma.enrollment_fee_payment.count({
      where: {
        student: {
          user_student_enroller_idTouser: {
            school_id: schoolId,
            user_role_user_role_user_idTouser: {
              some: {
                is_active: true,
              },
            },
          },
        },
      },
    });

    console.log('count: ', data);

    return data > 0 ? true : false;
  }

  private async retrieveSectionProgramIds(
    schoolId: number,
    receivedData: Fees['receivedData'],
    prisma: Prisma.TransactionClient,
  ): Promise<number[]> {
    const gradeSectionProgramIdArr =
      await prisma.grade_section_program.findMany({
        where: {
          grade_level_offered: {
            school_id: schoolId,
            grade_level_code: {
              in: receivedData.gradeLevelCode,
            },
          },
        },
        select: {
          grade_section_program_id: true,
        },
      });

    return gradeSectionProgramIdArr.map((g) => g.grade_section_program_id);
  }

  private async retrieveFees(
    gradeSectionProgramIds: number[],
    prisma: Prisma.TransactionClient,
  ): Promise<Fees['retrievedFeesCollection']> {
    const fees = await prisma.enrollment_fee.findMany({
      where: {
        grade_section_program_id: {
          in: gradeSectionProgramIds,
        },
      },
      select: {
        fee_id: true,
        name: true,
        description: true,
        amount: true,
        due_date: true,
      },
    });

    return fees;
  }

  private async filterToUpdateandDelete(
    fees: Fees['retrievedFeesCollection'],
    receivedData: Fees['receivedData'],
  ): Promise<{
    feesToUpdate: Fees['retrievedFeesCollection'];
    feesToDelete: number[];
    feesToInsert: Fees['toInsertFees'];
  }> {
    const feesToUpdate: Fees['retrievedFeesCollection'] = [];
    const feesToDelete: number[] = [];

    for (const fee of fees) {
      const receivedFee = receivedData.feeDetailsArr.find(
        (f) => f.feeName === fee.name,
      );
      if (receivedFee) {
        feesToUpdate.push({
          fee_id: fee.fee_id,
          name: fee.name,
          amount: new Decimal(receivedFee.amount),
          description: receivedFee.description,
          due_date: receivedFee.dueDate,
        });
      } else feesToDelete.push(fee.fee_id);
    }

    const feesToInsert: Fees['toInsertFees'] =
      receivedData.feeDetailsArr.filter(
        (f) => !fees.find((fee) => fee.name === f.feeName),
      );

    return { feesToUpdate, feesToDelete, feesToInsert };
  }

  private async updateFees(
    fees: Fees['retrievedFeesCollection'],
    prisma: Prisma.TransactionClient,
  ): Promise<void> {
    for (const f of fees) {
      await prisma.enrollment_fee.update({
        where: {
          fee_id: f.fee_id,
        },
        data: {
          name: f.name,
          amount: f.amount,
          description: f.description,
          due_date: f.due_date,
        },
      });
    }
  }

  private async deleteFees(
    fees: number[],
    prisma: Prisma.TransactionClient,
  ): Promise<void> {
    await prisma.enrollment_fee.deleteMany({
      where: { fee_id: { in: fees } },
    });
  }

  private async insertFees(
    gradeSectionProgramIds: number[],
    fees: Fees['toInsertFees'],
    prisma: Prisma.TransactionClient,
  ): Promise<void> {
    const allData = gradeSectionProgramIds.flatMap((id) =>
      fees.map((f) => ({
        name: f.feeName,
        amount: new Decimal(f.amount),
        description: f.description,
        due_date: f.dueDate,
        grade_section_program_id: id,
      })),
    );

    console.log('gradeSectionProgramIds: ', gradeSectionProgramIds);
    console.log('fees: ', fees);
    console.log('allData', allData);
    await prisma.enrollment_fee.createMany({
      data: allData,
      skipDuplicates: true,
    });
  }
}
