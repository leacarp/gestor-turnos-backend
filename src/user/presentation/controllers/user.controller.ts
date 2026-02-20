import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import type { IUserService } from 'src/user/domain/interfaces/IUserService';
import { USER_SERVICE } from 'src/user/infrastructure/constants/user-service.constants';
import { CreateUserDtoRequest } from '../dtos/user-dto-request/create-user.dto';
import { UserResponseDto } from '../dtos/user-dto-response/user.dto';


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

  /* @Get()
  findAll() {
    return this.userService.findAll();
  } */

 /*  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  } */

 /*  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.delete(+id);
  } */
}
