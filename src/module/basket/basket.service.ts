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
        let products = [];
        let discounts = [];
        let finalAmount = 0;
        let totalPrice = 0;
        let totalDiscountAmount = 0;
        const items = await this.basketRepository.find({
          where: {},
          relations: {
            product: true,
            color: true,
            size: true,
            discount: true,
          },
        });
        const productDiscounts = items.filter(
          (item) =>
            item?.discountId && item?.discount?.type === DiscountType.product
        );
        for (const item of items) {
          const {product, color, size, discount, count} = item;
          let discountAmount = 0;
          if (product?.type === ProductType.Single) {
            totalPrice += +product.price;
            if (product?.active_discount) {
              const {newDiscountAmount, newPrice} = this.checkDiscountPercent(
                +product.price,
                +product.discount
              );
              discountAmount = newDiscountAmount;
              product.price = newPrice;
              totalDiscountAmount += discountAmount;
            }
            const existDiscount = productDiscounts.find(
              (dis) => dis.productId === product.id
            );
            if (existDiscount) {
              const {discount} = existDiscount;
              if (this.validateDiscount(discount)) {
                discounts.push({
                  percent: discount.percent,
                  amount: discount.amount,
                  code: discount.code,
                  type: discount.type,
                  productId: discount.productId,
                });
                if (discount.percent) {
                  const {newDiscountAmount, newPrice} = this.checkDiscountPercent(
                    product.price,
                    discount.percent
                  );
                  product.price = newPrice;
                  discountAmount += newDiscountAmount;
                } else if (discount.amount) {
                  const {newDiscountAmount, newPrice} = this.checkDiscountAmount(
                    product.price,
                    discount.amount
                  );
                  product.price = newPrice;
                  discountAmount += newDiscountAmount;
                }
                totalDiscountAmount += discountAmount;
              }
            }
            finalAmount += +product.price * count;
            products.push({
              id: product.id,
              slug: product.slug,
              title: product.title,
              active_discount: product.active_discount,
              discount: product.discount,
              price: product.price,
            });
          } else if (product?.type === ProductType.Sizing) {
            totalPrice += +size.price;
            if (size?.active_discount) {
              const {newDiscountAmount, newPrice} = this.checkDiscountPercent(
                +size.price,
                +size.discount
              );
              discountAmount = newDiscountAmount;
              size.price = newPrice;
            }
            const existDiscount = productDiscounts.find(
              (dis) => dis.productId === product.id
            );
            if (existDiscount) {
              const {discount} = existDiscount;
              if (this.validateDiscount(discount)) {
                discounts.push({
                  percent: discount.percent,
                  amount: discount.amount,
                  code: discount.code,
                  type: discount.type,
                  productId: discount.productId,
                });
                if (discount.percent) {
                  const {newDiscountAmount, newPrice} = this.checkDiscountPercent(
                    size.price,
                    discount.percent
                  );
                  size.price = newPrice;
                  discountAmount += newDiscountAmount;
                } else if (discount.amount) {
                  const {newDiscountAmount, newPrice} = this.checkDiscountAmount(
                    size.price,
                    discount.amount
                  );
                  size.price = newPrice;
                  discountAmount += newDiscountAmount;
                }
              }
            }
            totalDiscountAmount += discountAmount;
            finalAmount += +size.price * count;
            products.push({
              id: product.id,
              slug: product.slug,
              title: product.title,
              active_discount: size.active_discount,
              discount: size.discount,
              sizeId: size.id,
              price: size.price,
              size: size.size,
            });
          } else if (product?.type === ProductType.Coloring) {
            totalPrice += +color.price;
            if (color?.active_discount) {
              const {newDiscountAmount, newPrice} = this.checkDiscountPercent(
                +color.price,
                +color.discount
              );
              discountAmount = newDiscountAmount;
              color.price = newPrice;
            }
            const existDiscount = productDiscounts.find(
              (dis) => dis.productId === product.id
            );
            if (existDiscount) {
              const {discount} = existDiscount;
              if (this.validateDiscount(discount)) {
                discounts.push({
                  percent: discount.percent,
                  amount: discount.amount,
                  code: discount.code,
                  type: discount.type,
                  productId: discount.productId,
                });
                if (discount.percent) {
                  const {newDiscountAmount, newPrice} = this.checkDiscountPercent(
                    color.price,
                    discount.percent
                  );
                  color.price = newPrice;
                  discountAmount += newDiscountAmount;
                } else if (discount.amount) {
                  const {newDiscountAmount, newPrice} = this.checkDiscountAmount(
                    color.price,
                    discount.amount
                  );
                  color.price = newPrice;
                  discountAmount += newDiscountAmount;
                }
              }
            }
            totalDiscountAmount += discountAmount;
            finalAmount += +color.price * count;
            products.push({
              id: product.id,
              slug: product.slug,
              title: product.title,
              active_discount: color.active_discount,
              discount: color.discount,
              price: color.price,
              colorId: color.id,
              color_code: color.color_code,
              color_name: color.color_name,
            });
          } else if (discount) {
            if (this.validateDiscount(discount)) {
              if (discount.type === DiscountType.Basket) {
                discounts.push({
                  percent: discount.percent,
                  amount: discount.amount,
                  code: discount.code,
                  type: discount.type,
                  productId: discount.productId,
                });
                if (discount.percent) {
                  const {newDiscountAmount, newPrice} = this.checkDiscountPercent(
                    finalAmount,
                    discount.percent
                  );
                  finalAmount = newPrice;
                  discountAmount = +newDiscountAmount;
                } else if (discount.amount) {
                  const {newDiscountAmount, newPrice} = this.checkDiscountAmount(
                    finalAmount,
                    discount.amount
                  );
                  finalAmount = newPrice;
                  discountAmount = newDiscountAmount;
                }
                totalDiscountAmount += discountAmount;
              }
            }
          }
        }
        return {
          totalPrice,
          finalAmount,
          totalDiscountAmount,
          productDiscounts,
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

    validateDiscount(discount: DiscountEntity) {
        let limitCondition = discount.limit && discount.limit > discount.usage;
        let timeCondition = discount.expires_in && discount.expires_in > new Date();
        return limitCondition || timeCondition;
      }
      checkDiscountPercent(price: number, percent: number) {
        let newDiscountAmount = +price * (+percent / 100);
        let newPrice = +newDiscountAmount > +price ? 0 : +price - newDiscountAmount;
        return {
          newPrice,
          newDiscountAmount,
        };
      }
      checkDiscountAmount(price: number, amount: number) {
        let newPrice = +amount > +price ? 0 : +price - +amount;
        return {
          newPrice,
          newDiscountAmount: +amount,
        };
      }
}
