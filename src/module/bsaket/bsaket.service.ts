import { Injectable } from '@nestjs/common';
import { CreateBsaketDto } from './dto/create-bsaket.dto';
import { UpdateBsaketDto } from './dto/update-bsaket.dto';

@Injectable()
export class BsaketService {
  create(createBsaketDto: CreateBsaketDto) {
    return 'This action adds a new bsaket';
  }

  findAll() {
    return `This action returns all bsaket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bsaket`;
  }

  update(id: number, updateBsaketDto: UpdateBsaketDto) {
    return `This action updates a #${id} bsaket`;
  }

  remove(id: number) {
    return `This action removes a #${id} bsaket`;
  }
}
