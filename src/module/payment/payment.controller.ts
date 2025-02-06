import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { swaggerConsumes } from 'src/common/enum/swaggerConsumes.enum';
import { ApiConsumes, ApiProperty } from '@nestjs/swagger';
export class addressDto{
  @ApiProperty()
  address:string
}

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
 @ApiConsumes(swaggerConsumes.UrlEncoded)
   create(@Body() addressDto:addressDto ) {
    return this.paymentService.create(addressDto.address);
  }


}
