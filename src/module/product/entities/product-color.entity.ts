
import { BaseEntityCustom } from "src/common/abstract/baseEntity.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { ProductEntity } from "./product.entity";
import { EntityName } from "src/common/enum/entityName.enum";

@Entity(EntityName.ProductColor)
export class ProductColorEntity extends BaseEntityCustom {
    @Column()
    productId: number
    @Column()
    color_name: string
    @Column()
    color_code: string
    @Column()
    count: number
    @Column({ type: "decimal", })
    discount: number
    @Column({ type: "decimal", default: 0 })
    price: number
    @Column({ default: false })
    active_discount: boolean

        @ManyToOne(()=>ProductEntity,product=>product.colors,{onDelete:"CASCADE"})
        product:ProductEntity
}
