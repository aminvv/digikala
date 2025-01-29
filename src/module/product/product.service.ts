import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductType } from './enum/type.enum';
import { toBoolean } from 'src/utils/functions';

@Injectable()
export class ProductService {
constructor(
    @InjectRepository(ProductEntity)private productRepository:Repository<ProductEntity>
){}


async create(createProductDto:CreateProductDto){
    const{active_discount,code,content,count,discount,price,slug,title,type}=createProductDto

    const productObject:DeepPartial<ProductEntity>={
        title,
        content,
        slug,
        code,
        discount,
        active_discount:toBoolean(active_discount),
    }
    if(type===ProductType.Single){
        productObject['type']=type
        Object.assign(productObject,{price,count,type})
    }else if([ProductType.Coloring,ProductType.Sizing].includes(type as any)){
        productObject['type']=type
    }else{
        throw new BadRequestException('type product is invalid')
    }

    await this.productRepository.save(productObject)
    return{
        message:"create product successfully"
    }
}

async update(id:number,updateProductDto:UpdateProductDto){
    const{active_discount,code,content,count,discount,price,slug,title,type}=updateProductDto
     
    const product=await this.findOneLean(id)
    if(title)product.title=title
    if(slug)product.slug=slug
    if(content)product.content=content
    if(discount)product.discount=discount
    if(active_discount)product.active_discount=toBoolean(active_discount)
    if(code)product.code=code

    if(type===ProductType.Single){
        Object.assign(product,{price,count})
    }

    await this.productRepository.save(product)
    return{
        message:"update product successfully"
    }
}

async find(){
    return this.productRepository.find({
        where:{},
        relations:{colors:true,sizes:true,details:true}
    })
}

async findOne(id:number){
    const product=this.productRepository.findOne({
        where:{id},
        relations:{colors:true,sizes:true,details:true}
    })
    if(!product){
        throw new NotFoundException()
    }
    return product
}

async findOneLean(id:number){
    const product=this.productRepository.findOne({
        where:{id},
    })
    if(!product){
        throw new NotFoundException()
    }
    return product
}

async delete(id:number){
    await this.findOne(id)
    await this.productRepository.delete(id)
    return {
        message:"Deleted product successfully"
    }
}

}
