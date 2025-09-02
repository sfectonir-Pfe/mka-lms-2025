import { Test, TestingModule } from '@nestjs/testing';
import { DashboardEstablishmentService } from './dashboard-establishment.service';

describe('DashboardEstablishmentService', () => {
  let service: DashboardEstablishmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashboardEstablishmentService],
    }).compile();

    service = module.get<DashboardEstablishmentService>(DashboardEstablishmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
