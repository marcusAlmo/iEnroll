import { Injectable } from '@nestjs/common';
import { PrismaService } from '@lib/prisma/src/prisma.service';
import { MicroserviceUtilityService } from '@lib/microservice-utility/microservice-utility.service';
import { Fees } from './interface/fees.interface';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';

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

  public async saveFees(schoolId: number, receivedData: Fees['receivedData']) {
    if (!(await this.isModifiable(schoolId)))
      return this.microserviceUtilityService.conflictExceptionReturn(
        'Payment records exists, fees cannot be modified',
      );

    const gradeSectionProgramIds: number[] =
      await this.retrieveSectionProgramIds(schoolId, receivedData);

    const fees: Fees['retrievedFeesCollection'] = await this.retrieveFees(
      gradeSectionProgramIds,
    );

    
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

    return data > 0 ? true : false;
  }

  private async retrieveSectionProgramIds(
    schoolId: number,
    receivedData: Fees['receivedData'],
  ): Promise<number[]> {
    const gradeSectionProgramIdArr =
      await this.prisma.grade_section_program.findMany({
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
  ): Promise<Fees['retrievedFeesCollection']> {
    const fees = await this.prisma.enrollment_fee.findMany({
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
  ) {
    const feesToUpdate: Fees['retrievedFeesCollection'] = [];
    const feesToDelete: Fees['retrievedFeesCollection'] = [];

    for (const fee of fees) {
      const feeName = fee.name;

      const receivedFee = receivedData.feeDetailsArr.find((f) => f.feeName === feeName);
      if (receivedFee) {
        feesToUpdate.push({
          fee_id: fee.fee_id,
          name: feeName,
          amount: receivedFee.amount,
          description: receivedFee.description,
          due_date: receivedFee.dueDate,
        });
      } else {
        feesToDelete.push({
          fee_id: fee.fee_id,
          name: feeName,
          amount: amount,
          description: description,
          due_date: dueDate,
        });
      }
    }

    return { feesToUpdate, feesToDelete };
  }
}
