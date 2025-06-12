import { Test, TestingModule } from '@nestjs/testing';
import { buildProgramController } from './buildProgram.controller';
import { buildProgramService } from './buildProgram.service';

describe('buildProgramController', () => {
  let controller: buildProgramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [buildProgramController],
      providers: [buildProgramService],
    }).compile();

    controller = module.get<buildProgramController>(buildProgramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
