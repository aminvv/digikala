import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BasketDto } from './dto/create-basket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BasketEntity } from './entities/basket.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ProductService } from '../product/service/product.service';
import { ProductType } from '../product/enum/type.enum';
import { ProductColorService } from '../product/service/product-color.service';
import { ProductSizeService } from '../product/service/product-size.service';
import { ProductSizeEntity } from '../product/entities/product-size.entity';
import { ProductColorEntity } from '../product/entities/product-color.entity';
import { AddDiscountToBasketDto } from './dto/create-discount.dto';
import { DiscountEntity } from '../discount/entities/discount.entity';
import { DiscountService } from '../discount/discount.service';
import { DiscountType } from '../discount/enum/type.enum';

@Injectable()
export class BasketService {
    constructor(
        @InjectRepository(BasketEntity) private basketRepository: Repository<BasketEntity>,
        private productService: ProductService,
        private productColorService: ProductColorService,
        private productSizeService: ProductSizeService,
        private discountService: DiscountService,
    ) { }
    async addToBasket(addToBasket: BasketDto) {
        const { colorId, productId, sizeId } = addToBasket;
        let size: ProductSizeEntity;
        let color: ProductColorEntity;
        let where: FindOptionsWhere<BasketEntity> = {};

        const product = await this.productService.findOneLean(productId);
        if (product.count === 0)
            throw new BadRequestException("product inventory not enough");

        where["productId"] = product.id;

        if (product.type === ProductType.Coloring && !colorId) {
            throw new BadRequestException("You should select some color");
        } else if (product.type === ProductType.Coloring && colorId) {
            if (isNaN(parseInt(colorId?.toString()))) {
                throw new BadRequestException("You should select some color");
            }
            color = await this.productColorService.findOne(colorId);
            if (!color) {
                throw new BadRequestException("Selected color does not exist");
            }
            where["colorId"] = color.id;
        }

        if (product.type === ProductType.Sizing && !sizeId) {
            throw new BadRequestException("You should select a size");
        } else if (product.type === ProductType.Sizing && sizeId) {
            if (isNaN(parseInt(sizeId?.toString()))) {
                throw new BadRequestException("You should select a size");
            }
            size = await this.productSizeService.findOne(sizeId);
            if (!size) {
                throw new BadRequestException("Selected size does not exist");
            }
            where["sizeId"] = size.id;
        }

        let basketItem = await this.basketRepository.findOne({ where });

        if (basketItem) {
            basketItem.count += 1;
            if (basketItem.count > product.count) {
                throw new BadRequestException("product inventory not enough");
            }
        } else {
            basketItem = this.basketRepository.create({
                productId,
                sizeId: size ? size.id : null,
                colorId: color ? color.id : null,
                count: 1,
            });
        }

        await this.basketRepository.save(basketItem);
        return {
            message: "product added to basket",
        };
    }

    async removeFromBasket(removeBasketDto: BasketDto) {
        const { colorId, productId, sizeId } = removeBasketDto
        let size: ProductSizeEntity;
        let color: ProductColorEntity;
        let where: FindOptionsWhere<BasketEntity> = {};

        const product = await this.productService.findOneLean(productId);


        where["productId"] = product.id;

        if (product.type === ProductType.Coloring && !colorId) {
            throw new BadRequestException("You should select some color");
        } else if (product.type === ProductType.Coloring && colorId) {
            if (isNaN(parseInt(colorId?.toString()))) {
                throw new BadRequestException("You should select some color");
            }
            color = await this.productColorService.findOne(colorId);
            if (!color) {
                throw new BadRequestException("Selected color does not exist");
            }
            where["colorId"] = color.id;
        }

        if (product.type === ProductType.Sizing && !sizeId) {
            throw new BadRequestException("You should select a size");
        } else if (product.type === ProductType.Sizing && sizeId) {
            if (isNaN(parseInt(sizeId?.toString()))) {
                throw new BadRequestException("You should select a size");
            }
            size = await this.productSizeService.findOne(sizeId);
            if (!size) {
                throw new BadRequestException("Selected size does not exist");
            }
            where["sizeId"] = size.id;
        }

        let basketItem = await this.basketRepository.findOne({ where });

        if (basketItem) {
            if (basketItem.count <= 1) {
                await this.basketRepository.delete({ id: basketItem.id })
            } else {
                basketItem.count -= 1;
                await this.basketRepository.save(basketItem);
            }

        } else {
            throw new NotFoundException(" not found item in basket")
        }

        return {
            message: "product remove from  basket",
        };
    }

    async removeFromBasketById(id: number) {
        let basketItem = await this.basketRepository.findOneBy({ id });
        if (basketItem) {
            if (basketItem.count <= 1) {
                await this.basketRepository.delete({ id: basketItem.id })
            } else {
                basketItem.count -= 1;
                await this.basketRepository.save(basketItem);
            }

        } else {
            throw new NotFoundException(" not found item in basket")
        }

        return {
            message: "product remove from  basket",
        };
    }

    async addDiscountToBasket(addDiscountBasket: AddDiscountToBasketDto) {
        const { code } = addDiscountBasket
        const discount = await this.discountService.getDiscountByCode(code)
        if (!discount) throw new NotFoundException("notFound discount")
        if (discount.type === DiscountType.product && discount.productId) {
            const basketItem = await this.basketRepository.findOneBy({
                productId: discount.productId,
                
            })
            if (!basketItem) {
                throw new BadRequestException("not found item for this discount code")
            }
        }
        if (discount.limit && (discount.limit <= 0 || discount.usage >= discount.limit)) {
            throw new BadRequestException("discount is limited")
        }
        if (discount.expires_in && discount.expires_in >= new Date()) {
            throw new BadRequestException("discount is expired")
        }

        const existDiscount = await this.basketRepository.findOneBy({ discountId: discount.id })
        if (existDiscount) {
            throw new BadRequestException("already exist discount in basket ")
        }
        if (discount.type == DiscountType.Basket) {
            const item = await this.basketRepository.findOne({
                relations: {
                    discount: true
                },
                where: {
                    discount: { type: DiscountType.Basket }
                }
            })
            if (item) {
                throw new BadRequestException('you already used basket discount  ')
            }
        }
        const basketItem = await this.basketRepository.findOneBy({
            productId: discount?.productId
        });

        await this.basketRepository.insert({
            productId: discount?.productId,
            discountId: discount.id,
            count:0
        })


        return {
            message: "discount added"
        }
    }
}
