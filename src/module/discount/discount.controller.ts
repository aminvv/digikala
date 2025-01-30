import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enum/swaggerConsumes.enum';
import { CreateDiscountDto } from './dto/discount.dto';


@Controller('discount')
@ApiTags('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post("/create-discount")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  create(@Body() createDiscountDto:CreateDiscountDto) {
    return this.discountService.create(createDiscountDto)
}
}
