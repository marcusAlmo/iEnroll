import { ExceptionCheckerService } from '@lib/exception-checker/exception-checker.service';
import { MicroserviceUtility } from '@lib/microservice-utility/microservice-utility.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
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
  ): Promise<Announcements['receiveInput']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send({ cmd: 'get-announcement' }, payload),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as Announcements['receiveInput'];
  }

  public async receiveAnnouncements(
    payload: object,
  ): Promise<MicroserviceUtility['successDataFormat']> {
    const result: MicroserviceUtility['returnValue'] = await lastValueFrom(
      this.client.send(
        {
          cmd: 'receive-announcement',
        },
        payload,
      ),
    );

    await this.exceptionCheckerService.checker(result);

    return result.data as MicroserviceUtility['successDataFormat'];
  }
}
