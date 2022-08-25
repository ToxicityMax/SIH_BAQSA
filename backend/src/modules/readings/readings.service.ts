import { Injectable } from '@nestjs/common';
import { Reading } from './reading.entity';

@Injectable()
export class ReadingsService {
  create(readingData: Reading) {
    console.log(readingData);
    // Code to push readings data to blockchain
  }
}
