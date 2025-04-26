import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  DocumentsReuploadStatusReturn,
  EnrolleeDetailsReturn,
  EnrollmentStatusReturn,
  FileDownloadablesReturn,
} from './dashboard.types';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class DashboardService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async getEnrolleeDetails(payload: { studentId: number }) {
    const result: EnrolleeDetailsReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_enrollment_details',
        },
        payload,
      ),
    );
    return result;
  }

  async getEnrollmentStatus(payload: { studentId: number }) {
    const result: EnrollmentStatusReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_enrollment_status',
        },
        payload,
      ),
    );
    return result;
  }

  async getDocumentsForReupload(payload: { studentId: number }) {
    const result: DocumentsReuploadStatusReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_documents_for_reupload',
        },
        payload,
      ),
    );
    return result;
  }

  async getFileDownloadablesByStudent(payload: {
    studentId: number;
    userSchoolId: number;
  }) {
    const result: FileDownloadablesReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'get_file_downloadables_by_student',
        },
        payload,
      ),
    );
    return result;
  }
}
