// interceptors/multiple-file-dynamic.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MultipleDynamicFileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    if (Array.isArray(req.body.payloads) && req.files) {
      const files: Express.Multer.File[] = req.files;

      interface Payload {
        type: string;
        value?: any;
      }

      req.body.payloads = req.body.payloads.map(
        (item: string): Payload | string => {
          try {
            const parsed: Payload = JSON.parse(item);
            if (parsed.type === 'document') {
              const file = files.shift(); // assign corresponding file
              if (!file) {
                throw new BadRequestException(
                  'Mismatch: Not enough uploaded files for document-type payloads.',
                );
              }
              parsed.value = file;
            }
            return parsed;
          } catch (error: unknown) {
            if (error instanceof BadRequestException) throw error;
            return item; // fallback if parse fails
          }
        },
      );

      if (files.length > 0) {
        throw new BadRequestException(
          `Too many files uploaded: ${files.length} file(s) left unassigned.`,
        );
      }
    }

    return next.handle();
  }
}
