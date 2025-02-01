import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TypeOrmConfig } from 'src/config/typeorm';
import { ProductModule } from '../product/product.module';
import { DiscountModule } from '../discount/discount.module';
import { BasketModule } from '../basket/basket.module';


@Module({
  imports: [ConfigModule.forRoot({envFilePath:join(process.cwd(),'.env'),isGlobal:true}),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    ProductModule,
    DiscountModule,
    BasketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
