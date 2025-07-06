import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Delete,
  Body
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ChatMessagesService } from './chat-messages.service';
import { ChatGateway } from './ChatGateway';

const getFileType = (mimetype: string): string => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'audio';
  return 'file';
};

@Controller('chat-messages')
export class ChatMessagesController {
  constructor(
    private readonly chatMessagesService: ChatMessagesService,
    private readonly chatGateway: ChatGateway
  ) {}

  // GET /chat-messages/:seanceId → get all messages for a seance
  @Get(':seanceId')
  getMessages(@Param('seanceId') seanceId: string) {
    return this.chatMessagesService.findBySeance(Number(seanceId));
  }

  // POST /chat-messages/upload-chat → upload file for chat
  @Post('upload-chat')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/chat',
        filename: (req, file, cb) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9) + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
    }),
  )
  uploadChatFile(@UploadedFile() file: Express.Multer.File) {
    const fileType = getFileType(file.mimetype);
    const fileUrl = `http://localhost:8000/uploads/chat/${file.filename}`;
    return { fileUrl, fileType };
  }

  // DELETE /chat-messages/:id (with {userId} in body)
  @Delete(':id')
  async deleteOne(@Param('id') id: string, @Body() body: { userId: number }) {
    const deleted = await this.chatMessagesService.deleteMessage(Number(id), body.userId);

    // Emit delete to everyone in the seance room
    if (deleted?.seanceId) {
      this.chatGateway.server
        .to(`seance-${deleted.seanceId}`)
        .emit('deleteSeanceMessage', { id: Number(id) });
    }

    return deleted;
  }

  // DELETE /chat-messages/clear/:seanceId
  @Delete('clear/:seanceId')
  async clearAll(@Param('seanceId') seanceId: string) {
    return this.chatMessagesService.deleteAllBySeance(Number(seanceId));
  }
}
