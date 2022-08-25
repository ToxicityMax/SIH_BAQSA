import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from '@nestjs/class-validator';
import { Products } from '../order.constant';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: Products })
  @IsNotEmpty()
  @IsEnum(Products)
  product: string;

  @ApiProperty()
  @IsNotEmpty()
  threshold: object;

  @ApiProperty()
  @IsOptional()
  imageUrl: string;
}
