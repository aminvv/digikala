import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enum/swaggerConsumes.enum';
import { AddSizeDto, UpdateAddSizeDto } from '../dto/size.dto';
import { ProductSizeService } from '../service/product-size.service';


@Controller('product-size')
@ApiTags("product-size")
export class ProductSizeController {
  constructor(private readonly productSizeService: ProductSizeService) { }
  @Post("/create-product")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  create(@Body() SizeDto: AddSizeDto) {
    return this.productSizeService.create(SizeDto)
}


@Get("/find-product/:ProductId")
@ApiConsumes(swaggerConsumes.UrlEncoded)
find(@Param("ProductId",ParseIntPipe) productId:number) {
    return this.productSizeService.find(productId)
  }


  @Put("/update-product/:id")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  update(@Param("id", ParseIntPipe) id: number, @Body() updateSizeDto: UpdateAddSizeDto) { 
    return this.productSizeService.update(id,updateSizeDto)
  }


  @Delete("/delete-product/:id")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  delete(@Param("id", ParseIntPipe) id: number) { 
    return this.productSizeService.delete(id)

  }

}