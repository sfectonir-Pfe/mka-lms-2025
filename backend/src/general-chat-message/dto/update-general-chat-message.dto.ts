import { PartialType } from '@nestjs/swagger';
import { CreateGeneralChatMessageDto } from './create-general-chat-message.dto';

export class UpdateGeneralChatMessageDto extends PartialType(CreateGeneralChatMessageDto) {}
