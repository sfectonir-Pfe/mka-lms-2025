import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Headers } from '@nestjs/common';
import { FeedbackÉtudiantService } from './feedback-étudiant.service';
import { CreateFeedbackÉtudiantDto } from './dto/create-feedback-étudiant.dto';
import { UpdateFeedbackÉtudiantDto } from './dto/update-feedback-étudiant.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('feedback-étudiant')

@Controller('feedback-etudiant')
export class FeedbackÉtudiantController {
  constructor(private readonly feedbackÉtudiantService: FeedbackÉtudiantService) {}

  @Post()
  create(@Body() createFeedbackÉtudiantDto: CreateFeedbackÉtudiantDto) {
    return this.feedbackÉtudiantService.create(createFeedbackÉtudiantDto);
  }

  @Get()
  findAll() {
    return this.feedbackÉtudiantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedbackÉtudiantService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeedbackÉtudiantDto: UpdateFeedbackÉtudiantDto) {
    return this.feedbackÉtudiantService.update(+id, updateFeedbackÉtudiantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbackÉtudiantService.remove(+id);
  }

  // Routes pour les groupes
  @Post('groups')
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    return await this.feedbackÉtudiantService.createGroup(createGroupDto);
  }

  @Get('groups/seance/:seanceId')
  async getGroupsBySeance(@Param('seanceId') seanceId: string) {
    return await this.feedbackÉtudiantService.getGroupsBySeance(seanceId);
  }

  @Get('students/seance/:seanceId')
  async getStudentsBySeance(@Param('seanceId') seanceId: string) {
    return await this.feedbackÉtudiantService.getStudentsBySeance(seanceId);
  }

  @Patch('groups/:id')
  async updateGroup(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return await this.feedbackÉtudiantService.updateGroup(id, updateGroupDto);
  }

  @Delete('groups/:id')
  async deleteGroup(@Param('id') id: string) {
    return await this.feedbackÉtudiantService.deleteGroup(id);
  }

  @Post('groups/:groupId/students/:studentId')
  async addStudentToGroup(@Param('groupId') groupId: string, @Param('studentId') studentId: string) {
    return await this.feedbackÉtudiantService.addStudentToGroup(groupId, +studentId);
  }

  @Delete('groups/:groupId/students/:studentId')
  async removeStudentFromGroup(@Param('groupId') groupId: string, @Param('studentId') studentId: string) {
    return await this.feedbackÉtudiantService.removeStudentFromGroup(groupId, +studentId);
  }


  // Nouveaux endpoints pour les feedbacks entre étudiants
  @Post('student-feedback')
  async createStudentFeedback(
    @Headers('user-id') fromStudentId: string,
    @Body() createFeedbackDto: CreateFeedbackÉtudiantDto
  ) {
    return await this.feedbackÉtudiantService.createStudentFeedback(+fromStudentId, createFeedbackDto);
  }

  @Get('student-feedback/:studentId')
  async getStudentFeedbacks(
    @Param('studentId') studentId: string,
    @Query('groupId') groupId?: string
  ) {
    return await this.feedbackÉtudiantService.getStudentFeedbacks(+studentId, groupId);
  }

  @Get('group-summary/:groupId')
  async getGroupFeedbackSummary(@Param('groupId') groupId: string) {
    return await this.feedbackÉtudiantService.getGroupFeedbackSummary(groupId);
  }

  @Patch('student-feedback/:feedbackId')
  async updateStudentFeedback(
    @Param('feedbackId') feedbackId: string,
    @Headers('user-id') fromStudentId: string,
    @Body() updateData: UpdateFeedbackÉtudiantDto
  ) {
    return await this.feedbackÉtudiantService.updateStudentFeedback(feedbackId, +fromStudentId, updateData);
  }

  @Delete('student-feedback/:feedbackId')
  async deleteStudentFeedback(
    @Param('feedbackId') feedbackId: string,
    @Headers('user-id') fromStudentId: string
  ) {
    return await this.feedbackÉtudiantService.deleteStudentFeedback(feedbackId, +fromStudentId);
  }

  // Endpoints pour la page FeedbackEtudiant
  @Get('me')
  async getCurrentStudent(@Headers('user-id') userId: string) {
    return await this.feedbackÉtudiantService.getCurrentStudent(+userId);
  }

  @Get('groups/student/:studentId/seance/:seanceId')
  async getStudentGroupBySeance(
    @Param('studentId') studentId: string,
    @Param('seanceId') seanceId: string
  ) {
    return await this.feedbackÉtudiantService.getStudentGroupBySeance(+studentId, seanceId);
  }

  @Get('questions/group/:groupId')
  async getFeedbackQuestions(
    @Param('groupId') groupId: string,
    @Headers('user-id') currentStudentId?: string
  ) {
    return await this.feedbackÉtudiantService.getFeedbackQuestions(groupId, currentStudentId ? +currentStudentId : undefined);
  }

  @Post('feedbacks')
  async submitFeedback(@Body() feedbackData: any) {
    return await this.feedbackÉtudiantService.submitFeedback(feedbackData);
  }

  @Get('feedbacks/group/:groupId/student/:studentId')
  async getStudentFeedbacksByGroup(
    @Param('groupId') groupId: string,
    @Param('studentId') studentId: string
  ) {
    return await this.feedbackÉtudiantService.getStudentFeedbacksByGroup(groupId, +studentId);
  }

  @Get('feedbacks/emoji-summary/:groupId')
  async getEmojiSummary(@Param('groupId') groupId: string) {
    return await this.feedbackÉtudiantService.getEmojiSummary(groupId);
  }

  @Post('send-feedback-email')
  async sendFeedbackEmail(
    @Body() data: { 
      fromStudentId: number; 
      toStudentId: number; 
      questionId: number;
      questionText: string;
      reaction: string;
      groupId: string; 
      seanceId: string;
    }
  ) {
    return await this.feedbackÉtudiantService.sendFeedbackEmail(
      data.fromStudentId,
      data.toStudentId,
      data.questionId,
      data.questionText,
      data.reaction,
      data.groupId,
      data.seanceId
    );
  }

  @Post('send-feedback-summary-email')
  async sendFeedbackSummaryEmail(
    @Body() data: { fromStudentId: number; toStudentId: number; groupId: string }
  ) {
    return await this.feedbackÉtudiantService.sendFeedbackSummaryEmail(
      data.fromStudentId,
      data.toStudentId,
      data.groupId
    );
  }




}