import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { MobileLoginDto, UserDTO, UserLoginDto } from './dto/auth.dto';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import * as jwt from 'jsonwebtoken';
import { checkPasswd, User, UserRole } from './auth.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(@InjectModel('User') private user: Model<User>) {}

  async create(createAuthDto: UserDTO) {
    if (await this.usernameExists(createAuthDto.username))
      throw new HttpException('Username taken', 400);
    createAuthDto.walletAddress = createAuthDto.walletAddress.toLowerCase();
    const newAccount = new this.user(createAuthDto);
    await newAccount.save();
    return true;
  }
  async mobileLogin(mobileLoginDto: MobileLoginDto) {
    const user: User = await this.user.findOne({
      username: mobileLoginDto.username,
    });
    if (!user) throw new HttpException('User not registered', 400);
    if (!(await checkPasswd(user.password, mobileLoginDto.password)))
      throw new HttpException('Incorrect Password', 401);
    const jwtToken = this.createToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    return {
      accessToken: jwtToken,
      user: {
        name: user.fullName,
        username: user.username,
        walletAddress: user.walletAddress,
        role: user.role,
      },
    };
  }
  async login(loginDto: UserLoginDto) {
    const user: User = await this.user.findOne({ username: loginDto.username });
    if (!user) throw new HttpException('User not registered', 400);
    if (!(await checkPasswd(user.password, loginDto.password)))
      throw new HttpException('Incorrect Password', 401);
    if (user.walletAddress != loginDto.walletAddress.toLowerCase())
      throw new HttpException('Wallet Address does not match', 401);
    const jwtToken = this.createToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    return {
      accessToken: jwtToken,
      user: { name: user.fullName, username: user.username, role: user.role },
    };
  }

  findOne(user) {
    return this.user.findOne({ _id: user.id });
  }

  async getUser(id) {
    const user: User = await this.user.findOne(
      {
        _id: id,
        isDeleted: false,
      },
      'id fullName username role',
    );
    return !user ? null : this.sanitizeAdmin(user);
  }

  async verifyUnameAndPasswd(username: string, password: string) {
    const user: User = await this.user.findOne({ username: username });
    if (!user) throw new HttpException('User not registered', 400);

    if (!(await checkPasswd(user.password, password)))
      throw new HttpException('Incorrect Password', 401);
    const jwtToken = this.createToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    return { jwtToken: jwtToken, user: user };
  }
  async roles() {
    return UserRole;
  }
  createToken(payload) {
    return jwt.sign(payload, config.SECRET, { expiresIn: '10d' });
  }

  validateToken(payload): string | JwtPayload {
    try {
      return jwt.verify(payload, config.SECRET);
    } catch (e) {
      throw new HttpException(e.message, 403);
    }
  }

  sanitizeAdmin(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }

  async usernameExists(username: string) {
    const exists = await this.user.findOne({ username: username }, 'username');
    return !!exists;
  }
  async userInfo() {
    const users = await this.user.find({});
    const result = {};
    for (const user of users) {
      result[`${user.walletAddress}`] = user.username;
    }
    return result;
  }
}
