import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  //   async register(username: string, password: string): Promise<any> {
  //     // Add logic to register a new user
  //     // Example: Save user to a database
  //     return { id: 2, username }; // Return the created user object
  //   }
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}
