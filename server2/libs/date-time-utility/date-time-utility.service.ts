import { Injectable } from '@nestjs/common';

@Injectable()
export class DateTimeUtilityService {
  // returns the current timestamp in GMT+8
  static getCurrentTimeStamp(): Date {
    const now = new Date();

    // Convert to UTC milliseconds
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;

    // Add 8 hours for GMT+8
    const gmt8 = new Date(utc + 8 * 60 * 60 * 1000);

    return gmt8;
  }

  // returns the current Date without time in string format
  static getCurrentDate(): string {
    const dateInGMT8: Date = this.getCurrentTimeStamp();

    const year = dateInGMT8.getFullYear();
    const month = (dateInGMT8.getMonth() + 1).toString().padStart(2, '0');
    const day = dateInGMT8.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // returns the current year in number format
  static getCurrentYear(): number {
    const dateInGMT8: Date = this.getCurrentTimeStamp();

    return dateInGMT8.getFullYear();
  }

  // returns the current month in number format
  static getCurrentMonth(): number {
    const dateInGMT8: Date = this.getCurrentTimeStamp();

    return dateInGMT8.getMonth() + 1;
  }

  // returns the current month in string format
  static getCurrentMonthString(): string {
    const dateInGMT8: Date = this.getCurrentTimeStamp();

    return dateInGMT8.toLocaleTimeString('en-US', {
      month: 'long',
    });
  }

  // returns number the actual date in number format
  static getCurrentDay(): number {
    const dateInGMT8: Date = this.getCurrentTimeStamp();

    return dateInGMT8.getDate();
  }

  // returns the current day in string format
  static getCurrentDayString(): string {
    const dateInGMT8: Date = this.getCurrentTimeStamp();

    return dateInGMT8.toLocaleTimeString('en-US', {
      weekday: 'long',
    });
  }

  // returns the current time in string format
  static getCurrentTime12HourFormat(): string {
    const dateInGMT8: Date = this.getCurrentTimeStamp();

    return dateInGMT8.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // returns the current time in string format
  static getCurrentTime24HourFormat(): string {
    const dateInGMT8: Date = this.getCurrentTimeStamp();

    return dateInGMT8.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  // returns the month and year in string
  static getMonthAndYearString(): string {
    const monthString = this.getCurrentMonthString();
    const year = this.getCurrentYear();

    return `${monthString} ${year}`;
  }

  static getDateTOString(date: Date): string {
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });

    return formattedDate;
  }

  // returns the date in string format
  static getDateString(): string {
    const year = this.getCurrentYear();
    const month = this.getCurrentMonth();
    const day = this.getCurrentDay();

    return `${year}-${month}-${day}`;
  }

  // this method is used to convert a timestamp to a date string
  // eslint-disable-next-line
  static convertTimestampToDateString({ timestamp }:{ timestamp: Date; }): string {
    const year = timestamp.getFullYear();
    const month = String(timestamp.getMonth() + 1).padStart(2, '0');
    const day = String(timestamp.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  static stringToDate(date: string, time: string) {
    const dateTimeString = `${date}T${time}:00`;

    const dateObject = new Date(dateTimeString);

    return dateObject;
  }

  static getTime12HourFormatUTC(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    });
  }
}
