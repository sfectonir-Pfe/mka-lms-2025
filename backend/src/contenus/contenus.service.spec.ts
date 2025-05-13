import { Test, TestingModule } from '@nestjs/testing';
import { ContenusService } from './contenus.service';

describe('ContenusService', () => {
  let service: ContenusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContenusService],
    }).compile();

    service = module.get<ContenusService>(ContenusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
