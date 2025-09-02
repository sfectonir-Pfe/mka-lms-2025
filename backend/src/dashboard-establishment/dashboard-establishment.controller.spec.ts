import { Test, TestingModule } from '@nestjs/testing';
import { DashboardEstablishmentController } from './dashboard-establishment.controller';
import { DashboardEstablishmentService } from './dashboard-establishment.service';

describe('DashboardEstablishmentController', () => {
  let controller: DashboardEstablishmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardEstablishmentController],
      providers: [DashboardEstablishmentService],
    }).compile();

    controller = module.get<DashboardEstablishmentController>(DashboardEstablishmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
