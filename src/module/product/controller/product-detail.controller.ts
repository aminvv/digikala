import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductService } from '../product.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enum/swaggerConsumes.enum';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import { AddDetailDto, UpdateAddDetailDto } from '../dto/detail.dto';


@Controller('product-detail')
@ApiTags("product-detail")
export class ProductDetailController {
  constructor(private readonly productService: ProductService) {}
@Post("/create-product")
@ApiConsumes(swaggerConsumes.UrlEncoded)
create(@Body()AddDetailDto:AddDetailDto){}


@Get("/find-product")
@ApiConsumes(swaggerConsumes.UrlEncoded)
find(){}


@Put("/update-product/:id")
@ApiConsumes(swaggerConsumes.UrlEncoded)
update(@Param()id:number,@Body("id" ,ParseIntPipe)updateAddDetailDto:UpdateAddDetailDto){}


@Delete("/delete-product/:id")
@ApiConsumes(swaggerConsumes.UrlEncoded)
delete(@Param("id" ,ParseIntPipe)id:number){}

}