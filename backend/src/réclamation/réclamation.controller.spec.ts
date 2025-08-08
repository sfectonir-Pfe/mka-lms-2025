import { Test, TestingModule } from '@nestjs/testing';
import { RéclamationController } from './réclamation.controller';
import { RéclamationService } from './réclamation.service';

describe('RéclamationController', () => {
  let controller: RéclamationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RéclamationController],
      providers: [RéclamationService],
    }).compile();

    controller = module.get<RéclamationController>(RéclamationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
