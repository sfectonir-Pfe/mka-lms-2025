import { PartialType } from '@nestjs/swagger';
import { CreateSession2Dto } from './create-session2.dto';

export class UpdateSession2Dto extends PartialType(CreateSession2Dto) {}
