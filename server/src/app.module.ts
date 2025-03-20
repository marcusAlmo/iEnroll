import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [StudentsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
