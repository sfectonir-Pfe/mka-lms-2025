import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GeneralChatMessagesService } from './general-chat-message.service';

type ChatType = 'text' | 'image' | 'video' | 'audio' | 'file'; // <--- ADD THIS LINE

@WebSocketGateway({
  namespace: '/general-chat',
  cors: { origin: '*' },
})
export class GeneralChatMessageGateway implements OnGatewayInit {
  server: Server;

  constructor(private readonly generalChatMessagesService: GeneralChatMessagesService) {}

  afterInit(server: Server) {
    this.server = server;
  }

  @SubscribeMessage('sendGeneralMessage')
  async handleSendGeneralMessage(
    @MessageBody() data: { type: string; content: string; senderId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const msg = await this.generalChatMessagesService.create({
      ...data,
      type: data.type as ChatType, // This line now works!
    });
    this.server.emit('newGeneralMessage', msg);
    return msg;
  }


  @SubscribeMessage('fetchGeneralMessages')
  async handleFetchGeneralMessages(@ConnectedSocket() client: Socket) {
    const messages = await this.generalChatMessagesService.findAll();
    client.emit('generalMessages', messages);
    return messages;
  }

  @SubscribeMessage('deleteGeneralMessage')
  async handleDeleteGeneralMessage(
    @MessageBody() data: { id: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    await this.generalChatMessagesService.deleteMessage(data.id, data.userId);
    this.server.emit('deleteGeneralMessage', { id: data.id });
  }
}
