import { BaseEntityCustom } from "src/common/abstract/baseEntity.entity";
import { Column, CreateDateColumn, Entity, OneToMany } from "typeorm";
import { ProductDetailEntity } from "./product-detail.entity";
import { ProductColorEntity } from "./product-color.entity";
import { ProductSizeEntity } from "./product-size.entity";
import { ProductType } from "../enum/type.enum";

@Entity()
export class ProductEntity extends BaseEntityCustom {
    @Column()
    title: string
    @Column()
    content: string
    @Column()
    slug: string
    @Column()
    code: string
    @Column({type:"enum",enum:ProductType})
    type: string
    @Column({default:0})
    count: number
    @Column({type:"decimal" ,nullable:true})
    price: number
    @Column({type:"decimal" ,nullable:true,default:0})
    discount: number
    @Column({nullable:false})
    active_discount: boolean
    @CreateDateColumn()
    create_at:Date

    @OneToMany(()=>ProductDetailEntity,detail=>detail.product)
    details:ProductDetailEntity[]
    @OneToMany(()=>ProductSizeEntity,size=>size.product)
    sizes:ProductSizeEntity[]
    @OneToMany(()=>ProductColorEntity,color=>color.product)
    colors:ProductColorEntity[]
}

