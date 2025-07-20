import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GeneralChatMessagesService } from './general-chat-message.service';
import { GeneralChatMessageGateway } from './generalchatmessagegateway';

const getFileType = (mimetype: string): string => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'audio';
  return 'file';
};

@Controller('general-chat-messages')
export class GeneralChatMessagesController {
  constructor(
    private readonly generalChatMessagesService: GeneralChatMessagesService,
    private readonly generalChatMessageGateway: GeneralChatMessageGateway
  ) {}

  // GET /general-chat-messages → get all general messages
  @Get()
  getMessages() {
    return this.generalChatMessagesService.findAll();
  }

  // POST /general-chat-messages/upload-chat → upload file for general chat
  @Post('upload-chat')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/chat', // reuse the same folder
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

  // DELETE /general-chat-messages/:id (with {userId} in body)
  @Delete(':id')
  async deleteOne(@Param('id') id: string, @Body() body: { userId: number }) {
    const deleted = await this.generalChatMessagesService.deleteMessage(Number(id), body.userId);

    // Emit delete to everyone
    this.generalChatMessageGateway.server.emit('deleteGeneralMessage', { id: Number(id) });

    return deleted;
  }

  // DELETE /general-chat-messages/clear
  @Delete('clear')
  async clearAll() {
    return this.generalChatMessagesService.deleteAll();
  }
}
