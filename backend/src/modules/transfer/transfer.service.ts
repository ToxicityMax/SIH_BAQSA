import { Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

@Injectable()
export class TransferService {
  create(createTransferDto: CreateTransferDto) {
    return 'This action adds a new transfer';
  }

  findAll() {
    return `This action returns all transfer`;
  }

  findOne(id: string) {
    return `This action returns a #${id} transfer`;
  }

  update(id: string, updateTransferDto: UpdateTransferDto) {
    return `This action updates a #${id} transfer`;
  }

  remove(id: string) {
    return `This action removes a #${id} transfer`;
  }
}
