import { Test, TestingModule } from '@nestjs/testing';
import { ContenusController } from './contenu.controller';
import { ContenusService } from './contenu.service';

describe('ContenuController', () => {
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
