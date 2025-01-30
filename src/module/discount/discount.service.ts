import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/discount.dto';
import { ProductService } from '../product/service/product.service';
import { DiscountType } from './enum/type.enum';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountEntity) private discountRepository: Repository<DiscountEntity>,
    private productService: ProductService,
  ) { }


  async create(createDiscountDto: CreateDiscountDto) {
    const { amount, code, expires_in, limit, percent, productId, type } = createDiscountDto
    let discountObject: DeepPartial<DiscountEntity> = {code}

    if (type == DiscountType.product) {
      const product = await this.productService.findOneLean(productId)
      discountObject['type'] = DiscountType.product
      discountObject['productId'] = product.id
    } else {
      discountObject['type'] = DiscountType.Basket
    }

    if(limit && !isNaN(parseInt(limit.toString()))){
      discountObject["limit"]= +limit
    }

    if ((amount && percent) || ((!amount && !percent))) {
      throw new BadRequestException("you should send one of the percent or amount")
    } 

    if (amount && isNaN(parseInt(amount.toString()))) {
      throw new BadRequestException("percent should be a number")
    }else if (amount) discountObject["amount"] = +amount

    if (percent && isNaN(parseInt(percent.toString()))) {
      throw new BadRequestException("percent should be a number")
    }else if (percent) discountObject["percent"] = +percent

    if (expires_in && new Date(expires_in).toString() == "Invalid Date") {
      throw new BadRequestException("expires in should be a date format")
    }else if (expires_in) discountObject["expires_in"] = new Date(expires_in)

    const discount = await this.getDiscountByCode(code)
    if (discount) throw new ConflictException("already exist discount code");

    await this.discountRepository.save(discountObject)
    return{
      message:" create discount successfully"
    }

  }

  async getDiscountByCode(code: string) {
    const discount = await this.discountRepository.findOneBy({ code })
    return discount
  }


  async find() { }

  async update() { }

  async delete() { }

}
