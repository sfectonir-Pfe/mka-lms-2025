import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Delete,
  Body,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Session2ChatService } from './session2-chat.service';
import { Session2ChatGateway } from './Session2ChatGateway';

const getFileType = (mimetype: string): string => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'audio';
  return 'file';
};

@Controller('session2-chat-messages')
export class Session2ChatController {
  private readonly logger = new Logger(Session2ChatController.name);

  constructor(
    private readonly session2ChatService: Session2ChatService,
    private readonly chatGateway: Session2ChatGateway,
  ) {}

  /**
   * Get all messages for a session2
   */
  @Get(':session2Id')
  async getMessages(@Param('session2Id') session2Id: string) {
    this.logger.log(`GET messages for session2: ${session2Id}`);
    const id = Number(session2Id);
    if (isNaN(id)) throw new BadRequestException('Invalid session2Id');
    return this.session2ChatService.findBySession2(id);
  }

  /**
   * Upload a file to the chat (returns fileUrl and fileType)
   */
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
    if (!file) throw new BadRequestException('No file uploaded');
    const fileType = getFileType(file.mimetype);
    const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:8000'}/uploads/chat/${file.filename}`;
    this.logger.log(`Uploaded chat file: ${file.filename} (${fileType})`);
    return { fileUrl, fileType };
  }

  /**
   * Delete a single message if owner
   */
  @Delete(':id')
  async deleteOne(@Param('id') id: string, @Body() body: { userId: number }) {
    this.logger.log(`DELETE message ${id} by user ${body.userId}`);
    try {
      const deleted = await this.session2ChatService.deleteIfOwner(Number(id), body.userId);

      // 👇 EMIT using unified event name!
      // If service returns session2Id, emit to the room. 
      // If not, just emit with id (safe fallback)
      if ((deleted as any)?.session2Id) {
        this.chatGateway.server
          .to(`session2-${(deleted as any).session2Id}`)
          .emit('deleteSession2Message', { id: Number(id) });
      } else {
        // fallback, emit to all
        this.chatGateway.server.emit('deleteSession2Message', { id: Number(id) });
      }
      return deleted;
    } catch (err) {
      this.logger.error(`Error deleting message: ${err.message}`);
      throw err;
    }
  }

  /**
   * Delete ALL messages in a session2 (admin/formateur only)
   */
  @Delete('clear/:session2Id')
  async clearAll(@Param('session2Id') session2Id: string) {
    this.logger.warn(`DELETE ALL messages in session2 ${session2Id}`);
    const id = Number(session2Id);
    if (isNaN(id)) throw new BadRequestException('Invalid session2Id');
    await this.session2ChatService.deleteAllBySession2(id);
    this.chatGateway.server.to(`session2-${id}`).emit('clearSession2Messages');
    return { success: true };
  }
}
