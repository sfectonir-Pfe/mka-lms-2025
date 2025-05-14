import {
  Controller,
  Patch,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';
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

  // ✅ GET /users/me/:email
  @Get('me/:email')
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.usersService.getByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // ✅ PATCH /users/me/:email
  @Patch('me/:email')
  @UseInterceptors(FileInterceptor('profileFile', multerOptions))
  async updateUserProfile(
    @Param('email') email: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateUserDto | any,
  ) {
    return this.usersService.updateByEmail(email, body, file);
  }
}
