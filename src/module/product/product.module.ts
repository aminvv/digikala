import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './controller/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductDetailEntity } from './entities/product-detail.entity';
import { ProductSizeEntity } from './entities/product-size.entity';
import { ProductColorEntity } from './entities/product-color.entity';
import { ProductColorController } from './controller/product-color.controller';
import { ProductDetailController } from './controller/product-detail.controller';
import { ProductSizeController } from './controller/product-size.controller';

@Module({
  imports:[TypeOrmModule.forFeature([ProductEntity,ProductDetailEntity,ProductSizeEntity,ProductColorEntity])],
  controllers: [ProductController,ProductColorController,ProductDetailController,ProductSizeController],
  providers: [ProductService],
})
export class ProductModule {}
