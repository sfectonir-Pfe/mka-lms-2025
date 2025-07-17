import { Test, TestingModule } from '@nestjs/testing';
import { CreatorDashboardService } from './creator-dashboard.service';

describe('CreatorDashboardService', () => {
  let service: CreatorDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatorDashboardService],
    }).compile();

    service = module.get<CreatorDashboardService>(CreatorDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
