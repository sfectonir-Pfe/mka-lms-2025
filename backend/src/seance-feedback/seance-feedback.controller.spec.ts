import { Test, TestingModule } from '@nestjs/testing';
import { SeanceFeedbackController } from './seance-feedback.controller';
import { SeanceFeedbackService } from './seance-feedback.service';

describe('SeanceFeedbackController', () => {
  let controller: SeanceFeedbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeanceFeedbackController],
      providers: [SeanceFeedbackService],
    }).compile();

    controller = module.get<SeanceFeedbackController>(SeanceFeedbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
