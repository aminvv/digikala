import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';
import { ProductModule } from '../product/product.module';
import { BasketEntity } from '../basket/entities/basket.entity';

@Module({
  imports: [ProductModule, TypeOrmModule.forFeature([DiscountEntity])],
  controllers: [DiscountController],
  providers: [DiscountService],
  exports: [DiscountService, TypeOrmModule],
})
export class DiscountModule {}
