# Guide de Migration vers AWS S3

## Vue d'ensemble

Ce guide vous aide à migrer votre application de stockage local (Multer) vers AWS S3.

## Prérequis

1. **Compte AWS** avec accès S3
2. **Bucket S3** créé et configuré
3. **Clés d'accès AWS** (Access Key ID et Secret Access Key)
4. **Permissions IAM** appropriées

## Configuration

### 1. Variables d'environnement

Ajoutez ces variables à votre fichier `.env` :

```env
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name
```

### 2. Configuration du bucket S3

1. Créez un bucket S3 dans votre région AWS
2. Configurez les permissions CORS :

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

3. Configurez la politique de bucket pour l'accès public (si nécessaire) :

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

## Migration des contrôleurs existants

### Avant (avec Multer local)

```typescript
@Post('upload')
@UseInterceptors(FileInterceptor('file', {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
}))
async uploadFile(@UploadedFile() file: Express.Multer.File) {
  const fileUrl = `http://localhost:8000/uploads/${file.filename}`;
  return { fileUrl };
}
```

### Après (avec S3)

```typescript
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
async uploadFile(@UploadedFile() file: Express.Multer.File) {
  const result = await this.s3Service.uploadFile(file, 'uploads');
  return { fileUrl: result.url };
}
```

## Endpoints S3 disponibles

### Upload de fichiers

- `POST /s3/upload` - Upload général
- `POST /s3/upload/profile-pic` - Upload photo de profil
- `POST /s3/upload/content` - Upload contenu éducatif
- `POST /s3/upload/chat` - Upload fichier de chat

### Gestion des fichiers

- `DELETE /s3/delete/:key` - Supprimer par clé
- `DELETE /s3/delete-by-url` - Supprimer par URL
- `GET /s3/exists/:key` - Vérifier l'existence
- `POST /s3/signed-download-url` - URL de téléchargement signée
- `POST /s3/signed-upload-url` - URL d'upload signée

## Exemples d'utilisation

### 1. Upload simple

```typescript
// Dans votre contrôleur
@Post('upload-document')
@UseInterceptors(FileInterceptor('file'))
async uploadDocument(@UploadedFile() file: Express.Multer.File) {
  const result = await this.s3Service.uploadFile(file, 'documents');
  return {
    success: true,
    url: result.url,
    key: result.key
  };
}
```

### 2. Upload avec validation

```typescript
@Post('upload-image')
@UseInterceptors(FileInterceptor('file'))
async uploadImage(@UploadedFile() file: Express.Multer.File) {
  // Validation
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new BadRequestException('Type de fichier non autorisé');
  }

  const result = await this.s3Service.uploadFile(file, 'images');
  return { url: result.url };
}
```

### 3. Suppression de fichier

```typescript
@Delete('delete-file')
async deleteFile(@Body('url') url: string) {
  const key = this.s3Service.extractKeyFromUrl(url);
  await this.s3Service.deleteFile(key);
  return { success: true };
}
```

## Migration progressive

### Étape 1: Configuration
1. Configurez les variables d'environnement
2. Testez la connexion S3

### Étape 2: Migration par module
1. Commencez par un module simple (ex: users)
2. Testez les uploads S3
3. Migrez les autres modules un par un

### Étape 3: Nettoyage
1. Supprimez les anciens fichiers locaux
2. Mettez à jour les URLs dans la base de données
3. Supprimez les configurations Multer obsolètes

## Gestion des erreurs

```typescript
try {
  const result = await this.s3Service.uploadFile(file, 'uploads');
  return { success: true, url: result.url };
} catch (error) {
  this.logger.error(`S3 upload failed: ${error.message}`);
  throw new BadRequestException('Erreur lors de l\'upload');
}
```

## Bonnes pratiques

1. **Validation des fichiers** : Vérifiez toujours le type MIME et la taille
2. **Gestion des erreurs** : Implémentez une gestion d'erreur robuste
3. **Logging** : Loggez les opérations importantes
4. **Sécurité** : Utilisez des URLs signées pour les fichiers privés
5. **Performance** : Optimisez la taille des fichiers avant upload

## Dépannage

### Erreurs courantes

1. **Access Denied** : Vérifiez les permissions IAM
2. **Bucket not found** : Vérifiez le nom du bucket
3. **Invalid credentials** : Vérifiez les clés AWS
4. **CORS errors** : Configurez CORS sur le bucket

### Debug

```typescript
// Activer le debug AWS
process.env.AWS_SDK_JS_DEBUG = 'true';
```

## Support

Pour toute question ou problème, consultez :
- [Documentation AWS S3](https://docs.aws.amazon.com/s3/)
- [AWS SDK v3 pour JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)
- [NestJS Documentation](https://docs.nestjs.com/) 