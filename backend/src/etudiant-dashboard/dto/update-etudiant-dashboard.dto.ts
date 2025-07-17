import { PartialType } from '@nestjs/swagger';
import { CreateEtudiantDashboardDto } from './create-etudiant-dashboard.dto';

export class UpdateEtudiantDashboardDto extends PartialType(CreateEtudiantDashboardDto) {}
