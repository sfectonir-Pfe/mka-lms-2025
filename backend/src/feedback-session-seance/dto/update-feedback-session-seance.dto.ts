import { PartialType } from '@nestjs/swagger';
import { CreateFeedbackSessionSeanceDto } from './create-feedback-session-seance.dto';

export class UpdateFeedbackSessionSeanceDto extends PartialType(CreateFeedbackSessionSeanceDto) {}
