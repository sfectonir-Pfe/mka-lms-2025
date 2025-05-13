import { Controller, Get, Patch, Param, Body, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.getByEmail(email);
  }

  @Patch('me/:email')
  async updateUserByEmail(
    @Param('email') email: string,
    @Body() dto: UpdateUserDto
  ) {
    return this.usersService.updateByEmail(email, dto);
  }
}