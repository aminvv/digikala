import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { ProductType } from "../enum/type.enum";

export class AddSizeDto {
    @ApiProperty()
    size:string
    @ApiProperty()
    productId:number
    @ApiPropertyOptional()
    price:number
    @ApiPropertyOptional()
    count:number
    @ApiPropertyOptional()
    discount:number
    @ApiPropertyOptional()
    active_discount:boolean
}


export class UpdateAddSizeDtoDto extends PartialType(AddSizeDto){}