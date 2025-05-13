import { Test, TestingModule } from '@nestjs/testing';
import { ModuleCourseService } from './module-course.service';

describe('ModuleCourseService', () => {
  let service: ModuleCourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModuleCourseService],
    }).compile();

    service = module.get<ModuleCourseService>(ModuleCourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
