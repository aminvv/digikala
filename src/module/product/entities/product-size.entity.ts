
import { BaseEntityCustom } from "src/common/abstract/baseEntity.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ProductEntity } from "./product.entity";
import { EntityName } from "src/common/enum/entityName.enum";
import { BasketEntity } from "src/module/basket/entities/basket.entity";
import { OrderItemEntity } from "src/module/order/entities/order-Items.entity";

@Entity(EntityName.ProductSize)
export class ProductSizeEntity extends BaseEntityCustom {
    @Column()
    productId: number
    @Column()
    size: string
    @Column()
    count: number
    @Column({ type: "decimal", })
    discount: number
    @Column({ type: "decimal", default: 0 })
    price: number
    @Column({ default: false })
    active_discount: boolean

    @ManyToOne(() => ProductEntity, product => product.sizes, { onDelete: "CASCADE" })
    product: ProductEntity
    @OneToMany(() => BasketEntity, basket => basket.size)
    baskets: BasketEntity[]
    @OneToMany(() => OrderItemEntity, orderItems => orderItems.size)
    orderItems: OrderItemEntity[]
}

