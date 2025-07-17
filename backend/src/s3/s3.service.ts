import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly logger = new Logger(S3Service.name);

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') ?? '',
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') ?? '',
      },
    });
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME') ?? '';
  }

  /**
   * Upload un fichier vers S3
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
    customFileName?: string
  ): Promise<{ url: string; key: string }> {
    try {
      const fileName = customFileName || `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const key = `${folder}/${fileName}`;

      const uploadParams = {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: ObjectCannedACL.public_read,
      };

      await this.s3Client.send(new PutObjectCommand(uploadParams));
      
      const url = `https://${this.bucketName}.s3.amazonaws.com/${key}`;
      
      this.logger.log(`File uploaded successfully: ${key}`);
      return { url, key };
    } catch (error) {
      this.logger.error(`Error uploading file to S3: ${error.message}`);
      throw error;
    }
  }

  /**
   * Supprimer un fichier de S3
   */
  async deleteFile(key: string): Promise<boolean> {
    try {
      const deleteParams = {
        Bucket: this.bucketName,
        Key: key,
      };

      await this.s3Client.send(new DeleteObjectCommand(deleteParams));
      this.logger.log(`File deleted successfully: ${key}`);
      return true;
    } catch (error) {
      this.logger.error(`Error deleting file from S3: ${error.message}`);
      throw error;
    }
  }

  /**
   * Vérifier si un fichier existe dans S3
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const headParams = {
        Bucket: this.bucketName,
        Key: key,
      };

      await this.s3Client.send(new HeadObjectCommand(headParams));
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Générer une URL signée pour télécharger un fichier privé
   */
  async getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
      return signedUrl;
    } catch (error) {
      this.logger.error(`Error generating signed URL: ${error.message}`);
      throw error;
    }
  }

  /**
   * Générer une URL signée pour uploader un fichier
   */
  async getSignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
      return signedUrl;
    } catch (error) {
      this.logger.error(`Error generating signed upload URL: ${error.message}`);
      throw error;
    }
  }

  /**
   * Extraire la clé S3 à partir d'une URL S3
   */
  extractKeyFromUrl(url: string): string {
    const bucketUrl = `https://${this.bucketName}.s3.amazonaws.com/`;
    return url.replace(bucketUrl, '');
  }
}
