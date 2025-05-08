import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  RequirementsForReuploadReturn,
  ResubmitInvalidRequirementsPayload,
} from './re-upload.types';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ReUploadService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async getAllRequirementsForReupload(studentId: number) {
    const result: RequirementsForReuploadReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'reupload_enrollment:get_all_requirements_for_reupload',
        },
        {
          studentId,
        },
      ),
    );
    return result;
  }
  async resubmitInvalidRequirements(
    payload: ResubmitInvalidRequirementsPayload,
  ) {
    const result: RequirementsForReuploadReturn = await lastValueFrom(
      this.client.send(
        {
          cmd: 'reupload_enrollment:resubmit_invalid_requirements',
        },
        payload,
      ),
    );
    return result;
  }
}
