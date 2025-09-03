import {
  Controller, Get, Post, Body, Param, Delete, UploadedFile,
  UseInterceptors, Patch
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Session2Service } from './session2.service';
import { PrismaService } from 'nestjs-prisma';
import { Roles } from '../auth/roles.decorator';

const storage = diskStorage({
  destination: './uploads/sessions',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

@Controller('session2')
export class Session2Controller {
  constructor(
    private readonly service: Session2Service,
    private readonly prisma: PrismaService
  ) {}

  @Roles('formateur','admin')
  @Post()
  @UseInterceptors(FileInterceptor('image', { storage }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    try {
      console.log('🔍 Session2 controller - Received request body:', body);
      const result = await this.service.create(body, file);
      console.log('✅ Session2 controller - Success:', result);
      return result;
    } catch (error) {
      console.error('❌ Session2 controller - Error:', error.message);
      console.error('❌ Session2 controller - Stack:', error.stack);
      throw error;
    }
  }

  @Roles('createurdeformation', 'admin', 'etudiant','formateur','etablissement')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Roles('createurdeformation', 'admin', 'etudiant','formateur','etablissement')
  @Get('simple')
  findAllSimple() {
    return this.prisma.session2.findMany({
      select: { id: true, name: true, createdAt: true }
    });
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Roles('formateur', 'admin')
  @Post(':session2Id/add-user')
  async addUserToSession(
    @Param('session2Id') session2Id: string,
    @Body('email') email: string,
  ) {
    return this.service.addUserToSession(Number(session2Id), email);
  }

  @Roles('createurdeformation', 'admin', 'etudiant','formateur','etablissement')
  @Get(':session2Id/users')
  async getSessionUsers(@Param('session2Id') session2Id: string) {
    return this.service.getUsersForSession(Number(session2Id));
  }

  @Roles('formateur', 'admin')
  @Delete(':session2Id/remove-user/:userId')
  async removeUserFromSession(
    @Param('session2Id') session2Id: string,
    @Param('userId') userId: string
  ) {
    return this.service.removeUserFromSession(Number(session2Id), Number(userId));
  }

  @Roles( 'admin')
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    return this.service.updateStatus(Number(id), status);
  }

  @Roles('createurdeformation', 'admin', 'etudiant','formateur','etablissement')
  @Get('session/:sessionId/with-feedback')
  async getSeancesWithFeedback(@Param('sessionId') sessionId: string) {
    return this.service.findSeancesWithAvgFeedback(Number(sessionId));
  }

  @Roles('createurdeformation', 'admin', 'etudiant','formateur','etablissement')
  @Get(':id/average-feedback')
  async getAverageFeedback(@Param('id') id: string) {
    return this.service.getAverageSessionFeedback(Number(id));
  }

  @Roles('createurdeformation', 'admin', 'etudiant','formateur','etablissement')
  @Get(':id')
  async getSessionById(@Param('id') id: string) {
    return this.service.getSessionById(Number(id));
  }

  // new add 
@Roles('etudiant','formateur','etablissement', 'admin')
@Get('my-sessions/:userId')
async getMySessionsOnly(@Param('userId') userId: string) {
  return this.service.getSessionsForUser(Number(userId));
}

}
