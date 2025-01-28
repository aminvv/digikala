
import { BaseEntityCustom } from "src/common/abstract/baseEntity.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { ProductEntity } from "./product.entity";

@Entity()
export class ProductDetailEntity extends BaseEntityCustom {
    @Column()
    productId: number
    @Column()
    key: string
    @Column()
    value: string

    @ManyToOne(()=>ProductEntity,product=>product.details,{onDelete:"CASCADE"})
    product:ProductEntity
}
