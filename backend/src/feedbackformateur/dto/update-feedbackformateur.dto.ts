import { PartialType } from '@nestjs/mapped-types';
import { CreateFeedbackFormateurDto } from './create-feedbackformateur.dto';

export class UpdateFeedbackFormateurDto extends PartialType(CreateFeedbackFormateurDto) {}
