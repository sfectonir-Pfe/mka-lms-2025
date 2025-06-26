import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

describe('FeedbackController', () => {
  let controller: FeedbackController;
  let service: FeedbackService;

  const mockFeedbackService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    createResponse: jest.fn(),
    like: jest.fn(),
    dislike: jest.fn(),
    getStats: jest.fn(),
    getAnalytics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [
        {
          provide: FeedbackService,
          useValue: mockFeedbackService,
        },
      ],
    }).compile();

    controller = module.get<FeedbackController>(FeedbackController);
    service = module.get<FeedbackService>(FeedbackService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a feedback', async () => {
      const createFeedbackDto = {
        message: 'Test feedback',
        type: 'general',
        rating: 4,
      };

      mockFeedbackService.create.mockResolvedValue({
        id: 1,
        ...createFeedbackDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await controller.create(createFeedbackDto);

      expect(result).toEqual(
        expect.objectContaining({
          id: 1,
          message: 'Test feedback',
          type: 'general',
          rating: 4,
        }),
      );
      expect(mockFeedbackService.create).toHaveBeenCalledWith(createFeedbackDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of feedbacks', async () => {
      const feedbacks = [
        {
          id: 1,
          message: 'Test feedback 1',
          type: 'general',
          rating: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          message: 'Test feedback 2',
          type: 'general',
          rating: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockFeedbackService.findAll.mockResolvedValue(feedbacks);

      const result = await controller.findAll({});

      expect(result).toEqual(feedbacks);
      expect(mockFeedbackService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a feedback', async () => {
      const feedback = {
        id: 1,
        message: 'Test feedback',
        type: 'general',
        rating: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFeedbackService.findOne.mockResolvedValue(feedback);

      const result = await controller.findOne('1');

      expect(result).toEqual(feedback);
      expect(mockFeedbackService.findOne).toHaveBeenCalledWith(1);
    });
  });
});