import { Injectable } from '@nestjs/common';

@Injectable()
export class FileCommonService {
  private readonly FILE_URL_PREFIX = '/api/file/';
  formatFileUrl(uuid: string) {
    return `${this.FILE_URL_PREFIX}${uuid}`;
  }
}
