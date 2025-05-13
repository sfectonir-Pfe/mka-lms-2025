import { Test, TestingModule } from '@nestjs/testing';
import { ModuleCourseController } from './module-course.controller';
import { ModuleCourseService } from './module-course.service';

describe('ModuleCourseController', () => {
  let controller: ModuleCourseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModuleCourseController],
      providers: [ModuleCourseService],
    }).compile();

    controller = module.get<ModuleCourseController>(ModuleCourseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
