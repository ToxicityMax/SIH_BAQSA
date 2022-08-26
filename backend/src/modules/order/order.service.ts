import { HttpException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.entity';
import { AuthService } from '../auth/auth.service';
import { ProductsDefaultValues } from './order.constant';
import { contractWithWallet } from '../../common/bc';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private order: Model<Order>,
    private readonly userService: AuthService,
  ) {}

  orderProducts() {
    return ProductsDefaultValues;
  }

  async create(createOrderDto: CreateOrderDto, user) {
    const newOrder = new this.order(createOrderDto);
    newOrder.createdBy = user.id;
    newOrder.deviceId = await this.getNewDeviceId();
    newOrder.currentOwner = user.id;
    await newOrder.save();
    return {
      orderId: newOrder._id,
      timestamp: newOrder.createdAt,
      deviceId: newOrder.deviceId,
    };
  }

  async approveTransaction(id: string) {
    const order: Order = await this.findOne(id);
    if (!order) throw new HttpException('Order not found', 404);
    order.transactionApproved = true;
    await order.save();
    throw new HttpException('Success', 200);
  }

  async updateOwner(orderId, user) {
    return this.order.updateOne(
      { _id: orderId },
      {
        $set: { currentOwner: user.id },
      },
    );
  }

  async findAll(user) {
    return this.order.find({ transactionApproved: true, createdBy: user.id });
  }

  findOne(id: string) {
    return this.order.findOne({ _id: id });
  }

  async findAllBlockchain() {
    const orders = await this.order.find({}, '_id');
    const results = [];
    for (const order of orders) {
      console.log(order._id);
      const orderHistoryDetails = await contractWithWallet.getOrderStatus(
        order._id,
      );
      const returnVal = [];

      for (let i = 0; i < orderHistoryDetails.length; i++) {
        const itrValue = {
          oid: orderHistoryDetails[i].oid,
          productName: orderHistoryDetails[i].productName,
          orderOwnershipDetails: {
            ownerAddress:
              orderHistoryDetails[i].orderOwnershipDetails.ownerAddress,
            latitude:
              orderHistoryDetails[i].orderOwnershipDetails.latitude.toNumber(),
            longitude:
              orderHistoryDetails[i].orderOwnershipDetails.longitude.toNumber(),
          },
          physicalReadingsTemperature: {
            temperatureThresholdHigh:
              orderHistoryDetails[
                i
              ].physicalReadingsTemperature.temperatureThresholdHigh.toNumber(),
            temperatureThresholdLow:
              orderHistoryDetails[
                i
              ].physicalReadingsTemperature.temperatureThresholdLow.toNumber(),
            temperature:
              orderHistoryDetails[
                i
              ].physicalReadingsTemperature.temperature.toNumber(),
          },
          physicalReadingsHumidity: {
            humidityThresholdHigh:
              orderHistoryDetails[
                i
              ].physicalReadingsHumidity.humidityThresholdHigh.toNumber(),
            humidityThresholdLow:
              orderHistoryDetails[
                i
              ].physicalReadingsHumidity.humidityThresholdLow.toNumber(),
            humidity:
              orderHistoryDetails[
                i
              ].physicalReadingsHumidity.humidity.toNumber(),
          },
          physicalReadingsAccelerometer: {
            shock: orderHistoryDetails[i].physicalReadingsAccelerometer.shock,
          },
          transactionTime: orderHistoryDetails[i].transactionTime,
          validQuality: orderHistoryDetails[i].validQuality,
          ownerType: orderHistoryDetails[i].ownerType,
        };
        returnVal.push(itrValue);
      }
      results.push(returnVal);
    }
    return results;
  }

  async findOneBlockchain(id) {
    const orderHistoryDetails = await contractWithWallet.getOrderStatus(id);
    console.log(orderHistoryDetails);
    const returnVal = [];
    for (let i = 0; i < orderHistoryDetails.length; i++) {
      const itrValue = {
        oid: orderHistoryDetails[i].oid,
        productName: orderHistoryDetails[i].productName,
        orderOwnershipDetails: {
          ownerAddress:
            orderHistoryDetails[i].orderOwnershipDetails.ownerAddress,
          latitude:
            orderHistoryDetails[i].orderOwnershipDetails.latitude.toNumber(),
          longitude:
            orderHistoryDetails[i].orderOwnershipDetails.longitude.toNumber(),
        },
        physicalReadingsTemperature: {
          temperatureThresholdHigh:
            orderHistoryDetails[
              i
            ].physicalReadingsTemperature.temperatureThresholdHigh.toNumber(),
          temperatureThresholdLow:
            orderHistoryDetails[
              i
            ].physicalReadingsTemperature.temperatureThresholdLow.toNumber(),
          temperature:
            orderHistoryDetails[
              i
            ].physicalReadingsTemperature.temperature.toNumber(),
        },
        physicalReadingsHumidity: {
          humidityThresholdHigh:
            orderHistoryDetails[
              i
            ].physicalReadingsHumidity.humidityThresholdHigh.toNumber(),
          humidityThresholdLow:
            orderHistoryDetails[
              i
            ].physicalReadingsHumidity.humidityThresholdLow.toNumber(),
          humidity:
            orderHistoryDetails[i].physicalReadingsHumidity.humidity.toNumber(),
        },
        physicalReadingsAccelerometer: {
          shock: orderHistoryDetails[i].physicalReadingsAccelerometer.shock,
        },
        transactionTime: orderHistoryDetails[i].transactionTime,
        validQuality: orderHistoryDetails[i].validQuality,
        ownerType: orderHistoryDetails[i].ownerType,
      };
      returnVal.push(itrValue);
    }
    console.log(returnVal);
    return returnVal;
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

  async findByDevice(id) {
    return this.order.findOne({ deviceId: id });
  }
}
