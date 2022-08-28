import { HttpException, Injectable } from '@nestjs/common';
import { RCULTIVATION, Reading, RFACTORY, RSUGAR } from './reading.entity';
import { contractWithWallet, insertNewEntry } from '../../common/bc';
import { OrderService } from '../order/order.service';
import { BlockchainTypes } from '../../common/blockchainTypes';
@Injectable()
export class ReadingsService {
  constructor(private readonly orderService: OrderService) {}

  async create(readingData: Reading) {
    console.log(readingData);
    const order = await this.orderService.findByDevice(readingData.device_id);
    if (!order) throw new HttpException('Order not found', 404);
    const time = new Date(readingData.timestamp);
    const rcult = new RCULTIVATION();
    rcult.timestamp = readingData.timestamp;
    rcult.humidity = readingData.humidity;
    rcult.temperature = readingData.temperature;
    rcult.alcohol = readingData.alcohol;
    rcult.device_id = readingData.device_id;
    await insertNewEntry(
      '630af7abe76e3ada29265c40',
      BlockchainTypes.RSUPPLY,
      JSON.stringify(rcult),
    );
    throw new HttpException('Success', 200);
  }

  async createSugar(data: RSUGAR, orderId) {
    const order = await this.orderService.findByDevice(orderId);
    if (!order) throw new HttpException('Order not found', 404);
    await insertNewEntry(orderId, BlockchainTypes.RSUGAR, JSON.stringify(data));
  }

  async createRFactory(data: RFACTORY, orderId) {
    const order = await this.orderService.findByDevice(orderId);
    if (!order) throw new HttpException('Order not found', 404);
    await insertNewEntry(
      orderId,
      BlockchainTypes.RFACTORY,
      JSON.stringify(data),
    );
  }
}
