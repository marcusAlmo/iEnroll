import { PrismaService } from '@lib/prisma/src/prisma.service';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { $Enums } from '@prisma/client';

@Injectable()
export class ReUploadService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllRequirementsForReupload(studentId: number) {
    // ? Prevents leaks
    if (studentId === undefined)
      throw new RpcException({
        statusCode: 400,
        message: 'ERR_STUDENT_ID_NOT_DEFINED',
      });

    const result = await this.prisma.application_attachment.findMany({
      where: {
        enrollment_application: {
          student: {
            student_id: studentId,
          },
        },
        status: 'invalid',
      },
      select: {
        enrollment_requirement: {
          select: {
            requirement_id: true,
            name: true,
            requirement_type: true,
            accepted_data_type: true,
            is_required: true,
          },
        },
      },
    });

    return result.map(
      ({
        enrollment_requirement: {
          requirement_id,
          name,
          requirement_type,
          accepted_data_type,
          is_required,
        },
      }) => ({
        requirementId: requirement_id,
        name,
        requirementType: requirement_type,
        acceptedDataTypes: accepted_data_type,
        isRequired: is_required,
      }),
    );
  }

  async resubmitInvalidRequirements(payload: {
    details: {
      studentId: number;
    };
    requirements: {
      requirementId: number;
      textContent?: string;
      fileId?: number;
    }[];
  }) {
    // STEP 1: Query application and attachments in one optimized query
    const application = await this.prisma.enrollment_application.findFirst({
      where: {
        student: {
          student_id: payload.details.studentId,
        },
      },
      select: {
        status: true,
        application_id: true,
        application_attachment: {
          select: {
            requirement_id: true, // Required for invalid requirement ID validation
            file_id: true,
            status: true,
          },
        },
      },
    });

    // STEP 2: Early validation – ensure application exists and is in an invalid state
    if (!application) {
      throw new RpcException({
        statusCode: 404,
        message: 'ERR_NO_APPLICATION_FOUND',
      });
    }

    if (application.status !== $Enums.application_status.invalid) {
      throw new RpcException({
        statusCode: 400,
        message: 'ERR_APPLICATION_STATUS_NOT_INVALID',
      });
    }

    // STEP 3: Validate file references against existing file records
    const fileIds = Array.from(
      new Set(payload.requirements.map((r) => r.fileId).filter(Boolean)),
    ) as number[];

    const files = await this.prisma.file.findMany({
      where: { file_id: { in: fileIds } },
      select: { file_id: true },
    });

    if (files.length !== fileIds.length) {
      throw new RpcException({
        statusCode: 500,
        message: '`ERR_INVALID_FILE_IDS`',
      });
    }

    // STEP 4: Collect only invalid requirement IDs from existing attachments
    const invalidRequirementIds = new Set(
      application.application_attachment
        .filter((a) => a.status === $Enums.attachment_status.invalid)
        .map((a) => a.requirement_id),
    );

    // STEP 5: Block submission of requirements that were never marked invalid
    for (const req of payload.requirements) {
      if (!invalidRequirementIds.has(req.requirementId)) {
        throw new RpcException({
          statusCode: 400,
          message: 'ERR_NON_INVALID_REQUIREMENT_INCLUDED',
        });
      }
    }

    // STEP 6: Cleanup only unused invalid files to avoid deleting reused ones
    const existingFileIds = application.application_attachment
      .filter((a) => a.status === $Enums.attachment_status.invalid)
      .map((a) => a.file_id)
      .filter(Boolean) as number[];

    const reusedFileIds = payload.requirements
      .map((r) => r.fileId)
      .filter(Boolean) as number[];

    const toDelete = existingFileIds.filter(
      (id) => !reusedFileIds.includes(id),
    );

    try {
      // STEP 7: Execute all DB operations in a single transaction for consistency
      await this.prisma.$transaction([
        ...payload.requirements.map((requirement) =>
          this.prisma.application_attachment.update({
            where: {
              requirement_id_application_id: {
                requirement_id: requirement.requirementId,
                application_id: application.application_id,
              },
            },
            data: {
              text_content: requirement.textContent ?? null,
              file_id: requirement.fileId ?? null,
              status: $Enums.attachment_status.pending,
            },
          }),
        ),
        ...toDelete.map((fileId) =>
          this.prisma.file.delete({ where: { file_id: fileId } }),
        ),
        this.prisma.enrollment_application.update({
          where: {
            application_id: application.application_id,
          },
          data: {
            status: $Enums.application_status.pending,
          },
        }),
      ]);

      return { success: true };
    } catch (error) {
      console.error(error);
      throw new RpcException({
        statusCode: 500,
        message: 'ERR_REQUIREMENT_RESUBMISSION_FAILED',
      });
    }
  }
}
