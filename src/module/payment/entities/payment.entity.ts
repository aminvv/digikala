import { BaseEntityCustom } from "src/common/abstract/baseEntity.entity"
import { EntityName } from "src/common/enum/entityName.enum"
import { OrderEntity } from "src/module/order/entities/order.entity"
import { Column, CreateDateColumn, Entity, OneToOne } from "typeorm"

@Entity(EntityName.Payment)
export class PaymentEntity extends BaseEntityCustom {
    @Column()
    amount:number
    @Column({default:false})
    status:boolean
    @Column()
    invoice_number:string
    @Column({nullable:true})
    refId:string
    @Column({nullable:true})
    authority:string
    @Column()
    orderId:string
    @CreateDateColumn()
    create_at:Date

    @OneToOne(() => OrderEntity, (order) => order.payment,{onDelete:"CASCADE"})
    order: OrderEntity
}
