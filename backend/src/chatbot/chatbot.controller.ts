import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotMessageDto } from './dto/chatbot-message.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  async sendMessage(@Body() dto: ChatbotMessageDto) {
    try {
      // Convertir userId en nombre si c'est une chaîne
      let userId: number | undefined = undefined;
      if (dto.userId !== undefined) {
        if (typeof dto.userId === 'string') {
          const parsed = parseInt(dto.userId, 10);
          userId = isNaN(parsed) ? undefined : parsed;
        } else if (typeof dto.userId === 'number') {
          userId = dto.userId;
        }
      }

      const result = await this.chatbotService.processMessage(
        dto.message,
        dto.sessionId,
        userId,
        dto.userLanguage
      );
      return {
        response: result.response,
        detectedLanguage: result.detectedLanguage,
        sessionId: dto.sessionId
      };
    } catch (error) {
      throw new HttpException(
        `Erreur lors du traitement du message: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('memory/history')
  async getMemoryHistory(@Body() dto: { sessionId: string, userId?: number, limit?: number }) {
    try {
      if (dto.userId === undefined) {
        throw new HttpException('userId is required', HttpStatus.BAD_REQUEST);
      }
      const history = await this.chatbotService.getMemoryHistory(dto.userId, dto.limit || 10);
      return { history, count: history.length };
    } catch (error) {
      throw new HttpException(
        `Erreur lors de la récupération de l'historique: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('memory/clear')
  async clearMemory(@Body() dto: { sessionId: string, userId?: number }) {
    try {
      if (dto.userId === undefined) {
        throw new HttpException('userId is required', HttpStatus.BAD_REQUEST);
      }
      const success = await this.chatbotService.clearMemory(dto.userId);
      return { success };
    } catch (error) {
      throw new HttpException(
        `Erreur lors de l'effacement de la mémoire: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
