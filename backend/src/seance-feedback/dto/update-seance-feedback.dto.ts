import { PartialType } from '@nestjs/swagger';
import { CreateSeanceFeedbackDto } from './create-seance-feedback.dto';

export class UpdateSeanceFeedbackDto extends PartialType(CreateSeanceFeedbackDto) {}
