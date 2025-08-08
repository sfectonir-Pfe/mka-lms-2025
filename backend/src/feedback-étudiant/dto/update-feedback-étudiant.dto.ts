import { PartialType } from '@nestjs/swagger';
import { CreateFeedbackÉtudiantDto } from './create-feedback-étudiant.dto';

export class UpdateFeedbackÉtudiantDto extends PartialType(CreateFeedbackÉtudiantDto) {}
