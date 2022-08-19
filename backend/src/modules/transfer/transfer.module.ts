import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import {
  OrderTransferController,
  TransferController,
} from './transfer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransferEntity } from './transfer.entity';
import { AuthModule } from '../auth/auth.module';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: TransferEntity, name: 'Transfer' }]),
    AuthModule,
    OrderModule,
  ],
  controllers: [TransferController, OrderTransferController],
  providers: [TransferService],
})
export class TransferModule {}
