import { Test, TestingModule } from '@nestjs/testing';
import { EtudiantDashboardService } from './etudiant-dashboard.service';

describe('EtudiantDashboardService', () => {
  let service: EtudiantDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EtudiantDashboardService],
    }).compile();

    service = module.get<EtudiantDashboardService>(EtudiantDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
