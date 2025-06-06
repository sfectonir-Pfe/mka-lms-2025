import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// 🔧 Inline Multer config (no external file)
const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname).toLowerCase();
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Seules les images .jpg, .jpeg, .png, et .webp sont autorisées'), false);
    }
    cb(null, true);
  },
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    try {
      console.log('UsersController: Fetching all users...');
      const users = await this.usersService.findAll();
      console.log('UsersController: Successfully fetched users:', users.length);
      return users;
    } catch (error) {
      console.error('UsersController: Error fetching users:', error);
      throw new NotFoundException('Failed to fetch users');
    }
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

  // Alias for getUserByEmail for compatibility
  @Get('me/:email')
  async getUserByEmailAlias(@Param('email') email: string) {
    return this.getUserByEmail(email);
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }

  // Alias for updateByEmail for compatibility
  @Patch('me/:email')
  @UseInterceptors(FileInterceptor('profileFile', multerOptions))
  async updateUserProfile(
    @Param('email') email: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateUserDto,
  ) {
    // If file is provided, update the profile picture
    if (file) {
      const profilePic = `/${file.filename}`;
      body.profilePic = profilePic;
    }

    return this.usersService.updateByEmail(email, body);
  }

  @Patch('email/:email')
  async updateByEmail(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      console.log("Contrôleur: Mise à jour de l'utilisateur avec email:", email);
      console.log("Contrôleur: Données reçues:", updateUserDto);
      console.log("Contrôleur: Type de skills:", typeof updateUserDto.skills);

      const result = await this.usersService.updateByEmail(email, updateUserDto);
      console.log("Contrôleur: Résultat de la mise à jour:", result);
      return result;
    } catch (error) {
      console.error("Contrôleur: Erreur lors de la mise à jour de l'utilisateur:", error);
      throw error;
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      console.log('UsersController: Deleting user with ID:', id);
      const result = await this.usersService.remove(+id);
      console.log('UsersController: User deleted successfully:', result);
      return result;
    } catch (error) {
      console.error('UsersController: Error deleting user:', error);
      throw new NotFoundException(`Failed to delete user with ID ${id}: ${error.message}`);
    }
  }

  @Patch('id/:id/photo')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/profile-pics',
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