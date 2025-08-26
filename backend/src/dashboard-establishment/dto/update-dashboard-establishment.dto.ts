import { PartialType } from '@nestjs/swagger';
import { CreateDashboardEstablishmentDto } from './create-dashboard-establishment.dto';

export class UpdateDashboardEstablishmentDto extends PartialType(CreateDashboardEstablishmentDto) {}
