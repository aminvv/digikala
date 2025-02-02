import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketDto } from './dto/create-basket.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enum/swaggerConsumes.enum';
import { AddDiscountToBasketDto } from './dto/create-discount.dto';

@Controller('basket')
@ApiTags('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) { }

  @Post("/addToBasket")
  @ApiConsumes(swaggerConsumes.UrlEncoded,)
  addToBasket(@Body() addToBasketDto: BasketDto) {
    return this.basketService.addToBasket(addToBasketDto);
  }

  // @Get()
  //  @ApiConsumes(swaggerConsumes.UrlEncoded)
  // BasketFind() {
  //   return this.basketService.BasketFind();
  // }

  @Post('/add-discount')
   @ApiConsumes(swaggerConsumes.UrlEncoded)
  addDiscountToBasket(@Body() addDiscountBasket: AddDiscountToBasketDto) { 
    return this.basketService.addDiscountToBasket(addDiscountBasket);
  }

  @Delete('/removeFromBasket')
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  removeFromBasket(@Body() removeBasketDto: BasketDto) {
    return this.basketService.removeFromBasket(removeBasketDto);
  }

  @Delete('/removeFromBasketById/:id')
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  removeFromBasketById(@Param("id",ParseIntPipe) id: number) {
    return this.basketService.removeFromBasketById(id);
  }

  // @Delete('/removeDiscount-FromBasket')
  //  @ApiConsumes(swaggerConsumes.UrlEncoded)
  // removeDiscountFromBasket(@Param('id') id: string) {
  //   return this.basketService.removeDiscountFromBasket(+id);
  //}
}
