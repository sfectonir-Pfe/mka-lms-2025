import { Test, TestingModule } from '@nestjs/testing';
import { Session2Controller } from './session2.controller';
import { Session2Service } from './session2.service';

describe('Session2Controller', () => {
  let controller: Session2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Session2Controller],
      providers: [Session2Service],
    }).compile();

    controller = module.get<Session2Controller>(Session2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
