import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { toBoolean } from 'src/utils/functions';
import { ProductService } from './product.service';
import { AddColorDto, UpdateAddColorDto,   } from '../dto/color.dto';
import { ProductType } from '../enum/type.enum';
import { ProductColorEntity } from '../entities/product-color.entity';
import { AddSizeDto } from '../dto/size.dto';

@Injectable()
export class ProductColorService {
    constructor(
        @InjectRepository(ProductColorEntity) private productColorRepository: Repository<ProductColorEntity>,
        @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
        private productService: ProductService,
        private dataSource: DataSource

    ) { }


    async create(colorDto: AddColorDto) {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        try {
            await queryRunner.startTransaction()
            const { productId, active_discount, count, discount, price,color_code,color_name } = colorDto
            let product = await queryRunner.manager.findOneBy(ProductEntity, { id: productId })
            if (product.type !== ProductType.Coloring) throw new BadRequestException("product type is n't Coloring")
            if (!product) throw new NotFoundException("not found product")
            await queryRunner.manager.insert(ProductColorEntity, {
                count,
                discount,
                price,
                color_code,
                color_name,
                active_discount: toBoolean(active_discount),
                productId,
            })
            if (!isNaN(parseInt(count.toString())) && +count > 0) {
                product.count = parseInt(product.count.toString()) + parseInt(count.toString())
                await queryRunner.manager.save(ProductEntity, product)
            }
            await queryRunner.commitTransaction()
            await queryRunner.release()
            return {
                message: "create color of product successfully"
            }
        } catch (error) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            throw error
        }

    }

    async update(id: number, sizeDto: UpdateAddColorDto) {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        try {
            await queryRunner.startTransaction()
            const { productId, active_discount, count, discount, price, color_name,color_code } = sizeDto
            let product = await queryRunner.manager.findOneBy(ProductEntity, { id: productId })
            if (!product) throw new NotFoundException("not found product")

            let color = await queryRunner.manager.findOneBy(ProductColorEntity, { id })
            if (!color) throw new NotFoundException("not found product")

            if (color_name) color.color_name = color_name
            if (color_code) color.color_code =color_code 
            if (active_discount) color.active_discount = toBoolean(active_discount)
            if (discount) color.discount = discount
            if (price) color.price = price
            let perviousCount = color.count

            if (!isNaN(parseInt(count.toString())) && +count > 0) {
                product.count = parseInt(product.count.toString()) - parseInt(perviousCount.toString())
                product.count = parseInt(product.count.toString()) + parseInt(count.toString())
                color.count = count
                await queryRunner.manager.save(ProductEntity, product)
            }
            await queryRunner.manager.save(ProductColorEntity, color)
            await queryRunner.commitTransaction()
            await queryRunner.release()
            return {
                message: "create color of product successfully"
            }
        } catch (error) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            throw error
        }
    }

    async find(productId: number) {
        return this.productColorRepository.find({
            where: { productId },
        })
    }

    async findOne(id: number) {
        const color = this.productColorRepository.findOne({
            where: { id },
        })
        if (!color) {
            throw new NotFoundException()
        }
        return color
    }

    async delete(id: number) {
        const color =await this.findOne(id)
        if(color.count && color.count>0){
            const product =await this.productRepository.findOneBy({id:color.productId})
            product.count=parseInt(product.count.toString())- parseInt(color.count.toString())
            await this.productRepository.save(product)
        }
        await this.productColorRepository.delete(id)
        return {
            message: "Deleted color of product successfully"
        }
    }

}
