import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../../guards/user.guard';

@ApiTags('transfer')
@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  @UseGuards(UserGuard)
  @ApiSecurity('x-access-token', ['x-access-token'])
  create(@Body() createTransferDto: CreateTransferDto, @Req() request) {
    return this.transferService.create(createTransferDto);
  }

  @Get()
  findAll() {
    return this.transferService.findAll();
  }

  @Get(':id')
  @UseGuards(UserGuard)
  @ApiSecurity('x-access-token', ['x-access-token'])
  findOne(@Param('id') id: string, @Req() request) {
    return this.transferService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(UserGuard)
  @ApiSecurity('x-access-token', ['x-access-token'])
  update(
    @Param('id') id: string,
    @Body() updateTransferDto: UpdateTransferDto,
    @Req() request,
  ) {
    return this.transferService.update(id, updateTransferDto);
  }

  @Delete(':id')
  @UseGuards(UserGuard)
  @ApiSecurity('x-access-token', ['x-access-token'])
  remove(@Param('id') id: string, @Req() request) {
    return this.transferService.remove(id);
  }
}
