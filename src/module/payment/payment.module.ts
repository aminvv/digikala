import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { BasketEntity } from '../basket/entities/basket.entity';
import { BasketService } from '../basket/basket.service';
import { ProductModule } from '../product/product.module';
import { DiscountModule } from '../discount/discount.module';
import { ZarinnpalService } from '../http/zarinnpal.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[ProductModule,DiscountModule,HttpModule,TypeOrmModule.forFeature([PaymentEntity,BasketEntity])],
  controllers: [PaymentController],
  providers: [PaymentService,BasketService,],
})
export class PaymentModule {}
