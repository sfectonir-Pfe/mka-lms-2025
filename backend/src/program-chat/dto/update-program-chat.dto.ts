import { PartialType } from '@nestjs/swagger';
import { CreateProgramChatDto } from './create-program-chat.dto';

export class UpdateProgramChatDto extends PartialType(CreateProgramChatDto) {}
