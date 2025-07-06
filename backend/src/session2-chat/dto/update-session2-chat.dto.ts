import { PartialType } from '@nestjs/swagger';
import { CreateSession2ChatDto } from './create-session2-chat.dto';

export class UpdateSession2ChatDto extends PartialType(CreateSession2ChatDto) {}
