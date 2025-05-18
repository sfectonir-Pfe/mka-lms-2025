import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('id/:id')
  async getUserById(@Param('id') id: string) {
    try {
      const numericId = parseInt(id, 10);

      if (isNaN(numericId)) {
        throw new NotFoundException('ID utilisateur invalide');
      }

      const user = await this.usersService.findById(numericId);

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      return user;
    } catch (error) {
      console.error('Erreur dans getUserById:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Erreur lors de la récupération de l\'utilisateur');
    }
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }

  @Patch('email/:email')
  async updateByEmail(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateByEmail(email, updateUserDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Patch('id/:id/photo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './backend/uploads/profile-pics',
        filename: (req, file, cb) => {
          // Générer un nom de fichier unique
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          // Ajouter l'extension du fichier original
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Vérifier si le fichier est une image
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Seuls les fichiers image sont autorisés!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
    }),
  )
  async uploadProfilePic(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    try {
      const numericId = parseInt(id, 10);

      if (isNaN(numericId)) {
        throw new NotFoundException('ID utilisateur invalide');
      }

      if (!file) {
        throw new Error('Aucun fichier téléchargé');
      }

      // Mettre à jour le champ profilePic de l'utilisateur avec le chemin du fichier
      console.log("Fichier téléchargé:", file);

      // Construire le chemin relatif pour le stockage dans la base de données
      // Le chemin doit être relatif à la racine du serveur statique
      const filePath = `/profile-pics/${file.filename}`;
      console.log("Chemin de fichier à stocker:", filePath);

      return this.usersService.updateProfilePic(numericId, filePath);
    } catch (error) {
      console.error('Erreur lors du téléchargement de la photo de profil:', error);
      throw error;
    }
  }
}