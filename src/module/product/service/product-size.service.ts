import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { toBoolean } from 'src/utils/functions';
import { ProductService } from './product.service';
import { ProductSizeEntity } from '../entities/product-size.entity';
import { AddSizeDto, UpdateAddSizeDto } from '../dto/size.dto';
import { ProductType } from '../enum/type.enum';

@Injectable()
export class ProductSizeService {
    constructor(
        @InjectRepository(ProductSizeEntity) private productSizeRepository: Repository<ProductSizeEntity>,
        @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
        private productService: ProductService,
        private dataSource: DataSource

    ) { }


    async create(sizeDto: AddSizeDto) {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        try {
            await queryRunner.startTransaction()
            const { productId, active_discount, count, discount, price, size } = sizeDto
            let product = await queryRunner.manager.findOneBy(ProductEntity, { id: productId })
            if (product.type == ProductType.Single) throw new BadRequestException("product type is Single")
            if (!product) throw new NotFoundException("not found product")
            await queryRunner.manager.insert(ProductSizeEntity, {
                count,
                discount,
                price,
                size,
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
                message: "create detail of product successfully"
            }
        } catch (error) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            throw error
        }

    }

    async update(id: number, sizeDto: UpdateAddSizeDto) {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        try {
            await queryRunner.startTransaction()
            const { productId, active_discount, count, discount, price, size: sizeTitle } = sizeDto
            let product = await queryRunner.manager.findOneBy(ProductEntity, { id: productId })
            if (!product) throw new NotFoundException("not found product")

            let size = await queryRunner.manager.findOneBy(ProductSizeEntity, { id })
            if (!size) throw new NotFoundException("not found product")

            if (sizeTitle) size.size = sizeTitle
            if (active_discount) size.active_discount = toBoolean(active_discount)
            if (discount) size.discount = discount
            if (price) size.price = price
            let perviousCount = size.count

            if (!isNaN(parseInt(count.toString())) && +count > 0) {
                product.count = parseInt(product.count.toString()) - parseInt(perviousCount.toString())
                product.count = parseInt(product.count.toString()) + parseInt(count.toString())
                size.count = count
                await queryRunner.manager.save(ProductEntity, product)
            }
            await queryRunner.manager.save(ProductSizeEntity, size)
            await queryRunner.commitTransaction()
            await queryRunner.release()
            return {
                message: "create detail of product successfully"
            }
        } catch (error) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            throw error
        }
    }

    async find(productId: number) {
        return this.productSizeRepository.find({
            where: { productId },
        })
    }

    async findOne(id: number) {
        const detail = this.productSizeRepository.findOne({
            where: { id },
        })
        if (!detail) {
            throw new NotFoundException()
        }
        return detail
    }

    async delete(id: number) {
        await this.findOne(id)
        await this.productSizeRepository.delete(id)
        return {
            message: "Deleted detail of product successfully"
        }
    }

}
