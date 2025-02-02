import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BasketService } from './basket.service';
import { AddToBasketDto } from './dto/create-basket.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enum/swaggerConsumes.enum';

@Controller('basket')
@ApiTags('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Post("/addToBasket")
   @ApiConsumes(swaggerConsumes.UrlEncoded,)
  addToBasket(@Body() addToBasketDto: AddToBasketDto) {
    return this.basketService.addToBasket(addToBasketDto);
  }

  // @Get()
  //  @ApiConsumes(swaggerConsumes.UrlEncoded)
  // BasketFind() {
  //   return this.basketService.BasketFind();
  // }

  // @Post('/add-discount')
  //  @ApiConsumes(swaggerConsumes.UrlEncoded)
  // addDiscountToBasket(@Param('id') id: string) { 
  //   return this.basketService.addDiscountToBasket(+id);
  // }

  // @Delete('/removeFromBasket')
  //  @ApiConsumes(swaggerConsumes.UrlEncoded)
  // removeFromBasket(@Param('id') id: string, @Body() addToBasketDto: AddToBasketDto) {
  //   return this.basketService.removeFromBasket(+id, addToBasketDto);
  // }

  // @Delete('/removeDiscount-FromBasket')
  //  @ApiConsumes(swaggerConsumes.UrlEncoded)
  // removeDiscountFromBasket(@Param('id') id: string) {
  //   return this.basketService.removeDiscountFromBasket(+id);
  //}
}
