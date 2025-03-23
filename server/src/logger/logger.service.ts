import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService extends ConsoleLogger {
  async logToFile(entry: any) {
    const formattedEntry = `${Intl.DateTimeFormat('en-Us', {
      dateStyle: 'short',
      timeStyle: 'short',
      timeZone: 'America/New_York',
    }).format(new Date())}\t${entry}\n`;

    try {
      if (!fs.existsSync(path.join(process.cwd(), 'logs'))) {
        await fsPromises.mkdir(path.join(process.cwd(), 'logs'));
      }

      await fsPromises.appendFile(
        path.join(process.cwd(), 'logs', 'logFile.log'),
        formattedEntry,
        { flag: 'a' },
      );
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  }

  log(message: any, context?: string) {
    const entry = `[${new Date().toISOString()}] ${context ? `${context} ` : ''}${message}`;

    this.logToFile(entry).catch((error) => {
      if (error instanceof Error) console.error(error.message);
    });

    super.log(entry);
  }

  error(message: any, StackOrContext?: string) {
    const entry = `[${new Date().toISOString()}] ${StackOrContext ? `${StackOrContext} ` : ''}${message}`;

    this.logToFile(entry).catch((error) => {
      if (error instanceof Error) console.error(error.message);
    });

    super.error(message, StackOrContext);
  }
}
