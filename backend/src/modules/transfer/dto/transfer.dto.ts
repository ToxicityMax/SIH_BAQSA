import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class TransferBC {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  prevOwner: string;

  @ApiProperty()
  @IsString()
  owner: string;

  @ApiProperty()
  @IsObject()
  review: {
    rating: number;
    message: string;
    imageUrl: string;
  };

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  latitude: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  longitude: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  createdAt: string;
}

export class TransferDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  deviceId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  review: string;
}

export class approveTransferDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  latitude: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  longitude: string;
}
