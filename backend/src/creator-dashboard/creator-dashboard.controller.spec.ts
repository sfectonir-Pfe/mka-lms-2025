import { Test, TestingModule } from '@nestjs/testing';
import { CreatorDashboardController } from './creator-dashboard.controller';
import { CreatorDashboardService } from './creator-dashboard.service';

describe('CreatorDashboardController', () => {
  let controller: CreatorDashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreatorDashboardController],
      providers: [CreatorDashboardService],
    }).compile();

    controller = module.get<CreatorDashboardController>(CreatorDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
