import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WhiteboardService } from './whiteboard.service';

@WebSocketGateway({
  cors: { origin: '*' },       // <= autorise tous les domaines
  namespace: '/whiteboard',    // <= DOIT MATCH l’URL du front
})
export class WhiteboardGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly whiteboardService: WhiteboardService) {}

  @SubscribeMessage('join-seance')
  async handleJoin(@MessageBody() seanceId: number, @ConnectedSocket() client: Socket) {
    console.log("join-seance", seanceId);
    client.join(`seance-${seanceId}`);
    const actions = await this.whiteboardService.findAllBySeance(seanceId);
    client.emit('whiteboard-sync', actions);
  }

  @SubscribeMessage('whiteboard-action')
  async handleAction(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log("whiteboard-action", data);
    const action = await this.whiteboardService.create(data);
    this.server.to(`seance-${data.seanceId}`).emit('whiteboard-action', action);
  }
}
