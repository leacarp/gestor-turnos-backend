import { Inject, Injectable } from '@nestjs/common';
import { IUserService } from '../domain/interfaces/IUserService';
import { IUserStrategy } from './strategies/userStrategy';
import { ProviderStrategy } from './strategies/providerStrategy';
import { ClientStrategy } from './strategies/clientStrategy';
import { AdminStrategy } from './strategies/adminStrategy';
import { CreateUserDtoRequest } from '../presentation/dtos/user-dto-request/create-user.dto';
import { USER_REPOSITORY } from '../infrastructure/constants/user-repository.constants';
import type { IUserRepository } from '../domain/interfaces/IUserRepository';
import * as bcrypt from 'bcrypt';
import { UserDtoService } from './dto/user-dto.request/user-service.dto';
import { UserResponseDto } from '../presentation/dtos/user-dto-response/user.dto';
import e from 'express';



@Injectable()
export class UserService implements IUserService {

  private strategy: IUserStrategy;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository : IUserRepository,
    private providerStrategy : ProviderStrategy,
    private clientStrategy : ClientStrategy,
    private AdminStrategy : AdminStrategy
  )
  {}

  async createUser(createUserDto: CreateUserDtoRequest) : Promise<UserResponseDto> {
    const role = createUserDto.getRole();
    const email = createUserDto.getEmail();
    await this.userRepository.existsByEmail(email);
    
    let serviceDtoUser = createUserDto.toServiceDto();
    const hashedPassword = await this.hashPassword(serviceDtoUser.getPassword());
    serviceDtoUser = this.updatePasswordInServiceDto(serviceDtoUser, hashedPassword);

    this.selectStrategy(role);
    this.strategy.validate(createUserDto);

    await this.strategy.processCreation(createUserDto);

    const UserDtoEntity = serviceDtoUser.toEntityDto()
    const savedUser = await this.userRepository.save(UserDtoEntity);

    const responseDto = savedUser.toResponseDto();
    
    return responseDto;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto) {
    return `This action updates a #${id} user`;
  }

  delete(id: number) {
    return `This action removes a #${id} user`;
  }



  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  } 

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private updatePasswordInServiceDto(serviceDtoUser: UserDtoService, hashedPassword: string): UserDtoService {
    return new UserDtoService(
      serviceDtoUser.getName(),
      serviceDtoUser.getEmail(),
      serviceDtoUser.getPhone(),
      hashedPassword,
      serviceDtoUser.getRole(),
      serviceDtoUser.getProviderData()
    );
  }


  private selectStrategy(role: string) : void {
    switch (role){
      case 'provider' :
        this.strategy = this.providerStrategy;
        break; 
      case 'client' : 
        this.strategy = this.clientStrategy;
        break;
      case 'admin' : 
        this.strategy = this.AdminStrategy;
        break;
    }
  }

}
