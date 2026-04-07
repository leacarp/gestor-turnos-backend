import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IUserService } from './interfaces/IUserService';
import { IUserStrategy } from './strategies/userStrategy';
import { ProviderStrategy } from './strategies/providerStrategy';
import { ClientStrategy } from './strategies/clientStrategy';
import { AdminStrategy } from './strategies/adminStrategy';
import { USER_REPOSITORY } from '../infrastructure/constants/user-repository.constants';
import type { IUserRepository, MpCredentialsData } from '../domain/interfaces/IUserRepository';
import * as bcrypt from 'bcrypt';
import { UserDtoService } from './dto/user-dto.request/user-service.dto';
import { UpdateUserDtoService } from './dto/user-dto.request/update-user-service.dto';
import { UserEntity } from '../domain/entities/user.entity';
import { ProviderDataDtoService } from './dto/user-dto.request/providerData-service.dto';
import { ProviderDataEntity } from '../domain/entities/providerData.entity';
import { SocialMediaLinkEntity } from '../domain/entities/socialMediaLink.entity';
import { UpdateProviderDataDtoService } from './dto/user-dto.request/update-providerData-service.dto';

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

  async createUser(dto: UserDtoService) : Promise<UserEntity> {
    const existingEmail = await this.userRepository.existsByEmail(dto.getEmail());
    if (existingEmail) throw new ConflictException('Ya existe un usuario registrado con este mail');
    
    const existingPhone = await this.userRepository.existsByPhone(dto.getPhone());
    if (existingPhone) throw new ConflictException('El teléfono ya se encuentra registrado');

    this.selectStrategy(dto.getRole());
    this.strategy.validateCreate(dto);
    await this.strategy.processCreation(dto);
    
    const hashedPassword = await this.hashPassword(dto.getPassword());    
    const providerData = dto.getProviderData() ? this.mapProviderDataDtoToEntity(dto.getProviderData()!) : undefined;

    const user = new UserEntity(
      dto.getName(),
      dto.getEmail(),
      dto.getPhone(),
      hashedPassword,
      dto.getRole(),
      providerData,
      [],
      new Date(),
      new Date(),
    );

    return this.userRepository.save(user);
  }

  async findOneUser(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(userId);
    if(!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findAllUser(): Promise<UserEntity[]> {
    return this.userRepository.findAllUsers();
  }


  async updateUser(userId: string, dto: UpdateUserDtoService): Promise<UserEntity> {
    const currentUser = await this.userRepository.findById(userId);
    if (!currentUser) throw new NotFoundException('Usuario no encontrado');
    
    this.selectStrategy(currentUser.getRole());
    this.strategy.validateUpdate(dto);
    await this.strategy.processUpdate(dto);

    let password = dto.getPassword();
    if (password) {
      password = await this.hashPassword(password);
    }

    const providerData = dto.getProviderData() ? this.mapUpdateProviderDataDtoToEntity(dto.getProviderData()!, currentUser.getProviderData()) : currentUser.getProviderData();    
    const updatedUser = new UserEntity(
      dto.getName() ?? currentUser.getName(),
      dto.getEmail() ?? currentUser.getEmail(),
      dto.getPhone() ?? currentUser.getPhone(),
      password ?? currentUser.getPassword(),
      currentUser.getRole(),
      providerData,
      currentUser.getSocialMediaLink(),
      currentUser.getCreatedAt(),
      new Date(),
      currentUser.getId(),
      dto.getIsActive() ?? currentUser.getIsActive(),
    );

    return this.userRepository.updateUser(userId, updatedUser);

  }

  async deleteUser(userId: string) : Promise<{ message: string }>{
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const role = user.getRole();
    this.selectStrategy(role);
    await this.strategy.processDelete(userId);
    await this.userRepository.deleteUser(userId, role);

    return { message: 'Usuario eliminado correctamente' };
  }

  async existsProvider(providerId: string): Promise<boolean> {
    const user = await this.userRepository.findById(providerId);
    return !!user && user.getRole() === 'provider';
  }

  async updateMpCredentials(userId: string, data: MpCredentialsData): Promise<void> {
    return this.userRepository.updateMpCredentials(userId, data);
  }

  private mapProviderDataDtoToEntity(dto: ProviderDataDtoService): ProviderDataEntity {
    return new ProviderDataEntity(
      dto.getAddress(),
      dto.getServiceType(),
      dto.getMinimumAdvance(),
      dto.getPublicInfo(),
      dto.getSocialMedia()?.map(s => new SocialMediaLinkEntity(s.getPlatform(), s.getUrl())),
    );
  }
  
  private mapUpdateProviderDataDtoToEntity(dto: UpdateProviderDataDtoService, current?: ProviderDataEntity): ProviderDataEntity {
    return new ProviderDataEntity(
      dto.getAddress() ?? current?.getAddress() ?? '',
      dto.getServiceType() ?? current?.getServiceType() ?? '',
      dto.getMinimumAdvance() ? Number(dto.getMinimumAdvance()) : current?.getMinimumAdvance() ?? 0,
      dto.getPublicInfo() ?? current?.getPublicInfo(),
      dto.getSocialMedia()?.map(s => new SocialMediaLinkEntity(s.getPlatform() ?? '', s.getUrl() ?? ''))
        ?? current?.getSocialMediaLink(),
    );
  }
  
  
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
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
