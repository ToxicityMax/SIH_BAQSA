import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransferEntity } from './transfer.entity';
import { AuthModule } from '../auth/auth.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    AuthModule,
    OrderModule,
    MongooseModule.forFeature([{ schema: TransferEntity, name: 'Transfer' }]),
  ],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
