import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from '@nestjs/class-validator';
import { Products } from '../order.constant';
import { IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ enum: Products })
  @IsNotEmpty()
  @IsEnum(Products)
  product: string;

  @ApiProperty()
  @IsNotEmpty()
  threshold: string;

  @ApiProperty()
  @IsOptional()
  imageUrl: string;

  @ApiProperty()
  @IsString()
  longitude: string;

  @ApiProperty()
  @IsString()
  latitude: string;
}

export class END {
  @ApiProperty()
  @IsString()
  manufacturingDate: string;
}
