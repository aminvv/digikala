import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';
import { ProductModule } from '../product/product.module';
import { ProductEntity } from '../product/entities/product.entity';
import { ProductColorEntity } from '../product/entities/product-color.entity';
import { ProductSizeEntity } from '../product/entities/product-size.entity';
import { ProductDetailEntity } from '../product/entities/product-detail.entity';
import { ProductSizeController } from '../product/controller/product-size.controller';
import { ProductDetailController } from '../product/controller/product-detail.controller';
import { ProductColorController } from '../product/controller/product-color.controller';
import { ProductController } from '../product/controller/product.controller';
import { ProductColorService } from '../product/service/product-color.service';
import { ProductSizeService } from '../product/service/product-size.service';
import { ProductDetailService } from '../product/service/product-detail.service';
import { ProductService } from '../product/service/product.service';

@Module({
  imports:[TypeOrmModule.forFeature([DiscountEntity]),ProductModule],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
