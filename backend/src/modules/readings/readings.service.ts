import { HttpException, Injectable } from '@nestjs/common';
import { Reading } from './reading.entity';
import { contractWithWallet } from '../../common/bc';
import { OrderService } from '../order/order.service';

@Injectable()
export class ReadingsService {
  constructor(private readonly orderService: OrderService) {}

  async create(readingData: Reading) {
    console.log(readingData);
    const order = await this.orderService.findByDevice(readingData.device_id);
    const _insertQualityOrder = await contractWithWallet.qualityEntry(
      order._id,
      readingData.temperature,
      readingData.humidity,
      // readingData.alcohol,
      false,
      readingData.timestamp,
    );
    _insertQualityOrder.wait();
    console.log(_insertQualityOrder);
    throw new HttpException('Success', 200 );
  }
}
