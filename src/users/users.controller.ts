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
import { Public } from 'src/auth/constants';
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @Public()
  create(@Body() payload: CreateUserDto): any {
    return this.usersService.create(payload);
  }

  @Get()
  @Public()
  findAll(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('name') name: string,
  ): Promise<any> {
    return this.usersService.findAll(page, pageSize, name);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @Public()
  update(@Param('id') id: string, @Body() payload: CreateUserDto) {
    return this.usersService.update(id, payload);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
