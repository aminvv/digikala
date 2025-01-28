import { PartialType } from '@nestjs/swagger';
import { CreateBsaketDto } from './create-bsaket.dto';

export class UpdateBsaketDto extends PartialType(CreateBsaketDto) {}
