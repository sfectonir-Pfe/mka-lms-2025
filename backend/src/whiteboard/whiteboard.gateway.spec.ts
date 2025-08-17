import { Test, TestingModule } from '@nestjs/testing';
import { WhiteboardGateway } from './whiteboard.gateway';
import { WhiteboardService } from './whiteboard.service';

describe('WhiteboardGateway', () => {
  let gateway: WhiteboardGateway;
  let whiteboardService: WhiteboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhiteboardGateway,
        {
          provide: WhiteboardService,
          useValue: {
            findAllBySeance: jest.fn(),
            create: jest.fn(),
            deleteAllBySeance: jest.fn(),
            deleteByClientIds: jest.fn(),
            deleteByDbIds: jest.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get<WhiteboardGateway>(WhiteboardGateway);
    whiteboardService = module.get<WhiteboardService>(WhiteboardService);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleJoinWhiteboard', () => {
    it('should join client to seance room and emit whiteboard-sync', async () => {
      const mockClient = {
        join: jest.fn(),
        emit: jest.fn(),
      } as any;
      const seanceId = 1;
      const mockActions = [{ id: 1, type: 'draw' }];

      jest.spyOn(whiteboardService, 'findAllBySeance').mockResolvedValue(mockActions);

      await gateway.handleJoinWhiteboard(seanceId, mockClient);

      expect(mockClient.join).toHaveBeenCalledWith(`seance-${seanceId}`);
      expect(whiteboardService.findAllBySeance).toHaveBeenCalledWith(seanceId);
      expect(mockClient.emit).toHaveBeenCalledWith('whiteboard-sync', mockActions);
    });
  });

  describe('handleLeaveWhiteboard', () => {
    it('should leave client from seance room', () => {
      const mockClient = {
        leave: jest.fn(),
      } as any;
      const data = { seanceId: 1 };

      gateway.handleLeaveWhiteboard(data, mockClient);

      expect(mockClient.leave).toHaveBeenCalledWith(`seance-${data.seanceId}`);
    });
  });

  describe('handleWhiteboardAction', () => {
    it('should create whiteboard action and broadcast to seance', async () => {
      const mockServer = {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      };
      gateway.server = mockServer as any;

      const mockData = {
        seanceId: 1,
        type: 'draw',
        data: { points: [[0, 0]] },
      };

      jest.spyOn(whiteboardService, 'create').mockResolvedValue(mockData);

      await gateway.handleWhiteboardAction(mockData);

      expect(whiteboardService.create).toHaveBeenCalled();
      expect(mockServer.to).toHaveBeenCalledWith(`seance-${mockData.seanceId}`);
      expect(mockServer.emit).toHaveBeenCalledWith('whiteboard-action', mockData);
    });
  });

  describe('handleWhiteboardClear', () => {
    it('should clear whiteboard and broadcast clear event', async () => {
      const mockServer = {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      };
      gateway.server = mockServer as any;

      const data = { seanceId: 1 };

      jest.spyOn(whiteboardService, 'deleteAllBySeance').mockResolvedValue(undefined);

      await gateway.handleWhiteboardClear(data);

      expect(whiteboardService.deleteAllBySeance).toHaveBeenCalledWith(data.seanceId);
      expect(mockServer.to).toHaveBeenCalledWith(`seance-${data.seanceId}`);
      expect(mockServer.emit).toHaveBeenCalledWith('whiteboard-clear');
    });
  });

  describe('handleWhiteboardDelete', () => {
    it('should delete whiteboard actions and broadcast delete event', async () => {
      const mockServer = {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
      };
      gateway.server = mockServer as any;

      const data = { seanceId: 1, ids: ['action1', 2] };

      jest.spyOn(whiteboardService, 'deleteByClientIds').mockResolvedValue(undefined);
      jest.spyOn(whiteboardService, 'deleteByDbIds').mockResolvedValue(undefined);

      await gateway.handleWhiteboardDelete(data);

      expect(whiteboardService.deleteByClientIds).toHaveBeenCalledWith(data.seanceId, ['action1']);
      expect(whiteboardService.deleteByDbIds).toHaveBeenCalledWith(data.seanceId, [2]);
      expect(mockServer.to).toHaveBeenCalledWith(`seance-${data.seanceId}`);
      expect(mockServer.emit).toHaveBeenCalledWith('whiteboard-delete', { ids: data.ids });
    });
  });
});
