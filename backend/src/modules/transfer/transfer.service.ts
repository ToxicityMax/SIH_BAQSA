import { HttpException, Injectable } from '@nestjs/common';
import { TransferDto, TransferReviewDto } from './dto/transfer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/auth.entity';
import { AuthService } from '../auth/auth.service';
import { OrderService } from '../order/order.service';
import { Transfer, TransferStatus } from './transfer.entity';
import { Order } from '../order/order.entity';

@Injectable()
export class TransferService {
  constructor(
    @InjectModel('Transfer') private transfer: Model<Transfer>,
    private readonly authService: AuthService,
    private readonly orderService: OrderService,
  ) {}
  async create(createTransferDto: TransferDto, user) {
    const order: Order = await this.orderService.findOne(
      createTransferDto.orderId,
    );
    if (!order) throw new HttpException('Order not found', 404);
    const newTransfer = new this.transfer();
    newTransfer.order = createTransferDto.orderId;
    newTransfer.prevOwner = order.currentOwner;
    newTransfer.status = TransferStatus.INITIATED;
    newTransfer.owner = user.id;
    await newTransfer.save();
    return {
      transferId: newTransfer._id,
    };
  }

  async transferApproved(transferId: string, user) {
    const transfer = await this.transfer.findOne({ _id: transferId });
    if (!transfer) throw new HttpException('Transfer not found', 404);
    if (transfer.owner != user.id)
      throw new HttpException('You are not the owner of transfer', 401);
    if (transfer.status === TransferStatus.APPROVED)
      throw new HttpException('Success', 200);
    else if (transfer.status === TransferStatus.REJECTED)
      throw new HttpException('Transfer rejected', 400);
    else throw new HttpException('Transfer not approved', 400);
  }

  async checkForTransfer(orderId: string, user) {
    const order: Order = await this.orderService.findOne(orderId);
    if (!order) throw new HttpException('Order not found', 404);
    if (order.createdBy != user.id)
      throw new HttpException('Not your order', 401);
    // todo -> solution for pending initiated transfers
    const transfer = await this.transfer
      .findOne({
        order: orderId,
        status: TransferStatus.INITIATED,
      })
      .sort({
        createdAt: -1,
      })
      .populate('owner')
      .populate('prevOwner');
    return {
      transferId: transfer._id,
      requestedBy: transfer.owner,
      orderId: orderId,
    };
  }

  async approveTransfer(transferId: string, user) {
    const transfer: Transfer = await this.transfer
      .findOne({
        _id: transferId,
        prevOwner: user.id,
      })
      .populate('order')
      .populate('owner')
      .populate('prevOwner');
    if (!transfer) throw new HttpException('Transfer not found', 404);
    transfer.status = TransferStatus.APPROVED;
    transfer.approvedAt = new Date();
    await transfer.save();
    await this.orderService.updateOwner(
      transfer.order['_id'],
      transfer.owner['_id'],
    );
    throw new HttpException('Success', 200);
  }

  async addReviewAndImage(
    transferId,
    transferReviewDto: TransferReviewDto,
    user,
    imageUrl,
  ) {
    const transfer = await this.transfer.findOne({ _id: transferId });
    if (!transfer) throw new HttpException('Transfer not found', 404);
    await this.transfer.updateOne(
      { _id: transferId },
      {
        $set: {
          review: {
            rating: transferReviewDto.rating,
            review: transferReviewDto.review,
          },
          imageUrl: imageUrl,
        },
      },
    );
    throw new HttpException('Success', 200);
  }

  findAll() {
    return `This action returns all transfer`;
  }

  findOne(id: string) {
    return `This action returns a #${id} transfer`;
  }

  // update(id: string, ) {
  //   return `This action updates a #${id} transfer`;
  // }

  // remove(id: string) {
  //   return `This action removes a #${id} transfer`;
  // }
}
