import { Test, TestingModule } from '@nestjs/testing';
import { Session2ChatService } from './session2-chat.service';

describe('Session2ChatService', () => {
  let service: Session2ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Session2ChatService],
    }).compile();

    service = module.get<Session2ChatService>(Session2ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
