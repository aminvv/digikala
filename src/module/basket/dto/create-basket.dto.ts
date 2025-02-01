import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class AddToBasketDto {
        @ApiProperty()
        productId:number
        @ApiPropertyOptional()
        sizeId:number
        @ApiPropertyOptional()
        colorId:number
}


