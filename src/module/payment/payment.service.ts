import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { BasketService } from '../basket/basket.service';
import { ZarinnpalService } from '../http/zarinnpal.service';
import { OrderEntity } from '../order/entities/order.entity';
import { OrderItemEntity } from '../order/entities/order-Items.entity';
import { OrderStatus } from '../order/enum/order.enum';
import * as shortid from 'shortid';
import { addressDto } from './payment.controller';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)private paymentRepository:Repository<PaymentEntity>,
    @InjectRepository(OrderEntity)private orderRepository:Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)private orderItemRepository:Repository<OrderItemEntity>,
    private basketService:BasketService,
    private zarinnpalService:ZarinnpalService,
  ){}
  async create(address: string) {
    const user = {email: "erfanyousefi.co@gmail.com", mobile: "09332255768"};
    const basket = await this.basketService.getBasket();
    let order = this.orderRepository.create({
      final_amount: basket.finalAmount,
      total_amount: basket.totalPrice,
      discount_amount: basket.totalDiscountAmount,
      address,
      status: OrderStatus.Pending,
    });
    order = await this.orderRepository.save(order);
    let orderItems = basket.products.map((product) => {
      return {
        orderId: order.id,
        productId: product.id,
        colorId: product?.colorId,
        sizeId: product?.sizeId,
        count: product?.count,
      };
    });
    await this.orderItemRepository.insert(orderItems);
    const {authority, gateWayUrl} = await this.zarinnpalService.sendRequest({
      amount: basket.finalAmount,
      description: "خرید محصولات فیزیکی",
      user,
    });
    let payment = this.paymentRepository.create({
      amount: basket.finalAmount,
      authority,
      orderId: order.id,
      invoice_number: shortid.generate(),
      status: false,
    });
    payment = await this.paymentRepository.save(payment);
    order.paymentId = payment.id;
    await this.orderRepository.save(order);
    return {gateWayUrl};
  }
}
