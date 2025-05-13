import { Test, TestingModule } from '@nestjs/testing';
import { ProgramModuleController } from './program-module.controller';
import { ProgramModuleService } from './program-module.service';

describe('ProgramModuleController', () => {
  let controller: ProgramModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramModuleController],
      providers: [ProgramModuleService],
    }).compile();

    controller = module.get<ProgramModuleController>(ProgramModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
