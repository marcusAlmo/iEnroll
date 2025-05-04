import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ClientsModule } from '@nestjs/microservices';
import { GoogleStrategyModule } from '@lib/google-strategy/google.module';
import { MetricsController } from './metrics/metrics.controller';
import { MetricsService } from './metrics/metrics.service';
import { SystemManagementController } from './system-management/system-management.controller';
import { SystemManagementService } from './system-management/system-management.service';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { EnrollmentController } from './enrollment/enrollment.controller';
import { EnrollmentService } from './enrollment/enrollment.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from '@lib/auth/auth.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { rabbitMQConstants } from '@lib/constants/rabbit-mq.constants';
import { FileModule } from './file/file.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';
import { ImageModule } from './image/image.module';
import { MetricsModule } from './metrics/metrics.module';
import { HealthModule } from './health/health.module';
import { SystemManagementModule } from './system-management/system-management.module';
@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', '..', '..', 'uploads'),
    //   serveRoot: 'media',
    // }),
    AuthModule,
    ClientsModule.register([
      rabbitMQConstants.CHAT,
      rabbitMQConstants.ENROLLMENT,
      rabbitMQConstants.METRICS,
      rabbitMQConstants.SYSTEM_MANAGEMENT,
      rabbitMQConstants.AUTH,
      rabbitMQConstants.FILE,
      rabbitMQConstants.IMAGE,
    ]),
    SystemManagementModule,
    GoogleStrategyModule,
    EnrollmentModule,
    FileModule,
    ImageModule,
    MetricsModule,
    HealthModule,
  ],
  controllers: [
    ApiGatewayController,
    MetricsController,
    SystemManagementController,
    ChatController,
    EnrollmentController,
    AuthController,
  ],
  providers: [
    ApiGatewayService,
    MetricsService,
    SystemManagementService,
    ChatService,
    EnrollmentService,
    AuthService,
  ],
})
export class ApiGatewayModule {}
