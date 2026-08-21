import { Controller, Get, Post, Body, Put, Param, Delete, Inject, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { IUserService } from 'src/user/services/interfaces/IUserService';
import { USER_SERVICE } from 'src/user/infrastructure/constants/user-service.constants';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/auth/presentation/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/presentation/decorators/current-user.decorator';
import { Public } from 'src/auth/presentation/decorators/public.decorator';
import { AuthUserDto } from 'src/auth/presentation/dtos/auth-dto-response/auth-user.dto';
import { CreateUserDtoRequest } from '../dtos/user-dto-request/create-user.dto';
import { UserResponseDto } from '../dtos/user-dto-response/user.dto';
import { ProviderDataResponseDto } from '../dtos/user-dto-response/providerData.dto';
import { SocialMediaResponseDto } from '../dtos/user-dto-response/socialMedia.dto';
import { PublicProviderProfileDto } from '../dtos/user-dto-response/public-provider-profile.dto';
import { UpdateUserDtoRequest } from '../dtos/user-dto-request/update-user.dto';
import { UserEntity } from 'src/user/domain/entities/user.entity';



@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: IUserService)
    {}

  @ApiOperation({ summary: 'Crea un usuario (cliente o proveedor)' })
  @Post()
  @Roles('admin', 'client', 'provider')
  async createUser(@Body() dto: CreateUserDtoRequest) : Promise<UserResponseDto> {
    const serviceDto = dto.toServiceDto();
    const entity = await this.userService.createUser(serviceDto);
    return this.toResponseDto(entity);
  }

  @ApiOperation({ summary: 'Lista todos los usuarios (solo admin)' })
  @Get()
  @Roles('admin')
  async findAllUsers() : Promise<UserResponseDto[]> {
    const users = await this.userService.findAllUser()
    return users.map(user => this.toResponseDto(user));
  }

  @ApiOperation({ summary: 'Devuelve el perfil del usuario autenticado' })
  @Get('me')
  @Roles('client', 'provider', 'admin')
  async findMe(@CurrentUser() user: AuthUserDto): Promise<UserResponseDto> {
    const entity = await this.userService.findOneUser(user.id);
    return this.toResponseDto(entity);
  }

  @ApiOperation({ summary: 'Devuelve el perfil público de un proveedor (endpoint público)' })
  @Public()
  @Get('profile/:id')
  async getPublicProviderProfile(@Param('id') id: string): Promise<PublicProviderProfileDto> {
    const entity = await this.userService.findOneUser(id);
    const providerData = entity.getProviderData()
      ? new ProviderDataResponseDto(
          entity.getProviderData()!.getAddress(),
          entity.getProviderData()!.getServiceType(),

          entity.getProviderData()!.getPublicInfo(),
          entity.getProviderData()!.getSocialMediaLink().map(s =>
            new SocialMediaResponseDto(s.getPlatform(), s.getUrl())
          ),
        )
      : undefined;
    return new PublicProviderProfileDto(entity.getId()!, entity.getName(), providerData);
  }

  @ApiOperation({ summary: 'Obtiene un usuario por id (solo admin)' })
  @Get(':id')
  @Roles('admin')
  async findOneUser(@Param('id') id: string) : Promise<UserResponseDto> {
    const entity =  await this.userService.findOneUser(id);
    return this.toResponseDto(entity);
  }

  @ApiOperation({ summary: 'Actualiza el perfil del usuario autenticado' })
  @Put('me')
  @Roles('client', 'provider')
  async updateMe(@CurrentUser() user: AuthUserDto, @Body() dto: UpdateUserDtoRequest): Promise<UserResponseDto> {
    const serviceDto = dto.toServiceDto();
    const entity = await this.userService.updateUser(user.id, serviceDto);
    return this.toResponseDto(entity);
  }

  @ApiOperation({ summary: 'Actualiza un usuario por id (solo admin)' })
  @Put(':id')
  @Roles('admin')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDtoRequest): Promise<UserResponseDto> {
    const serviceDto = dto.toServiceDto();
    const entity = await this.userService.updateUser(id, serviceDto);
    return this.toResponseDto(entity);
  }
  
  @ApiOperation({ summary: 'Elimina la cuenta del usuario autenticado' })
  @Delete('me')
  @Roles('client', 'provider')
  async deleteMe(@CurrentUser() user: AuthUserDto): Promise<{ message: string }> {
    await this.userService.deleteUser(user.id);
    return { message: 'Usuario eliminado correctamente' };
  }

  @ApiOperation({ summary: 'Elimina un usuario por id (solo admin)' })
  @Delete(':id')
  @Roles('admin')
  async deleteUser(@Param('id') id: string) {
    const deleteUser = await this.userService.deleteUser(id);
    return deleteUser;
  }

  private toResponseDto(entity: UserEntity): UserResponseDto {
  const providerData = entity.getProviderData()
    ? new ProviderDataResponseDto(
        entity.getProviderData()!.getAddress(),
        entity.getProviderData()!.getServiceType(),

        entity.getProviderData()!.getPublicInfo(),
        entity.getProviderData()!.getSocialMediaLink().map(s =>
          new SocialMediaResponseDto(s.getPlatform(), s.getUrl())
        ),
        entity.getProviderData()!.getMpConnected(),
      )
    : undefined;

  return new UserResponseDto(
      entity.getId()!,
      entity.getName(),
      entity.getEmail(),
      entity.getPhone(),
      entity.getRole(),
      providerData,
      entity.getCreatedAt(),
      entity.getIsActive(),
      entity.getReminderSettings()
    );
  }

}
