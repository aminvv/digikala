
import { BaseEntityCustom } from "src/common/abstract/baseEntity.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { ProductEntity } from "./product.entity";

@Entity()
export class ProductSizeEntity extends BaseEntityCustom {
    @Column()
    productId: number
    @Column()
    size: string
    @Column()
    count: number
    @Column({type:"decimal",})
    discount: number
    @Column({type:"decimal",default:0})
    price: number
    @Column({default:false})
    active_discount: boolean

        @ManyToOne(()=>ProductEntity,product=>product.sizes,{onDelete:"CASCADE"})
        product:ProductEntity
}

