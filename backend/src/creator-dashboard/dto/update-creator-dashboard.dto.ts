import { PartialType } from '@nestjs/swagger';
import { CreateCreatorDashboardDto } from './create-creator-dashboard.dto';

export class UpdateCreatorDashboardDto extends PartialType(CreateCreatorDashboardDto) {}
