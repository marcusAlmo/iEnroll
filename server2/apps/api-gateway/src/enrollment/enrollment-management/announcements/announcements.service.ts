<<<<<<< HEAD
import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { Announcements } from 'apps/enrollment/src/enrollment-management/announcements/interface/announcements.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AnnouncementsService {
  constructor(
    @Inject('ENROLLMENT_SERVICE') private readonly client: ClientProxy,
    private readonly exceptionCheckerService: ExceptionCheckerService,
  ) {}

  public async getAnnouncements(
    payload: object,
  ): Promise<Announcements['announcementFormat']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'get-announcements' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as Announcements['announcementFormat'];
  }

  public async receiveAnnouncements(
    payload: object,
  ): Promise<MicroserviceUtility['returnValue']['message']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      await this.client.send({ cmd: ''})
    )
  }
}
=======
import { Injectable } from '@nestjs/common';

@Injectable()
export class AnnouncementsService {}
>>>>>>> b8d262f438509b0d5617d2b04ef8c4e9f95f96e8
