import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BsaketService } from './bsaket.service';
import { CreateBsaketDto } from './dto/create-bsaket.dto';
import { UpdateBsaketDto } from './dto/update-bsaket.dto';

@Controller('bsaket')
export class BsaketController {
  constructor(private readonly bsaketService: BsaketService) {}

  @Post()
  create(@Body() createBsaketDto: CreateBsaketDto) {
    return this.bsaketService.create(createBsaketDto);
  }

  @Get()
  findAll() {
    return this.bsaketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bsaketService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBsaketDto: UpdateBsaketDto) {
    return this.bsaketService.update(+id, updateBsaketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bsaketService.remove(+id);
  }
}
