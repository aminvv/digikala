import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TypeOrmConfig } from 'src/config/typeorm';
import { ProductModule } from '../product/product.module';
import { DiscountModule } from '../discount/discount.module';
import { BasketModule } from '../basket/basket.module';
import { PaymentModule } from '../payment/payment.module';
import { HttpApiModule } from '../http/http.module';
import { OrderModule } from '../order/order.module';


@Module({
  imports: [ConfigModule.forRoot({envFilePath:join(process.cwd(),'.env'),isGlobal:true}),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    ProductModule,
    DiscountModule,
    BasketModule,
    PaymentModule,
    HttpApiModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
