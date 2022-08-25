import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class Reading {
  @ApiProperty()
  @IsString()
  device_id: string;

  @ApiProperty()
  @IsNumber()
  temperature: number;

  @ApiProperty()
  @IsNumber()
  humidity: number;

  @ApiProperty()
  @IsNumber()
  'x-axis': number;

  @ApiProperty()
  @IsNumber()
  'y-axis': number;

  @ApiProperty()
  @IsNumber()
  'z-axis': number;

  @ApiProperty()
  @IsBoolean()
  fault: boolean;

  @ApiProperty()
  @IsString()
  timestamp: string;
}
