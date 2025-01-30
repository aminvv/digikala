import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enum/swaggerConsumes.enum';
import { ProductColorService } from '../service/product-color.service';
import { AddColorDto, UpdateAddColorDto } from '../dto/color.dto';

@Controller('product-color')
@ApiTags("product-color")
export class ProductColorController {
  constructor(private readonly productColorService: ProductColorService) { }
  @Post("/create-product")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  create(@Body() colorDto: AddColorDto) {
    return this.productColorService.create(colorDto)
}


@Get("/find-product/:ProductId")
@ApiConsumes(swaggerConsumes.UrlEncoded)
find(@Param("ProductId",ParseIntPipe) productId:number) {
    return this.productColorService.find(productId)
  }


  @Put("/update-product/:id")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  update(@Param("id", ParseIntPipe) id: number, @Body() updateSizeDto: UpdateAddColorDto) { 
    return this.productColorService.update(id,updateSizeDto)
  }


  @Delete("/delete-product/:id")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  delete(@Param("id", ParseIntPipe) id: number) { 
    return this.productColorService.delete(id)

  }

}