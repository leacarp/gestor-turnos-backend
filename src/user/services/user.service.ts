import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { UpdateUserDtoRequest } from '../presentation/dtos/user-dto-request/update-user.dto';
import { UpdateUserDtoService } from './dto/user-dto.request/update-user-service.dto';


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
    const existingUser = await this.userRepository.existsByEmail(email);
    if(existingUser){
      throw new NotFoundException('Ya existe un usuario registrado con este mail')
    }
    
    let serviceDtoUser = createUserDto.toServiceDto();
    const hashedPassword = await this.hashPassword(serviceDtoUser.getPassword());
    serviceDtoUser = this.updatePasswordInServiceDto(serviceDtoUser, hashedPassword);

    this.selectStrategy(role);
    this.strategy.validateCreate(createUserDto);

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

  async updateUser(userId: string, updateUserDtoRequest: UpdateUserDtoRequest): Promise<UserResponseDto> {
  
    const currentUser = await this.userRepository.findById(userId);
    if (!currentUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    let updateUserDtoService = updateUserDtoRequest.toServiceDto();

    if (updateUserDtoService.getPassword()) {
        console.log('🔐 Password cambió, encriptando...');
        const hashedPassword = await this.hashPassword(updateUserDtoService.getPassword()!);
        updateUserDtoService = this.updatePasswordInServiceDtoUpdateUser(updateUserDtoService, hashedPassword);
        console.log('✓ Password encriptada');
    }

    const role = currentUser.getRole();
    this.selectStrategy(role);
    this.strategy.validateUpdate(updateUserDtoRequest);
    await this.strategy.processUpdate(updateUserDtoRequest);

    const updateUserDtoEntity = updateUserDtoService.toEntityDto();

    await this.userRepository.updateUser(userId, updateUserDtoEntity);

    const updatedUser = await this.userRepository.findById(userId);
    if (!updatedUser) {
        throw new NotFoundException('Usuario no encontrado después de actualizar');
    }

    return updatedUser.toResponseDto();

  }

  async deleteUser(userId: string) : Promise<{ message: string }>{
    const user = await this.userRepository.findById(userId);
    if (!user) {
        throw new NotFoundException('Usuario no encontrado');
    }

    const role = user.getRole();
    this.selectStrategy(role);
    await this.strategy.processDelete(userId);
    await this.userRepository.deleteUser(userId, role);

    return { message: 'Usuario eliminado correctamente' };
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

  private updatePasswordInServiceDtoUpdateUser(updateUserDtoService: UpdateUserDtoService, hashedPassword: string): UpdateUserDtoService {
    return new UpdateUserDtoService(
        updateUserDtoService.getName(),
        updateUserDtoService.getEmail(),
        updateUserDtoService.getPhone(),
        hashedPassword,
        updateUserDtoService.getProviderData()
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
