import { Test, TestingModule } from '@nestjs/testing';
import { Session2ChatController } from './session2-chat.controller';
import { Session2ChatService } from './session2-chat.service';

describe('Session2ChatController', () => {
  let controller: Session2ChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Session2ChatController],
      providers: [Session2ChatService],
    }).compile();

    controller = module.get<Session2ChatController>(Session2ChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
