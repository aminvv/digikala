import { BaseEntityCustom } from "src/common/abstract/baseEntity.entity";
import { EntityName } from "src/common/enum/entityName.enum";
import { Column, Entity, OneToMany } from "typeorm";
import { DiscountType } from "../enum/type.enum";
import { BasketEntity } from "src/module/basket/entities/basket.entity";

@Entity(EntityName.Discount)
export class DiscountEntity extends BaseEntityCustom {
    @Column({ unique: true })
    code: string
    @Column({ nullable: true, type: "decimal" })
    percent: number
    @Column({ nullable: true, type: "decimal" })
    amount: number
    @Column({ nullable: true })
    limit: number
    @Column({ nullable: true, default: 0 })
    usage: number
    @Column({ type: "timestamp", nullable: true })
    expires_in: Date
    @Column({ nullable: true })
    productId: number
    @Column({ type: "enum", enum: DiscountType })
    type: string

   @OneToMany(() => BasketEntity, (basket) => basket.discount)
  baskets: BasketEntity[];
}





