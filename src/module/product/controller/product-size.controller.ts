import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enum/swaggerConsumes.enum';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import { AddSizeDto, UpdateAddSizeDtoDto } from '../dto/size.dto';


@Controller('product-size')
@ApiTags("product-size")
export class ProductSizeController {
  constructor(private readonly productService: ProductService) {}
@Post("/create-product")
@ApiConsumes(swaggerConsumes.UrlEncoded)
create(@Body()SizeDto:AddSizeDto){}


@Get("/find-product")
@ApiConsumes(swaggerConsumes.UrlEncoded)
find(){}


@Put("/update-product/:id")
@ApiConsumes(swaggerConsumes.UrlEncoded)
update(@Param()id:number,@Body("id" ,ParseIntPipe)updateSizeDto:UpdateAddSizeDtoDto){}


@Delete("/delete-product/:id")
@ApiConsumes(swaggerConsumes.UrlEncoded)
delete(@Param("id" ,ParseIntPipe)id:number){}

}