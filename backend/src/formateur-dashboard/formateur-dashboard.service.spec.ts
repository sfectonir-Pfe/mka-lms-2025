import { Test, TestingModule } from '@nestjs/testing';
import { FormateurDashboardService } from './formateur-dashboard.service';

describe('FormateurDashboardService', () => {
  let service: FormateurDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormateurDashboardService],
    }).compile();

    service = module.get<FormateurDashboardService>(FormateurDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
