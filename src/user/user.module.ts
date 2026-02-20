import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserController } from './presentation/controllers/user.controller';
import { ProviderStrategy } from './services/strategies/providerStrategy';
import { AdminStrategy } from './services/strategies/adminStrategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema} from './infrastructure/schemas/user.schema'
import { USER_REPOSITORY } from './infrastructure/constants/user-repository.constants';
import { USER_SERVICE } from './infrastructure/constants/user-service.constants';
import { ClientStrategy } from './services/strategies/clientStrategy';


@Module({
  imports: [
    MongooseModule.forFeature([{name : User.name, schema: UserSchema},  
    ]),
  ],
  controllers: [UserController],
  providers: [
  {
    provide: USER_SERVICE,
    useClass: UserService
  }, 
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository
  },
    ProviderStrategy,
    ClientStrategy,
    AdminStrategy],
  exports: [USER_SERVICE, USER_REPOSITORY]
})
export class UserModule {}
