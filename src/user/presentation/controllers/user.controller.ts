import { Controller, Get, Post, Body, Put, Param, Delete, Inject } from '@nestjs/common';
import type { IUserService } from 'src/user/domain/interfaces/IUserService';
import { USER_SERVICE } from 'src/user/infrastructure/constants/user-service.constants';
import { CreateUserDtoRequest } from '../dtos/user-dto-request/create-user.dto';
import { UserResponseDto } from '../dtos/user-dto-response/user.dto';
import { UpdateUserDtoRequest } from '../dtos/user-dto-request/update-user.dto';


@Controller('users')
export class UserController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: IUserService) 
    {}

  @Post()
  async createUser(@Body() createUserDtoRequest: CreateUserDtoRequest) : Promise<UserResponseDto> {
    const createUser = await this.userService.createUser(createUserDtoRequest);
    return createUser;
  }

  @Get()
  async findAllUsers() : Promise<UserResponseDto[]> {
    const users = await this.userService.findAllUser()
    return users;
  }

 /*  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  } */

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDtoRequest: UpdateUserDtoRequest): Promise<UserResponseDto> {
    const updateUser = await this.userService.updateUser(id, updateUserDtoRequest);
    return updateUser;
  }
  

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const deleteUser = await this.userService.deleteUser(id);
    return deleteUser;
  }

}
