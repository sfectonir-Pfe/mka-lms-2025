import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      client.join(userId.toString());
      console.log(`Client ${client.id} joined room ${userId}`);
    } else {
      console.log(`Client ${client.id} connected without userId`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Send real-time notification to a specific user, send full notification object
  sendRealTimeNotification(userId: number, notification: any) {
    console.log('Emitting new-notification to room', userId, notification);
    this.server.to(userId.toString()).emit('new-notification', notification);
  }
  // notification-gateway.ts
broadcastNotification(notification: any) {
  this.server.emit('new-notification', notification); // sends to all connected
}

}
