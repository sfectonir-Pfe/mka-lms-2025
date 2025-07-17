import { Test, TestingModule } from '@nestjs/testing';
import { EtudiantDashboardController } from './etudiant-dashboard.controller';
import { EtudiantDashboardService } from './etudiant-dashboard.service';

describe('EtudiantDashboardController', () => {
  let controller: EtudiantDashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EtudiantDashboardController],
      providers: [EtudiantDashboardService],
    }).compile();

    controller = module.get<EtudiantDashboardController>(EtudiantDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
