import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private order: Model<Order>,
    private readonly userService: AuthService,
  ) {}
  async create(createOrderDto: CreateOrderDto, user) {
    const newOrder = new this.order(createOrderDto);
    newOrder.createdBy = user;
    newOrder.deviceId = await this.getNewDeviceId();
    await newOrder.save();
    return {
      orderId: newOrder._id,
      timestamp: newOrder.createdAt,
      deviceId: newOrder.deviceId,
    };
  }

  async findAll(user) {
    return this.order.find({ createdBy: user.id });
  }

  findOne(id: string) {
    return this.order.findOne({ _id: id });
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    this.order.updateOne({ _id: id }, updateOrderDto);
    return `This action updates a #${id} order`;
  }

  remove(id: string, user) {
    return this.order.deleteOne({ _id: id, createdBy: user.id });
  }

  private async getNewDeviceId() {
    return 'abcd1234';
  }
}
