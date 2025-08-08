import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { diskStorage } from "multer"
import { extname } from "path"
import { UsersService } from "./users.service"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"
import type { Express } from "express"
import { S3Service } from "../s3/s3.service"
import { Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

// 🔧 Inline Multer config (no external file)
const multerOptions = {
  storage: diskStorage({
    destination: "./uploads",
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
      const ext = extname(file.originalname).toLowerCase()
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`
      callback(null, filename)
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Seules les images .jpg, .jpeg, .png, et .webp sont autorisées"), false)
    }
    cb(null, true)
  },
}

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly s3Service: S3Service,
    private readonly prisma: PrismaService
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    try {
      const users = await this.usersService.findAll()
      return users
    } catch (error) {
      console.error("UsersController: Error fetching users:", error)
      throw new NotFoundException("Failed to fetch users")
    }
  }

  @Get('id/:id')
  async getUserById(@Param('id') id: string) {
    try {
      const numericId = Number.parseInt(id, 10);

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
  @Patch("me/:email")
  @UseInterceptors(FileInterceptor("profileFile", multerOptions))
  async updateUserProfile(
    @Param('email') email: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateUserDto,
  ) {
    // If file is provided, update the profile picture
    if (file) {
      const profilePic = `/${file.filename}`
      body.profilePic = profilePic
    }

    return this.usersService.updateByEmail(email, body)
  }

  @Patch("email/:email")
  async updateByEmail(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      console.log("Contrôleur: Mise à jour de l'utilisateur avec email:", email)
      console.log("Contrôleur: Données reçues:", updateUserDto)
      console.log("Contrôleur: Type de skills:", typeof updateUserDto.skills)

      const result = await this.usersService.updateByEmail(email, updateUserDto)
      console.log("Contrôleur: Résultat de la mise à jour:", result)
      return result
    } catch (error) {
      console.error("Contrôleur: Erreur lors de la mise à jour de l'utilisateur:", error)
      throw error
    }
  }

  @Patch(":id")
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  // 🆕 Nouveau endpoint pour activer/désactiver un utilisateur par ID
  @Patch(":id/toggle-status")
  async toggleUserStatus(@Param('id') id: string, @Body() body: { isActive?: boolean }) {
    try {
      const numericId = Number.parseInt(id, 10)

      if (isNaN(numericId)) {
        throw new BadRequestException("ID utilisateur invalide")
      }

      console.log("UsersController: Toggling user status for ID:", numericId)
      console.log("UsersController: New status:", body.isActive)

      const result = await this.usersService.toggleUserStatus(numericId, body.isActive)
      console.log("UsersController: User status updated successfully:", result)

      return {
        message: `Utilisateur ${result.isActive ? "activé" : "désactivé"} avec succès`,
        user: result,
      }
    } catch (error) {
      console.error("UsersController: Error toggling user status:", error)
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error
      }
      throw new BadRequestException(`Erreur lors de la modification du statut: ${error.message}`)
    }
  }

  // 🆕 Endpoint pour activer/désactiver un utilisateur par email (pour compatibilité)
  @Patch("email/:email/toggle-status")
  async toggleUserStatusByEmail(@Param('email') email: string, @Body() body: { isActive?: boolean }) {
    try {
      console.log("UsersController: Toggling user status for email:", email)
      console.log("UsersController: New status:", body.isActive)

      const result = await this.usersService.toggleUserStatusByEmail(email, body.isActive)
      console.log("UsersController: User status updated successfully:", result)

      return {
        message: `Utilisateur ${result.isActive ? "activé" : "désactivé"} avec succès`,
        user: result,
      }
    } catch (error) {
      console.error("UsersController: Error toggling user status by email:", error)
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error
      }
      throw new BadRequestException(`Erreur lors de la modification du statut: ${error.message}`)
    }
  }

  // 🆕 Endpoints spécifiques pour activer/désactiver (pour compatibilité avec le frontend existant)
  @Patch('email/:email/activate')
  async activateUserByEmail(@Param('email') email: string) {
    return this.toggleUserStatusByEmail(email, { isActive: true });
  }

  @Patch('email/:email/deactivate')
  async deactivateUserByEmail(@Param('email') email: string) {
    return this.toggleUserStatusByEmail(email, { isActive: false });
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

  @Patch("id/:id/photo")
  @UseInterceptors(FileInterceptor("photo"))
  async uploadProfilePic(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    try {
      const numericId = Number.parseInt(id, 10)

      if (isNaN(numericId)) {
        throw new NotFoundException("ID utilisateur invalide")
      }

      if (!file) {
        throw new Error("Aucun fichier téléchargé")
      }

      // Vérifier le type de fichier
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException("Seules les images sont autorisées");
      }

      // Upload vers S3
      const result = await this.s3Service.uploadFile(file, 'profile-pics');
      
      console.log("Fichier uploadé vers S3:", result);

      // Mettre à jour le profil utilisateur avec l'URL S3
      return this.usersService.updateProfilePic(numericId, result.url)
    } catch (error) {
      console.error("Erreur lors du téléchargement de la photo de profil:", error)
      throw error
    }
  }
  @Post(':id/join-session2/:session2Id')
async joinSession2(@Param('id') userId: string, @Param('session2Id') session2Id: string) {
  return this.usersService.addUserToSession2(Number(userId), Number(session2Id));
}

// @Get(':id/sessions2')
// async getUserSessions2(@Param('id') userId: string) {
//   return this.usersService.getSessionsForUser(Number(userId));
// }
@Get(':id/sessions2')
async getUserSessions2(@Param('id') userId: string) {
  return this.usersService.getUserSessions(Number(userId));
}

@Get('students')
async getStudents() {
  return this.usersService.getStudents();
}

@Get('students/without-feedback')
async getStudentsWithoutFeedback(
  @Query('formateurId') formateurId: string,
  @Query('seanceId') seanceId: string,
) {
  if (!formateurId || !seanceId) return [];

  // 1. Trouver la séance pour obtenir session2Id
  const seance = await this.prisma.seanceFormateur.findUnique({
    where: { id: Number(seanceId) },
    select: { session2Id: true }
  });
  if (!seance) return [];

  // 2. Trouver tous les étudiants de cette session
  const userSessions = await this.prisma.userSession2.findMany({
    where: { session2Id: seance.session2Id },
    select: { userId: true }
  });
  const studentIds = userSessions.map(us => us.userId);
  const students = await this.prisma.user.findMany({
    where: {
      id: { in: studentIds },
      role: 'Etudiant'
    },
    select: { id: true, name: true, email: true, role: true }
  });

  // 3. Exclure ceux qui ont déjà reçu un feedback de ce formateur pour cette séance
  const feedbacks = await this.prisma.feedbackFormateur.findMany({
    where: { formateurId: Number(formateurId), seanceId: Number(seanceId) },
    select: { studentId: true }
  });
  const alreadyFeedbackStudentIds = feedbacks.map(f => f.studentId);
  return students.filter(s => !alreadyFeedbackStudentIds.includes(s.id));
}

}
