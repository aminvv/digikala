import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { DiscountType } from "../enum/type.enum"

export class CreateDiscountDto {
    @ApiProperty()
    code: string
    @ApiPropertyOptional()
    percent: number
    @ApiPropertyOptional()
    amount: string
    @ApiPropertyOptional()
    limit: number
    @ApiPropertyOptional()
    expires_in: Date
    @ApiPropertyOptional()
    productId: number
    @ApiProperty({ enum: DiscountType })
    type: string
}
