import { PartialType } from '@nestjs/swagger';
import { CreateSessionFeedbackDto } from './create-session-feedback.dto';

export class UpdateSessionFeedbackDto extends PartialType(CreateSessionFeedbackDto) {}
