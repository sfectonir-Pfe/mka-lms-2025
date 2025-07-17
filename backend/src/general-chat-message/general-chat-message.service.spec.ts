import { Test, TestingModule } from '@nestjs/testing';
import { GeneralChatMessageService } from './general-chat-message.service';

describe('GeneralChatMessageService', () => {
  let service: GeneralChatMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneralChatMessageService],
    }).compile();

    service = module.get<GeneralChatMessageService>(GeneralChatMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
