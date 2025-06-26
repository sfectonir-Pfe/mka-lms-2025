import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotMessageDto } from './dto/chatbot-message.dto';
import { SqlQueryDto } from './dto/sql-query.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  async sendMessage(@Body() messageDto: ChatbotMessageDto) {
    return {
      response: await this.chatbotService.processMessage(messageDto.message)
    };
  }

  @Post('query')
  async executeQuery(@Body() queryDto: SqlQueryDto) {
    return await this.chatbotService.executeQuery(queryDto.query);
  }
}