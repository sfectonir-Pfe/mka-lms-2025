import { PartialType } from '@nestjs/swagger';
import { CreateFormateurDashboardDto } from './create-formateur-dashboard.dto';

export class UpdateFormateurDashboardDto extends PartialType(CreateFormateurDashboardDto) {}
