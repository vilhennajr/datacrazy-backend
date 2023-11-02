import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { User } from './users.schema';
import { ApiTags } from '@nestjs/swagger';
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() payload: CreateUserDto): any {
    return this.usersService.create(payload);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<User[]> {
    return this.usersService.findAll(page, pageSize);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: CreateUserDto) {
    return this.usersService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
