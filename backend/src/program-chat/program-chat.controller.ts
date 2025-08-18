import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Delete,
  Body,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProgramChatService } from './program-chat.service';
import { ProgramChatGateway } from './program-chat.gateway';

const getFileType = (mimetype: string): 'text' | 'image' | 'video' | 'audio' | 'file' => {
  if (mimetype?.startsWith('image/')) return 'image';
  if (mimetype?.startsWith('video/')) return 'video';
  if (mimetype?.startsWith('audio/')) return 'audio';
  return 'file';
};

@Controller('program-chat')
export class ProgramChatController {
  constructor(
    private readonly programChatService: ProgramChatService,
    private readonly programChatGateway: ProgramChatGateway,
  ) {}

  // GET /program-chat/:programId?limit=50
  @Get(':programId')
  getMessages(
    @Param('programId') programId: string,
    @Query('limit') limit = '50',
  ) {
    return this.programChatService.findByProgram(Number(programId), Math.min(+limit || 50, 200));
  }

  // POST /program-chat/upload  -> returns { fileUrl, fileType }
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/chat',
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, unique);
        },
      }),
      limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB (keep/change as you like)
    }),
  )
  uploadChatFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    const fileType = getFileType(file.mimetype);
    const base = process.env.FILE_BASE_URL ?? 'http://localhost:8000';
    const fileUrl = `${base}/uploads/chat/${file.filename}`;
    return { fileUrl, fileType };
  }

  // DELETE /program-chat/:id  body: { userId }
  @Delete(':id')
  async deleteOne(@Param('id') id: string, @Body() body: { userId: number }) {
    const deleted = await this.programChatService.deleteMessage(Number(id), body?.userId);
    if (!deleted) throw new NotFoundException('Message not found');
    if (deleted.programId) {
      this.programChatGateway.server
        .to(`program-${deleted.programId}`)
        .emit('deleteProgramMessage', { id: Number(id) });
    }
    return deleted;
  }

  // DELETE /program-chat/clear/:programId
  @Delete('clear/:programId')
  async clearAll(@Param('programId') programId: string) {
    return this.programChatService.deleteAllByProgram(Number(programId));
  }
}
