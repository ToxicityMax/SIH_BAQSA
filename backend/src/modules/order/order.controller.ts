import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Req,
  HttpException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {ApiSecurity, ApiTags} from '@nestjs/swagger';
import { UserGuard } from '../../guards/user.guard';
import crypto from 'crypto';
import path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
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
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    createOrderDto.imageUrl = `/uploads/${file.filename}`;
    return this.orderService.create(createOrderDto, request.user);
  }

  @Get()
  @UseGuards(UserGuard)
  @ApiSecurity('x-access-token', ['x-access-token'])
  findAll(@Req() request) {
    return this.orderService.findAll(request.user);
  }

  @Get(':id')
  @UseGuards(UserGuard)
  @ApiSecurity('x-access-token', ['x-access-token'])
  findOne(@Param('id') id: string, @Req() request) {
    return this.orderService.findOne(id);
  }

  @Put(':id')
  @UseGuards(UserGuard)
  @ApiSecurity('x-access-token', ['x-access-token'])
  update(
    @Param('id') id: string,
    @Req() request,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(UserGuard)
  @ApiSecurity('x-access-token', ['x-access-token'])
  remove(@Param('id') id: string, @Req() request) {
    return this.orderService.remove(id, request.user);
  }
}
