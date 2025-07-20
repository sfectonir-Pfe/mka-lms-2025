import { Test, TestingModule } from '@nestjs/testing';
import { FormateurDashboardController } from './formateur-dashboard.controller';
import { FormateurDashboardService } from './formateur-dashboard.service';

describe('FormateurDashboardController', () => {
  let controller: FormateurDashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormateurDashboardController],
      providers: [FormateurDashboardService],
    }).compile();

    controller = module.get<FormateurDashboardController>(FormateurDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
