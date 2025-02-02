import { BaseEntityCustom } from "src/common/abstract/baseEntity.entity";
import { EntityName } from "src/common/enum/entityName.enum";
import { DiscountEntity } from "src/module/discount/entities/discount.entity";
import { ProductColorEntity } from "src/module/product/entities/product-color.entity";
import { ProductSizeEntity } from "src/module/product/entities/product-size.entity";
import { ProductEntity } from "src/module/product/entities/product.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity(EntityName.Basket)
export class BasketEntity extends BaseEntityCustom {

    @Column({ nullable: true })
    productId: number;
    @Column({ nullable: true })
    sizeId: number;
    @Column({ nullable: true })
    colorId: number;
    @Column({ nullable: true })
    discountId: number;
    @Column()
    count: number;

    @ManyToOne(() => ProductEntity, (product) => product.baskets, { onDelete: "CASCADE" })
    product: ProductEntity;
    @ManyToOne(() => ProductColorEntity, (color) => color.baskets, { onDelete: "CASCADE" })
    color: ProductColorEntity;
    @ManyToOne(() => ProductSizeEntity, (size) => size.baskets, { onDelete: "CASCADE" })
    size: ProductSizeEntity;
    @ManyToOne(() => DiscountEntity, (discount) => discount.baskets, { onDelete: "CASCADE", })
    discount: DiscountEntity;
}


