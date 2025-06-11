import { Test, TestingModule } from '@nestjs/testing';
<<<<<<< HEAD:backend/src/session/session.service.spec.ts
import { SessionsService } from './session.service';

describe('SessionsService', () => {
  let service: SessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionsService],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
=======
import { Session2Service } from './session2.service';

describe('Session2Service', () => {
  let service: Session2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Session2Service],
    }).compile();

    service = module.get<Session2Service>(Session2Service);
>>>>>>> bc862703938c56e819a9b04f57fce1d70ba6e00e:backend/src/session2/session2.service.spec.ts
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
