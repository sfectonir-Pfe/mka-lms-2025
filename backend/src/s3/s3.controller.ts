import { 
  Controller, 
  Post, 
  Delete, 
  Param, 
  Body, 
  UseInterceptors, 
  UploadedFile,
  Get,
  BadRequestException,
  Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  private readonly logger = new Logger(S3Controller.name);

  constructor(private readonly s3Service: S3Service) {}

  /**
   * Upload un fichier vers S3
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string = 'uploads',
    @Body('customFileName') customFileName?: string
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    try {
      const result = await this.s3Service.uploadFile(file, folder, customFileName);
      this.logger.log(`File uploaded: ${result.key}`);
      return {
        success: true,
        url: result.url,
        key: result.key,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      };
    } catch (error) {
      this.logger.error(`Upload failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Upload un fichier de profil utilisateur
   */
  @Post('upload/profile-pic')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePic(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Seules les images sont autorisées');
    }

    try {
      const result = await this.s3Service.uploadFile(file, 'profile-pics');
      return {
        success: true,
        url: result.url,
        key: result.key
      };
    } catch (error) {
      this.logger.error(`Profile pic upload failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Upload un fichier de contenu éducatif
   */
  @Post('upload/content')
  @UseInterceptors(FileInterceptor('file'))
  async uploadContent(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    try {
      const result = await this.s3Service.uploadFile(file, 'content');
      return {
        success: true,
        url: result.url,
        key: result.key
      };
    } catch (error) {
      this.logger.error(`Content upload failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Upload un fichier de chat
   */
  @Post('upload/chat')
  @UseInterceptors(FileInterceptor('file'))
  async uploadChatFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    try {
      const result = await this.s3Service.uploadFile(file, 'chat');
      return {
        success: true,
        url: result.url,
        key: result.key,
        fileType: this.getFileType(file.mimetype)
      };
    } catch (error) {
      this.logger.error(`Chat file upload failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Supprimer un fichier de S3
   */
  @Delete('delete/*key')
  async deleteFile(@Param('key') key: string) {
    try {
      const success = await this.s3Service.deleteFile(key);
      return {
        success,
        message: 'Fichier supprimé avec succès'
      };
    } catch (error) {
      this.logger.error(`Delete failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Supprimer un fichier par URL
   */
  @Delete('delete-by-url')
  async deleteFileByUrl(@Body('url') url: string) {
    if (!url) {
      throw new BadRequestException('URL requise');
    }

    try {
      const key = this.s3Service.extractKeyFromUrl(url);
      const success = await this.s3Service.deleteFile(key);
      return {
        success,
        message: 'Fichier supprimé avec succès'
      };
    } catch (error) {
      this.logger.error(`Delete by URL failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Vérifier si un fichier existe
   */
  @Get('exists/*key')
  async fileExists(@Param('key') key: string) {
    try {
      const exists = await this.s3Service.fileExists(key);
      return { exists };
    } catch (error) {
      this.logger.error(`File exists check failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Générer une URL signée pour téléchargement
   */
  @Post('signed-download-url')
  async getSignedDownloadUrl(
    @Body('key') key: string,
    @Body('expiresIn') expiresIn: number = 3600
  ) {
    if (!key) {
      throw new BadRequestException('Clé requise');
    }

    try {
      const signedUrl = await this.s3Service.getSignedDownloadUrl(key, expiresIn);
      return { signedUrl };
    } catch (error) {
      this.logger.error(`Signed URL generation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Générer une URL signée pour upload
   */
  @Post('signed-upload-url')
  async getSignedUploadUrl(
    @Body('key') key: string,
    @Body('contentType') contentType: string,
    @Body('expiresIn') expiresIn: number = 3600
  ) {
    if (!key || !contentType) {
      throw new BadRequestException('Clé et type de contenu requis');
    }

    try {
      const signedUrl = await this.s3Service.getSignedUploadUrl(key, contentType, expiresIn);
      return { signedUrl };
    } catch (error) {
      this.logger.error(`Signed upload URL generation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Déterminer le type de fichier basé sur le MIME type
   */
  private getFileType(mimetype: string): string {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.startsWith('audio/')) return 'audio';
    if (mimetype.includes('pdf')) return 'document';
    if (mimetype.includes('word') || mimetype.includes('document')) return 'document';
    if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return 'spreadsheet';
    if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return 'presentation';
    return 'file';
  }
}
