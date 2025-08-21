import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ProgramChatService } from './program-chat.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: '/program-chat', cors: true })
export class ProgramChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ProgramChatGateway.name);

  constructor(private readonly programChatService: ProgramChatService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinProgram')
  handleJoinProgram(
    @MessageBody() data: { programId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `program-${data.programId}`;
    client.join(room);
    this.logger.log(`User ${client.id} joined room: ${room}`);
    client.emit('joinedProgram', { programId: data.programId });
  }

  @SubscribeMessage('leaveProgram')
  handleLeaveProgram(
    @MessageBody() data: { programId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `program-${data.programId}`;
    client.leave(room);
    this.logger.log(`User ${client.id} left room: ${room}`);
    client.emit('leftProgram', { programId: data.programId });
  }

  @SubscribeMessage('sendProgramMessage')
  async handleSendProgramMessage(
    @MessageBody()
    data: {
      programId: number;
      senderId?: number;
      type: 'text' | 'image' | 'video' | 'audio' | 'file';
      content: string;
    },
  ) {
    try {
      const message = await this.programChatService.create(data);
      this.server.to(`program-${data.programId}`).emit('newProgramMessage', message);
      return message;
    } catch (e: any) {
      throw new WsException(e?.message ?? 'Failed to send message');
    }
  }

  @SubscribeMessage('deleteProgramMessage')
  async handleDeleteProgramMessage(
    @MessageBody() data: { programId: number; messageId: number; userId: number },
  ) {
    try {
      const deleted = await this.programChatService.deleteMessage(data.messageId, data.userId);
      this.server.to(`program-${data.programId}`).emit('deleteProgramMessage', { id: deleted.id });
    } catch (e: any) {
      throw new WsException(e?.message ?? 'Failed to delete message');
    }
  }
}
