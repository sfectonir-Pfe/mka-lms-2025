import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { S3Service } from '../s3/s3.service';

export interface S3UploadOptions {
  folder?: string;
  customFileName?: string;
  allowedMimeTypes?: string[];
  maxFileSize?: number;
}

export function S3UploadInterceptor(options: S3UploadOptions = {}): Type<NestInterceptor> {
  @Injectable()
  class MixinInterceptor implements NestInterceptor {
    constructor(private readonly s3Service: S3Service) {}

    async intercept(context: any, next: any): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const file = request.file;

      if (!file) {
        return next.handle();
      }

      // Validation du type MIME
      if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(file.mimetype)) {
        throw new Error(`Type de fichier non autorisé. Types autorisés: ${options.allowedMimeTypes.join(', ')}`);
      }

      // Validation de la taille
      if (options.maxFileSize && file.size > options.maxFileSize) {
        throw new Error(`Fichier trop volumineux. Taille maximale: ${options.maxFileSize / (1024 * 1024)}MB`);
      }

      try {
        // Upload vers S3
        const result = await this.s3Service.uploadFile(
          file,
          options.folder || 'uploads',
          options.customFileName
        );

        // Remplacer les informations du fichier local par celles de S3
        request.file = {
          ...file,
          filename: result.key,
          path: result.url,
          destination: 's3',
          s3Url: result.url,
          s3Key: result.key
        };

        return next.handle().pipe(
          map(data => {
            // Si la réponse contient des informations de fichier, les mettre à jour
            if (data && typeof data === 'object') {
              const d = data as any;
              if (d.fileUrl) {
                d.fileUrl = result.url;
              }
              if (d.url) {
                d.url = result.url;
              }
              if (d.s3Url) {
                d.s3Url = result.url;
              }
              if (d.s3Key) {
                d.s3Key = result.key;
              }
            }
            return data;
          })
        );
      } catch (error) {
        throw new Error(`Erreur lors de l'upload vers S3: ${error.message}`);
      }
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor;
} 