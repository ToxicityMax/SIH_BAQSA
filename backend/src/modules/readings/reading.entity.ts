import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  alcohol: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  'x-axis': number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  'y-axis': number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  'z-axis': number;

  @ApiProperty()
  @IsBoolean()
  fault: boolean;

  @ApiProperty()
  @IsString()
  timestamp: string;
}
