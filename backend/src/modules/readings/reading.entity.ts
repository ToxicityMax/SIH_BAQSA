import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RCULTIVATION {
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
  @IsString()
  timestamp: string;
}

export class RSUPPLY {
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
  shock: boolean;

  @ApiProperty()
  @IsBoolean()
  fault: boolean;

  @ApiProperty()
  @IsString()
  timestamp: string;
}

export class RSUGAR {
  @ApiProperty()
  @IsString()
  device_id: string;
}

export class RFACTORY {
  @ApiProperty()
  @IsString()
  parameter: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  readings: string;

  @ApiProperty()
  @IsArray()
  idealReadings;
}

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
