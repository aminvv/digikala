import { Module } from '@nestjs/common';
import { BsaketService } from './bsaket.service';
import { BsaketController } from './bsaket.controller';

@Module({
  controllers: [BsaketController],
  providers: [BsaketService],
})
export class BsaketModule {}
