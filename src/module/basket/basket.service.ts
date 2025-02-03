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
import { count } from 'console';

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

    async getBasket() {
        let products = []
        let discounts = []
        let finalAmount = 0
        let totalDiscountAmount = 0

        const items = await this.basketRepository.find({
            where: {},
            relations: {
                product: true,
                color: true,
                size: true,
                discount: true,
            }
        })

        const productDiscount = items.filter(item => item?.discountId && item?.discount.type == DiscountType.product)

        for (const item of items) {
            const { color, size, product, discount } = item
            let discountAmount = 0
            const count = Number(item.count);


            if (product?.type === ProductType.Single) {
                const price = Number(product.price);
                if (product?.active_discount) {
                    discountAmount = price * (Number(product.discount) / 100);
                    totalDiscountAmount += discountAmount;
                    price - discountAmount
                }
                const existDiscount = productDiscount.find(dis => dis.productId === product.id)
                if (existDiscount) {
                    const { discount } = existDiscount
                    let limitCondition = discount.limit && discount.limit > discount.usage;
                    let timeCondition = discount.expires_in && discount.expires_in > new Date();

                    if (limitCondition || timeCondition) {
                        discounts.push({
                            percent: discount.percent,
                            amount: discount.amount,
                            code: discount.code,
                            type: discount.type,
                            productId: discount.productId,
                        });
                        if (discount.percent) {
                            discountAmount += product.price * (discount.percent / 100);
                            product.price = discountAmount > product.price ? 0 : product.price - discountAmount;
                        } else if (discount.amount) {
                            discountAmount = +discount.amount;
                            product.price = discountAmount > product.price ? 0 : product.price - discountAmount;
                        }
                        totalDiscountAmount += discountAmount;
                    }

                }
                finalAmount += price * count;
                products.push({
                    id: product.id,
                    slug: product.slug,
                    title: product.title,
                    active_discount: product.active_discount,
                    discount: product.discount,
                    price: product.price
                });
            }
            else if (product?.type === ProductType.Sizing) {
                const price = Number(size?.price);
                if (size?.active_discount) {
                    discountAmount = price * (Number(size.discount) / 100);
                    totalDiscountAmount += discountAmount;
                    size.price-=discountAmount
                }
                const existDiscount = productDiscount.find(dis => dis.productId === product.id)
                if (existDiscount) {
                    const { discount } = existDiscount
                    let limitCondition = discount.limit && discount.limit > discount.usage;
                    let timeCondition = discount.expires_in && discount.expires_in > new Date();

                    if (limitCondition || timeCondition) {
                        discounts.push({
                            percent: discount.percent,
                            amount: discount.amount,
                            code: discount.code,
                            type: discount.type,
                            productId: discount.productId,
                        });
                        if (discount.percent) {
                            discountAmount += product.price * (discount.percent / 100);
                            product.price = discountAmount > product.price ? 0 : product.price - discountAmount;
                        } else if (discount.amount) {
                            discountAmount = +discount.amount;
                            product.price = discountAmount > product.price ? 0 : product.price - discountAmount;
                        }
                        totalDiscountAmount += discountAmount;
                    }

                }
                finalAmount += price * count;
                products.push({
                    id: product.id,
                    slug: product.slug,
                    title: product.title,
                    active_discount: size.active_discount,
                    discount: size.discount,
                    price: size.price,
                    size: size.size
                });
            }
            else if (product?.type === ProductType.Coloring) {
                const price = Number(color?.price);
                if (color?.active_discount) {
                    discountAmount = price * (Number(color?.discount) / 100);
                    totalDiscountAmount += discountAmount;
                }
                const existDiscount = productDiscount.find(dis => dis.productId === product.id)
                if (existDiscount) {
                    const { discount } = existDiscount
                    let limitCondition = discount.limit && discount.limit > discount.usage;
                    let timeCondition = discount.expires_in && discount.expires_in > new Date();

                    if (limitCondition || timeCondition) {
                        discounts.push({
                            percent: discount.percent,
                            amount: discount.amount,
                            code: discount.code,
                            type: discount.type,
                            productId: discount.productId,
                        });
                        if (discount.percent) {
                            discountAmount += product.price * (discount.percent / 100);
                            product.price = discountAmount > color.price ? 0 : color.price - discountAmount;
                        } else if (discount.amount) {
                            discountAmount = +discount.amount;
                            color.price = discountAmount > color.price ? 0 : color.price - discountAmount;
                        }
                        totalDiscountAmount += discountAmount;
                    }

                }
                finalAmount += color.price * count;
                products.push({
                    id: product.id,
                    slug: product.slug,
                    title: product.title,
                    active_discount: color.active_discount,
                    discount: color.discount,
                    price: color.price,
                    color_code: color.color_code,
                    color_name: color.color_name,
                });
            }
            else if (discount) {
                let limitCondition = discount.limit && discount.limit > discount.usage;
                let timeCondition = discount.expires_in && discount.expires_in > new Date();

                if (discount.type === DiscountType.Basket) {
                    if (limitCondition || timeCondition) {
                        discounts.push({
                            percent: discount.percent,
                            amount: discount.amount,
                            code: discount.code,
                            type: discount.type,
                            productId: discount.productId,
                        });
                        if (discount.percent) {
                            discountAmount = finalAmount * (discount.percent / 100);
                            finalAmount = discountAmount > finalAmount ? 0 : finalAmount - discountAmount;
                        } else if (discount.amount) {
                            discountAmount = +discount.amount;
                            finalAmount = discountAmount > finalAmount ? 0 : finalAmount - discountAmount;
                        }
                        totalDiscountAmount += discountAmount;
                    }
                }
            }
        }

        return {
            finalAmount: isNaN(finalAmount) ? 0 : finalAmount,
            totalDiscountAmount,
            productDiscount,
            products,
            discounts,
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
            count: 0
        })


        return {
            message: "discount added"
        }
    }


    async removeDiscountFromBasket(addDiscountBasket: AddDiscountToBasketDto) {
        const { code } = addDiscountBasket
        const discount = await this.discountService.getDiscountByCode(code)
        if (!discount) throw new NotFoundException("notFound discount")

        const existDiscount = await this.basketRepository.findOneBy({ discountId: discount.id })
        if (existDiscount) {
            await this.basketRepository.delete({ id: existDiscount.id })
        } else {
            throw new NotFoundException("notFound discount")
        }

        return {
            message: "discount removed"
        }
    }


}
