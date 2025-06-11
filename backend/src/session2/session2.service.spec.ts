import { Test, TestingModule } from '@nestjs/testing';
import { Session2Service } from './session2.service';

describe('Session2Service', () => {
  let service: Session2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Session2Service],
    }).compile();

    service = module.get<Session2Service>(Session2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
