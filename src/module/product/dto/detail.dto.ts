import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { ProductType } from "../enum/type.enum";

export class AddDetailDto {
    @ApiProperty()
    productId:number
    @ApiPropertyOptional()
    key:number
    @ApiPropertyOptional()
    value:number

}


export class UpdateAddDetailDto extends PartialType(AddDetailDto){}