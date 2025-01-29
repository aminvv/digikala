import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../entities/product.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';
import { ProductType } from '../enum/type.enum';
import { toBoolean } from 'src/utils/functions';
import { ProductDetailEntity } from '../entities/product-detail.entity';
import { AddDetailDto, UpdateAddDetailDto } from '../dto/detail.dto';
import { ProductService } from './product.service';

@Injectable()
export class ProductDetailService {
    constructor(
        @InjectRepository(ProductDetailEntity) private productDetailRepository: Repository<ProductDetailEntity>,
        private productService: ProductService

    ) { }


    async create(detailDto: AddDetailDto) {
        const { key, productId, value } = detailDto
        await this.productService.findOne(productId)
        await this.productDetailRepository.insert({
            key,
            value,
            productId,
        })

        return {
            message: "create detail of product successfully"
        }
    }

    async update(id: number, updateAddDetailDto: UpdateAddDetailDto) {
        const { key, productId, value } = updateAddDetailDto
        const detail = await this.findOne(id)
        if (productId) {
            await this.productService.findOneLean(productId)
            detail.productId = productId 
        }
        if (key) detail.key = key
        if (value) detail.value = value
        await this.productDetailRepository.save(detail)

        return {
            message: "update detail of product successfully"
        }
    }

    async find(productId:number) {
        return this.productDetailRepository.find({
            where: {productId},
        })
    }

    async findOne(id: number) {
        const detail = this.productDetailRepository.findOne({
            where: { id },
        })
        if (!detail) {
            throw new NotFoundException()
        }
        return detail
    }

    async delete(id: number) {
        await this.findOne(id)
        await this.productDetailRepository.delete(id)
        return {
            message: "Deleted detail of product successfully"
        }
    }

}
