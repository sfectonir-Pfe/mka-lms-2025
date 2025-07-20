import { Test, TestingModule } from '@nestjs/testing';
import { GeneralChatMessageController } from './general-chat-message.controller';
import { GeneralChatMessageService } from './general-chat-message.service';

describe('GeneralChatMessageController', () => {
  let controller: GeneralChatMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneralChatMessageController],
      providers: [GeneralChatMessageService],
    }).compile();

    controller = module.get<GeneralChatMessageController>(GeneralChatMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
