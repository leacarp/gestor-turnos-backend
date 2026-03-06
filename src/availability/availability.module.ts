import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeeklySchedule as WeeklyScheduleSchema, WeeklyScheduleSchema as WeeklyScheduleSchemaFactory } from './infrastructure/schemas/weeklySchedule.schema';
import { AvailabilityException as AvailabilityExceptionSchema, AvailabilityExceptionSchema as AvailabilityExceptionSchemaFactory } from './infrastructure/schemas/availabilityException.schema';
import { AvailabilityRepository } from './infrastructure/repositories/availability.repository';
import { AppointmentAdapter } from './infrastructure/adapters/appointment.adapter';
import { AvailabilityService } from './services/availability.service';
import { AvailabilityController } from './presentation/controllers/availability.controller';
import { UserModule } from 'src/user/user.module';
import { UserAdapter } from './infrastructure/adapters/user.adapter';
import { AVAILABILITY_SERVICE, AVAILABILITY_REPOSITORY, APPOINTMENT_PORT, USER_PORT } from './infrastructure/constants/injection-tokens';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WeeklyScheduleSchema.name, schema: WeeklyScheduleSchemaFactory },
      { name: AvailabilityExceptionSchema.name, schema: AvailabilityExceptionSchemaFactory },
    ]),
    UserModule
  ],
  controllers: [AvailabilityController],
  providers: [
    {
      provide: AVAILABILITY_REPOSITORY,
      useClass: AvailabilityRepository,
    },
    {
      provide: APPOINTMENT_PORT,
      useClass: AppointmentAdapter,
    },
    {
      provide: AVAILABILITY_SERVICE,
      useClass: AvailabilityService,
    },
    {
      provide: USER_PORT,
      useClass: UserAdapter
    }
  ],
  exports: [
    'IAvailabilityService',
  ],
})
export class AvailabilityModule {}