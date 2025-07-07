import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Session2ChatService } from './session2-chat.service';

@WebSocketGateway({ cors: true })
export class Session2ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: Session2ChatService) {}

  @WebSocketServer()
  server: Server;

  /**
   * Log when a client connects
   */
  handleConnection(client: Socket) {
    console.log(`[Session2Chat] Client connected: ${client.id}`);
  }

  /**
   * Log when a client disconnects
   */
  handleDisconnect(client: Socket) {
    console.log(`[Session2Chat] Client disconnected: ${client.id}`);
  }

  /**
   * Join a session2 chat room
   */
  @SubscribeMessage('joinSession2')
  async handleJoinRoom(
    @MessageBody() data: { session2Id: number; userId?: number },
    @ConnectedSocket() client: Socket
  ) {
    const room = `session2-${data.session2Id}`;
    client.join(room);
    console.log(`[Session2Chat] User ${data.userId || '?'} joined room: ${room}`);
    // Confirm join to the client
    client.emit('joinedSession2', { session2Id: data.session2Id, room });
    // Optional: notify others
    // this.server.to(room).emit('userJoined', { userId: data.userId });
  }

  /**
   * Leave a session2 chat room (optional, call from frontend on unmount)
   */
  @SubscribeMessage('leaveSession2')
  handleLeaveRoom(
    @MessageBody() data: { session2Id: number; userId?: number },
    @ConnectedSocket() client: Socket
  ) {
    const room = `session2-${data.session2Id}`;
    client.leave(room);
    console.log(`[Session2Chat] User ${data.userId || '?'} left room: ${room}`);
    client.emit('leftSession2', { session2Id: data.session2Id, room });
    // Optional: notify others
    // this.server.to(room).emit('userLeft', { userId: data.userId });
  }

  /**
   * Handle sending a message to the session2 room
   */
  @SubscribeMessage('sendSession2Message')
  async handleSendMessage(
    @MessageBody()
    data: {
      session2Id: number;
      senderId?: number;
      type: 'text' | 'image' | 'video' | 'audio';
      content: string;
    },
    @ConnectedSocket() client: Socket
  ) {
    const room = `session2-${data.session2Id}`;
    try {
      // Optional: verify sender is part of the session
      // If you want, check DB that user is in UserSession2 for this session2Id

      const message = await this.chatService.create(data);
      console.log(`[Session2Chat] User ${data.senderId || '?'} sent message to room: ${room} | Type: ${data.type}`);
      this.server.to(room).emit('newSession2Message', message);
      // Confirm to sender (optional)
      client.emit('session2MessageSent', { success: true, message });
    } catch (err) {
      console.error(`[Session2Chat] Error sending message:`, err);
      client.emit('session2MessageSent', { success: false, error: 'Could not send message' });
    }
  }
}
