import { BaseEntityCustom } from "src/common/abstract/baseEntity.entity";
import { EntityName } from "src/common/enum/entityName.enum";
import { Column,  Entity, ManyToOne } from "typeorm";
import { OrderStatus } from "../enum/order.enum";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "src/module/product/entities/product.entity";
import { ProductSizeEntity } from "src/module/product/entities/product-size.entity";
import { ProductColorEntity } from "src/module/product/entities/product-color.entity";

@Entity(EntityName.OrderItem)
export class OrderItemEntity extends BaseEntityCustom {
    @Column()
    orderId: number
    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
    status:string
    @Column()
    productId: string
    @Column({ nullable: true })
    colorId: number
    @Column({ nullable: true })
    sizeId: number

    @ManyToOne(() => OrderEntity, (order) => order.orderItems)
    order: OrderEntity
    @ManyToOne(() => ProductEntity, (product) => product.orderItems)
    product: ProductEntity
    @ManyToOne(() => ProductSizeEntity, (size) => size.orderItems)
    size: ProductSizeEntity
    @ManyToOne(() => ProductColorEntity, (color) => color.orderItems)
    color: ProductColorEntity

}
