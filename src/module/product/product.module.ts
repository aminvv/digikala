import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { ProductController } from './controller/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductDetailEntity } from './entities/product-detail.entity';
import { ProductSizeEntity } from './entities/product-size.entity';
import { ProductColorEntity } from './entities/product-color.entity';
import { ProductColorController } from './controller/product-color.controller';
import { ProductDetailController } from './controller/product-detail.controller';
import { ProductSizeController } from './controller/product-size.controller';
import { ProductDetailService } from './service/product-detail.service';
import { ProductSizeService } from './service/product-size.service';
import { ProductColorService } from './service/product-color.service';
import { DiscountModule } from '../discount/discount.module';

@Module({
  imports:[TypeOrmModule.forFeature([ProductEntity,ProductDetailEntity,ProductSizeEntity,ProductColorEntity])],
  controllers: [ProductController,ProductColorController,ProductDetailController,ProductSizeController],
  providers: [ProductService,ProductDetailService,ProductSizeService,ProductColorService],
  exports: [ProductService,ProductDetailService,ProductSizeService,ProductColorService,TypeOrmModule],
  
})
export class ProductModule {}
