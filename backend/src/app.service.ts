import { Injectable, OnModuleInit } from '@nestjs/common';
import { TransferService } from './modules/transfer/transfer.service';
import { AuthService } from './modules/auth/auth.service';

@Injectable()
export class AppService {}

@Injectable()
export class ModuleInitService implements OnModuleInit {
  constructor(
    private readonly transferService: TransferService,
    private readonly userService: AuthService,
  ) {}
  onModuleInit(): any {
    console.log('huehehehuheu');
  }
}
