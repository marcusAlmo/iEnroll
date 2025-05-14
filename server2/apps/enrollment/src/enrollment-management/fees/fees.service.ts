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
                  fee_type_id: true,
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
    console.log('receivedDataService: ', receivedData);
    if (await this.isModifiable(schoolId))
      return this.microserviceUtilityService.conflictExceptionReturn(
        'Payment records exists, fees cannot be modified',
      );

    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        if (receivedData.newFees && receivedData.newFees.length > 0) {
          const gradeSectionProgramIds: number[] =
            await this.retrieveSectionProgramIds(
              schoolId,
              receivedData.gradeLevelCode,
              prisma,
            );

          const toBeCreated = gradeSectionProgramIds.flatMap((id) => {
            const newFees: Fees['toBeCreated'][] = receivedData.newFees.map(
              (f) => ({
                grade_section_program_id: id,
                name: f.feeName,
                amount: new Decimal(f.amount),
                description: f.description,
                due_date: f.dueDate,
                fee_type_id: f.feeTypeId,
              }),
            );

            return newFees;
          });

          // create new fees
          await this.createNewFees(toBeCreated, prisma);
        }

        if (receivedData.existingFees.length > 0) {
          // update existing fees
          await this.updateExistingFees(receivedData.existingFees, prisma);
        }

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

  public async deleteFee(
    feeId: number,
  ): Promise<MicroserviceUtility['returnValue']> {
    const data = await this.prisma.enrollment_fee.delete({
      where: {
        fee_id: feeId,
      },
    });

    if (!data)
      return this.microserviceUtilityService.internalServerErrorReturn(
        'An error has occured while deleting fee',
      );

    return this.microserviceUtilityService.returnSuccess({
      message: 'Fee deleted successfully',
    });
  }

  public async retrieveFeeTypes(): Promise<MicroserviceUtility['returnValue']> {
    const data = await this.prisma.fee_type.findMany({
      select: {
        fee_type_id: true,
        fee_type: true,
      },
    });

    if (!data)
      return this.microserviceUtilityService.notFoundExceptionReturn(
        'Fee types not found',
      );

    const finalData: Fees['fee_type'] = data.map((d) => ({
      feeTypeId: d.fee_type_id,
      feeType: d.fee_type,
    }));

    return this.microserviceUtilityService.returnSuccess(finalData);
  }

  // UTILITY FUNCTIONS29

  // this is for fetching
  private async processFetchedData(
    data: Fees['gradeLevelAndFees'],
  ): Promise<Fees['fetchValue'][]> {
    const finalDataHolder: Fees['fetchValue'][] = [];

    for (const d of data) {
      const seenFees = new Set<string>();

      const fees: Fees['fetchValue']['fees'] = d.grade_section_program.flatMap(
        (p) =>
          p.enrollment_fee
            .map((e) => ({
              feeId: e.fee_id,
              feeName: e.name,
              amount: e.amount.toNumber(),
              description: e.description,
              dueDate: e.due_date,
              feeTypeId: e.fee_type_id,
            }))
            .filter((fee) => {
              // Create a unique key for each fee based on relevant properties
              const key = `${fee.feeName}|${fee.description}|${fee.amount}|${fee.feeTypeId}`;
              if (seenFees.has(key)) {
                return false; // Duplicate found, skip it
              }
              seenFees.add(key);
              return true; // Unique, keep it
            }),
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
          },
        },
      },
    });

    console.log('count: ', data);

    return data > 0 ? true : false;
  }

  private async retrieveSectionProgramIds(
    schoolId: number,
    gradeLevelCode: string,
    prisma: Prisma.TransactionClient,
  ): Promise<number[]> {
    const gradeSectionProgramIdArr =
      await prisma.grade_section_program.findMany({
        where: {
          grade_level_offered: {
            school_id: schoolId,
            grade_level_code: gradeLevelCode,
          },
        },
        select: {
          grade_section_program_id: true,
          program_id: true,
        },
      });

    const existingRecordProgramId = gradeSectionProgramIdArr.map(
      (g) => g.program_id,
    );

    const programIds = await this.prisma.academic_program.findMany({
      select: {
        program_id: true,
      },
    });

    const existingGradeSectionProgramId: number[] =
      gradeSectionProgramIdArr.map((g) => g.grade_section_program_id);

    const programId = programIds
      .filter((p) => !existingRecordProgramId.includes(p.program_id))
      .map((p) => p.program_id);

    if (programId.length === 0) return existingGradeSectionProgramId;

    const gradeSectionProgramId = await this.createGradeSection(
      schoolId,
      gradeLevelCode,
      programId,
      prisma,
    );

    return [...existingGradeSectionProgramId, ...gradeSectionProgramId];
  }

  private async createGradeSection(
    schoolId: number,
    gradeLevelCode: string,
    programIdArr: number[],
    prisma: Prisma.TransactionClient,
  ): Promise<number[]> {
    const retrieveGradeLevelOfferedId =
      await prisma.grade_level_offered.findFirst({
        where: {
          school_id: schoolId,
          grade_level_code: gradeLevelCode,
        },
        select: {
          grade_level_offered_id: true,
        },
      });

    if (!retrieveGradeLevelOfferedId) return [];

    const toBeCreated = programIdArr.map((p) => ({
      grade_level_offered_id:
        retrieveGradeLevelOfferedId.grade_level_offered_id,
      program_id: p,
    }));

    const gradeSectionProgramIdArr =
      await prisma.grade_section_program.createManyAndReturn({
        data: toBeCreated,
      });

    return gradeSectionProgramIdArr.map((g) => g.grade_section_program_id);
  }

  private async createNewFees(
    data: Fees['toBeCreated'][],
    prisma: Prisma.TransactionClient,
  ): Promise<void> {
    const result = await prisma.enrollment_fee.createMany({
      data,
    });

    if (!result)
      throw new Error('An error has occured while creating new fees');
  }

  private async updateExistingFees(
    data: Fees['receivedFeesCollection'][],
    prisma: Prisma.TransactionClient,
  ): Promise<void> {
    for (const d of data) {
      const gradeSectionAndDetails = await this.getGradeSectionAndDetails(
        d.feeId,
        prisma,
      );

      console.log('gradeSectionAndDetails: ', gradeSectionAndDetails);

      const feeIdArr: number[] = await this.gatherSimilarFees(
        gradeSectionAndDetails!,
        prisma,
      );

      console.log('feeIdArr: ', feeIdArr);

      const result = await prisma.enrollment_fee.updateMany({
        where: {
          fee_id: {
            in: feeIdArr,
          },
        },
        data: {
          name: d.feeName,
          amount: new Decimal(d.amount),
          description: d.description,
          due_date: d.dueDate,
          fee_type_id: d.feeTypeId,
        },
      });

      console.log('update result: ', result);

      if (!result)
        throw new Error('An error has occured while updating existing fees');
    }
  }

  private async getGradeSectionAndDetails(
    feeId: number,
    prisma: Prisma.TransactionClient,
  ): Promise<Fees['gradeSectionAndDetails'] | null> {
    const data = await prisma.enrollment_fee.findUnique({
      where: {
        fee_id: feeId,
      },
      select: {
        name: true,
        amount: true,
        description: true,
        fee_type_id: true,
      },
    });

    if (!data) return null;

    return {
      name: data.name,
      amount: data.amount,
      description: data.description,
      feeTypeId: data.fee_type_id,
    };
  }

  private async gatherSimilarFees(
    rawData: Fees['gradeSectionAndDetails'],
    prisma: Prisma.TransactionClient,
  ): Promise<number[]> {
    const result = await prisma.enrollment_fee.findMany({
      where: {
        name: rawData.name,
        amount: rawData.amount,
        fee_type_id: rawData.feeTypeId,
      },
      select: {
        fee_id: true,
      },
    });

    console.log('result: ', result);

    return result.map((r) => r.fee_id);
  }
}
