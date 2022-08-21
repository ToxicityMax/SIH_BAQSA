import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Req,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO, UserLoginDto } from './dto/auth.dto';
import { UserRole } from './auth.entity';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../../guards/user.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/roles')
  async authRoles() {
    return this.authService.roles();
  }

  @Post('/signup')
  async seller_signup(@Body(ValidationPipe) createAuthDto: UserDTO) {
    await this.authService.create(createAuthDto);
    throw new HttpException('Success', 200);
  }

  @Post('/login')
  async login(@Body(ValidationPipe) loginDto: UserLoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('/user')
  @UseGuards(UserGuard)
  @ApiSecurity('x-access-token', ['x-access-token'])
  findOne(@Req() request) {
    return this.authService.findOne(request.user);
  }
}
