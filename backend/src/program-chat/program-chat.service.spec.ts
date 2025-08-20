import { Test, TestingModule } from '@nestjs/testing';
import { ProgramChatService } from './program-chat.service';

describe('ProgramChatService', () => {
  let service: ProgramChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramChatService],
    }).compile();

    service = module.get<ProgramChatService>(ProgramChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
