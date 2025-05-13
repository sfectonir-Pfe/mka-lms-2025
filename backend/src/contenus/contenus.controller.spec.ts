import { Test, TestingModule } from '@nestjs/testing';
import { ContenusController } from './contenus.controller';
import { ContenusService } from './contenus.service';

describe('ContenusController', () => {
  let controller: ContenusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContenusController],
      providers: [ContenusService],
    }).compile();

    controller = module.get<ContenusController>(ContenusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
