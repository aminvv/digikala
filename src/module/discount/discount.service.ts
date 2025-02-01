import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';
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

  async update(id:number,  UpdateDiscountDto:UpdateDiscountDto) { 
    const discount=await this.discountRepository.findOneBy({id})
    if(!discount)throw new NotFoundException("not found discount")
    const { amount, code, expires_in, limit, percent, productId, type } = UpdateDiscountDto
1
    if (type == DiscountType.product) {
      const product = await this.productService.findOneLean(productId)
      discount.type = DiscountType.product
      discount.productId = product.id
    } else if(type === DiscountType.Basket){
      discount.type= DiscountType.Basket
    }

    if(limit && !isNaN(parseInt(limit.toString()))){
      discount.limit= +limit
    }

    if ((amount && percent )) {
      throw new BadRequestException("you should send one of the percent or amount")
    } 

    if (amount && isNaN(parseInt(amount.toString()))) {
      throw new BadRequestException("percent should be a number")
    }else if (amount) discount.amount = +amount

    if (percent && isNaN(parseInt(percent.toString()))) {
      throw new BadRequestException("percent should be a number")
    }else if (percent)discount.percent = +percent

    if (expires_in && new Date(expires_in).toString() == "Invalid Date") {
      throw new BadRequestException("expires in should be a date format")
    }else if (expires_in) discount.expires_in = new Date(expires_in)

    if(code){
      const discountRow=await this.getDiscountByCode(code)
      if(discountRow && discountRow.id !== id){
         throw new ConflictException("already exist discount code");
      }
      discount.code=code
    }

    await this.discountRepository.save(discount)
    return{
      message:" update discount successfully"
    }
  }

  async find() {
    return await this.discountRepository.find()
   }


  async delete(id:number) { 
    const discount=await this.discountRepository.findOneBy({id})
    if(!discount)throw new NotFoundException("not found discount")
      await this.discountRepository.delete(id)
    return {
      message:"Deleted discount successfully"
    }
  }

}
 