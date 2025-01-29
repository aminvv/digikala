import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductService } from '../product.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { swaggerConsumes } from 'src/common/enum/swaggerConsumes.enum';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';


@Controller('product')
@ApiTags("product")
export class ProductController {
  constructor(private readonly productService: ProductService) { }
  @Post("/create-product")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto)
  }


  @Get("/find-product")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  find(){ 
    return this.productService.find()
  }


  @Get("/find-product/:id")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  findOne(@Param("id") id:number){ 
    return this.productService.findOne(id)
  }


  @Put("/update-product/:id")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  update(@Param("id", ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) { 
    return this.productService.update(id,updateProductDto)
  }


  @Delete("/delete-product/:id")
  @ApiConsumes(swaggerConsumes.UrlEncoded)
  delete(@Param("id", ParseIntPipe) id: number) { 
    return this.productService.delete(id)

  }

}
