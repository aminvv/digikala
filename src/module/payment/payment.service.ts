import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { BasketService } from '../basket/basket.service';
import { HttpService } from '@nestjs/axios';
import { ZarinnpalService } from '../http/zarinnpal.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)private paymentRepository:Repository<PaymentEntity>,
    private basketService:BasketService,
    private zarinnpalService:ZarinnpalService,
  ){}
 async create(){
  const user= {email:"aminviper1378@gamil.vcom",mobile:"09104316251"}
  const basket=await this.basketService.getBasket()
  return await this.zarinnpalService.sendRequest({
    amount:basket.finalAmount,
    description:"buy product physical",
    user,
  })
 }
}
