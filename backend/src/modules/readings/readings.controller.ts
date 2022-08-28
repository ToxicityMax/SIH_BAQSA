import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReadingsService } from './readings.service';
import { ApiTags } from '@nestjs/swagger';
import { Reading, RFACTORY, RSUGAR } from './reading.entity';

@Controller('readings')
@ApiTags('readings')
export class ReadingsController {
  constructor(private readonly readingsService: ReadingsService) {}

  @Post()
  create(@Body() readingData: Reading) {
    return this.readingsService.create(readingData);
  }
  @Post('/RSUGAR/:id')
  createSugar(@Param('id') id: string, @Body() data: RSUGAR) {
    return this.readingsService.createSugar(data, id);
  }
  @Post('/RFACTORY/:id')
  createFactory(@Param('id') id: string, @Body() data: RFACTORY) {
    return this.readingsService.createRFactory(data, id);
  }
}

// @Controller('/stac')
// @ApiTags('/stac')
// export class OrderReadings {
//   x_axis;
//   y_axis;
//   z_axis;
//   constructor(private readonly orderService: OrdersService) {}
//
//   @Post('/readings')
//   async postReadings(@Body() readingDTO: readingDto, @Req() request) {
//     console.log(readingDTO);
//     this.z_axis = readingDTO['z-axis'];
//     this.y_axis = readingDTO['y-axis'];
//     this.z_axis = readingDTO['z-axis'];
//     if (readingDTO.inspectionNeeded)
//       await this.orderService.toggleInspectionNeeded(readingDTO.device_id);
//     throw new HttpException('Success', 200);
//   }
//
//   @Get('/readings')
//   getReadings() {
//     return {
//       'x-axis': this.x_axis,
//       'y-axis': this.y_axis,
//       'z-axis': this.z_axis,
//     };
//   }
// }
