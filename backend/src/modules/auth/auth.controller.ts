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
import { MobileLoginDto, UserDTO, UserLoginDto } from './dto/auth.dto';
import { UserRole } from './auth.entity';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../../guards/user.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/roles')
  async authRoles() {
    return UserRole;
  }

  @Post('/signup')
  async signup(@Body(ValidationPipe) createAuthDto: UserDTO) {
    await this.authService.create(createAuthDto);
    throw new HttpException('Success', 200);
  }

  @Post('/mobile/login')
  async mobileLogin(@Body(ValidationPipe) mobileLoginDto: MobileLoginDto) {
    return this.authService.mobileLogin(mobileLoginDto);
  }

  @Post('/login')
  async login(@Body(ValidationPipe) loginDto: UserLoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('/user/info')
  @UseGuards(UserGuard)
  @ApiSecurity('x-access-token', ['x-access-token'])
  async userInfo() {
    return this.authService.userInfo();
  }

  @Get('/user')
  @UseGuards(UserGuard)
  @ApiSecurity('x-access-token', ['x-access-token'])
  findOne(@Req() request) {
    return this.authService.findOne(request.user);
  }
}
