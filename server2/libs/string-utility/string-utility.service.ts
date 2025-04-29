import { Injectable } from '@nestjs/common';

@Injectable()
export class StringUtilityService {
  constructor() {}

  public extraSpaceRemover(plaintText: string): string {
    return plaintText.replace(/\s+/g, ' ').trim();
  }

  public firstLetterUpperCase(plaintText: string): string {
    const text: string = this.extraSpaceRemover(plaintText);
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  public getTextInitials(plainText: string): string {
    const text: string = this.extraSpaceRemover(plainText);
    return text.charAt(0).toUpperCase();
  }
}
