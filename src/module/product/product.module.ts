import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductDetailEntity } from './entities/product-detail.entity';
import { ProductSizeEntity } from './entities/product-size.entity';
import { ProductColorEntity } from './entities/product-color.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ProductEntity,ProductDetailEntity,ProductSizeEntity,ProductColorEntity])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
