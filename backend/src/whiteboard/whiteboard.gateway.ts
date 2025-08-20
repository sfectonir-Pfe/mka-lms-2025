import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WhiteboardService } from './whiteboard.service';

@WebSocketGateway({ cors: true })
export class WhiteboardGateway {
  constructor(
    private readonly whiteboardService: WhiteboardService,
  ) {}

  @WebSocketServer()
  server: Server;

  // User joins a specific Séance whiteboard room
  @SubscribeMessage('join-seance')
  async handleJoinWhiteboard(@MessageBody() seanceId: number, @ConnectedSocket() client: Socket) {
    client.join(`seance-${seanceId}`);
    const actions = await this.whiteboardService.findAllBySeance(seanceId);
    client.emit('whiteboard-sync', actions);
  }

  // User leaves a Séance whiteboard room
  @SubscribeMessage('leave-seance')
  handleLeaveWhiteboard(
    @MessageBody() data: { seanceId: number },
    @ConnectedSocket() client: Socket
  ) {
    client.leave(`seance-${data.seanceId}`);
  }

  // Handle whiteboard drawing actions (pen, shapes, text, tables)
  @SubscribeMessage('whiteboard-action')
  async handleWhiteboardAction(@MessageBody() data: any) {
    const { id: clientId, updatedById, ...rest } = data || {};
    const createInput: any = { ...rest };
    
    if (updatedById && !createInput.createdById) {
      createInput.createdById = updatedById;
    }
    
    if ('id' in createInput) delete createInput.id;
    
    // Persist client id inside data for future targeted deletes
    try {
      if (clientId) {
        if (!createInput.data || typeof createInput.data !== 'object') createInput.data = {};
        (createInput.data as any).clientId = String(clientId);
      }
    } catch (error) {
      console.warn('Failed to set clientId in whiteboard action:', error);
    }
    
    try {
      await this.whiteboardService.create(createInput);
    } catch (err) {
      console.error('Failed to persist whiteboard action:', err);
    }
    
    // Broadcast the action to all users in the seance
    this.server.to(`seance-${data.seanceId}`).emit('whiteboard-action', data);
  }

  // Clear all whiteboard content for a seance
  @SubscribeMessage('whiteboard-clear')
  async handleWhiteboardClear(@MessageBody() data: { seanceId: number }) {
    try {
      // Delete all whiteboard actions for this seance
      await this.whiteboardService.deleteAllBySeance(data.seanceId);
      // Broadcast clear event to all users in the seance
      this.server.to(`seance-${data.seanceId}`).emit('whiteboard-clear');
    } catch (err) {
      console.error('Failed to clear whiteboard:', err);
    }
  }

  // Delete specific whiteboard elements
  @SubscribeMessage('whiteboard-delete')
  async handleWhiteboardDelete(@MessageBody() data: { seanceId: number; ids: (string | number)[] }) {
    try {
      const ids = Array.isArray(data.ids) ? data.ids : [];
      const asStrings = ids.filter((v) => typeof v === 'string') as string[];
      const asNumbers = ids.filter((v) => typeof v === 'number') as number[];
      
      if (asStrings.length > 0) {
        await this.whiteboardService.deleteByClientIds(data.seanceId, asStrings);
      }
      
      if (asNumbers.length > 0) {
        await this.whiteboardService.deleteByDbIds(data.seanceId, asNumbers);
      }
      
      this.server.to(`seance-${data.seanceId}`).emit('whiteboard-delete', { ids });
    } catch (err) {
      console.error('Failed to delete whiteboard actions:', err);
    }
  }

  // Handle whiteboard undo/redo operations
  @SubscribeMessage('whiteboard-undo')
  async handleWhiteboardUndo(@MessageBody() data: { seanceId: number; userId: number }) {
    try {
      // This could be implemented to handle undo operations
      // For now, just broadcast the event
      this.server.to(`seance-${data.seanceId}`).emit('whiteboard-undo', { userId: data.userId });
    } catch (err) {
      console.error('Failed to handle whiteboard undo:', err);
    }
  }

  @SubscribeMessage('whiteboard-redo')
  async handleWhiteboardRedo(@MessageBody() data: { seanceId: number; userId: number }) {
    try {
      // This could be implemented to handle redo operations
      // For now, just broadcast the event
      this.server.to(`seance-${data.seanceId}`).emit('whiteboard-redo', { userId: data.userId });
    } catch (err) {
      console.error('Failed to handle whiteboard redo:', err);
    }
  }

  // Handle user presence in whiteboard
  @SubscribeMessage('whiteboard-user-joined')
  handleUserJoined(
    @MessageBody() data: { seanceId: number; userId: number; userName: string },
    @ConnectedSocket() client: Socket
  ) {
    this.server.to(`seance-${data.seanceId}`).emit('whiteboard-user-joined', {
      userId: data.userId,
      userName: data.userName,
      socketId: client.id,
    });
  }

  @SubscribeMessage('whiteboard-user-left')
  handleUserLeft(
    @MessageBody() data: { seanceId: number; userId: number; userName: string },
    @ConnectedSocket() client: Socket
  ) {
    this.server.to(`seance-${data.seanceId}`).emit('whiteboard-user-left', {
      userId: data.userId,
      userName: data.userName,
      socketId: client.id,
    });
  }

  // Handle cursor position for collaborative features
  @SubscribeMessage('whiteboard-cursor-move')
  handleCursorMove(
    @MessageBody() data: { seanceId: number; userId: number; x: number; y: number },
    @ConnectedSocket() client: Socket
  ) {
    // Broadcast cursor position to other users (excluding sender)
    client.to(`seance-${data.seanceId}`).emit('whiteboard-cursor-move', {
      userId: data.userId,
      x: data.x,
      y: data.y,
      socketId: client.id,
    });
  }
}
