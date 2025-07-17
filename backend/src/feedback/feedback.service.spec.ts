import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService } from './feedback.service';
import { PrismaService } from 'nestjs-prisma';
import { NotFoundException } from '@nestjs/common';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    feedback: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    feedbackResponse: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a feedback', async () => {
      const createFeedbackDto = {
        message: 'Test feedback',
        type: 'general',
        rating: 4,
      };

      mockPrismaService.feedback.create.mockResolvedValue({
        id: 1,
        ...createFeedbackDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(createFeedbackDto);

      expect(result).toEqual(
        expect.objectContaining({
          id: 1,
          message: 'Test feedback',
          type: 'general',
          rating: 4,
        }),
      );
      expect(mockPrismaService.feedback.create).toHaveBeenCalledWith({
        data: createFeedbackDto,
      });
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

      mockPrismaService.feedback.findMany.mockResolvedValue(feedbacks);

      const result = await service.findAll();

      expect(result).toEqual(feedbacks);
      expect(mockPrismaService.feedback.findMany).toHaveBeenCalled();
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

      mockPrismaService.feedback.findUnique.mockResolvedValue(feedback);

      const result = await service.findOne(1);

      expect(result).toEqual(feedback);
      expect(mockPrismaService.feedback.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { responses: true },
      });
    });

    it('should throw NotFoundException if feedback not found', async () => {
      mockPrismaService.feedback.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});