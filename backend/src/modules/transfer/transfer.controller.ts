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
  UseInterceptors,
  HttpException,
  UploadedFile,
} from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferDto, TransferReviewDto } from './dto/transfer.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserGuard } from '../../guards/user.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import crypto from 'crypto';
import path from 'path';

@ApiTags('transfer')
@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post('/initiate')
  @UseGuards(UserGuard)
  @ApiSecurity('x-access-token', ['x-access-token'])
  create(@Body() createTransferDto: TransferDto, @Req() request) {
    return this.transferService.create(createTransferDto, request.user);
  }

  @Get('/is-transfer-approved/:transferId')
  @UseGuards(UserGuard)
  @ApiSecurity('x-access-token', ['x-access-token'])
  isTransferApproved(@Param('transferId') transferId: string, @Req() request) {
    return this.transferService.transferApproved(transferId, request.user);
  }

  @Post('/approve-transfer/:transferId')
  @UseGuards(UserGuard)
  @ApiSecurity('x-access-token', ['x-access-token'])
  approveTransfer(@Param('transferId') transferId: string, @Req() request) {
    return this.transferService.approveTransfer(transferId, request.user);
  }

  @Post('/review/:transferId')
  @UseGuards(UserGuard)
  @ApiSecurity('x-access-token', ['x-access-token'])
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './media/uploads',
        filename: (req, file, cb) => {
          const randomName = crypto.randomBytes(12).toString('hex');
          //Calling the callback passing the random name generated with the original extension name
          cb(null, `${randomName}${path.extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(
          path.extname(file.originalname).toLowerCase(),
        );
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) return cb(null, true);
        else cb(new HttpException('Upload Images Only!', 400), false);
      },
    }),
  )
  addReview(
    @Param('transferId') transferId: string,
    @Body() reviewDto: TransferReviewDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request,
  ) {
    const imageUrl = `/uploads/${file.filename}`;
    return this.transferService.addReviewAndImage(
      transferId,
      reviewDto,
      request.user,
      imageUrl,
    );
  }
  //
  // @Get()
  // findAll() {
  //   return this.transferService.findAll();
  // }
  //
  // @Get(':id')
  // @UseGuards(UserGuard)
  // @ApiSecurity('x-access-token', ['x-access-token'])
  // findOne(@Param('id') id: string, @Req() request) {
  //   return this.transferService.findOne(id);
  // }
  //
  // @Patch(':id')
  // @UseGuards(UserGuard)
  // @ApiSecurity('x-access-token', ['x-access-token'])
  // update(
  //   @Param('id') id: string,
  //   @Body() updateTransferDto: UpdateTransferDto,
  //   @Req() request,
  // ) {
  //   return this.transferService.update(id, updateTransferDto);
  // }
  //
  // @Delete(':id')
  // @UseGuards(UserGuard)
  // @ApiSecurity('x-access-token', ['x-access-token'])
  // remove(@Param('id') id: string, @Req() request) {
  //   return this.transferService.remove(id);
  // }
}

@ApiTags('order')
@Controller('order')
export class OrderTransferController {
  constructor(private readonly transferService: TransferService) {}

  @Get('/:orderId/transfer-request')
  @UseGuards(UserGuard)
  @ApiSecurity('x-access-token', ['x-access-token'])
  isTransferApproved(@Param('orderId') orderId: string, @Req() request) {
    return this.transferService.checkForTransfer(orderId, request.user);
  }
}
