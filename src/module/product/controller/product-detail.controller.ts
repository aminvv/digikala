import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enum/swaggerConsumes.enum';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import { AddDetailDto, UpdateAddDetailDto } from '../dto/detail.dto';
import { ProductDetailService } from '../service/product-detail.service';


@Controller('product-detail')
@ApiTags("product-detail")
export class ProductDetailController {
  constructor(private readonly productDetailService: ProductDetailService) { }
  @Post("/create-product")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  create(@Body() addDetailDto: AddDetailDto) {
    return this.productDetailService.create(addDetailDto)
  }


  @Get("/find-product/:ProductId")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  find(@Param("ProductId",ParseIntPipe) productId:number) {
    return this.productDetailService.find(productId)
   }


  @Put("/update-product/:id")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  update(@Param("id", ParseIntPipe) id: number, @Body() updateAddDetailDto: UpdateAddDetailDto) { 
    return this.productDetailService.update(id,updateAddDetailDto)
  }


  @Delete("/delete-product/:id")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.productDetailService.delete(id)
   }

}