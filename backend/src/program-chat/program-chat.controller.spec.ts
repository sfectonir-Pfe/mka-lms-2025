import { Test, TestingModule } from '@nestjs/testing';
import { ProgramChatController } from './program-chat.controller';
import { ProgramChatService } from './program-chat.service';

describe('ProgramChatController', () => {
  let controller: ProgramChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramChatController],
      providers: [ProgramChatService],
    }).compile();

    controller = module.get<ProgramChatController>(ProgramChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
