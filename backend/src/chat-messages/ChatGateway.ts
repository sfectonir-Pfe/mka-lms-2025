import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessagesService } from './chat-messages.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  constructor(
    private readonly chatService: ChatMessagesService,
  ) {}

  @WebSocketServer()
  server: Server;

  // User joins a specific Séance chat room
  @SubscribeMessage('joinSeance')
  handleJoinSeance(
    @MessageBody() data: { seanceId: number },
    @ConnectedSocket() client: Socket
  ) {
    client.join(`seance-${data.seanceId}`);
    // Optionally, notify others
    // this.server.to(`seance-${data.seanceId}`).emit('userJoined', ...);
  }

  // User leaves a Séance chat room
  @SubscribeMessage('leaveSeance')
  handleLeaveSeance(
    @MessageBody() data: { seanceId: number },
    @ConnectedSocket() client: Socket
  ) {
    client.leave(`seance-${data.seanceId}`);
  }

  // User sends message to the Séance chat
  @SubscribeMessage('sendSeanceMessage')
  async handleSendSeanceMessage(
    @MessageBody() data: {
      seanceId: number;
      senderId?: number;
      type: 'text' | 'image' | 'video' | 'audio' | 'file';
      content: string;
    }
  ) {
    // 1. Save to DB (with senderId, type, etc.)
    const message = await this.chatService.create(data);

    // 2. Broadcast to all users in this Séance chat
    this.server.to(`seance-${data.seanceId}`).emit('newSeanceMessage', message);
  }

  // (Optional) Message delete broadcast (if your service supports it)
  @SubscribeMessage('deleteSeanceMessage')
  async handleDeleteSeanceMessage(
    @MessageBody() data: { seanceId: number; messageId: number; userId: number }
  ) {
    // Service: delete if allowed
    await this.chatService.deleteMessage(data.messageId, data.userId);
    // Notify clients
    this.server.to(`seance-${data.seanceId}`).emit('deleteSeanceMessage', { id: data.messageId });
  }
}
