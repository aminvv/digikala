import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class BasketDto {
        @ApiProperty()
        productId:number
        @ApiPropertyOptional()
        sizeId:number
        @ApiPropertyOptional()
        colorId:number
}


