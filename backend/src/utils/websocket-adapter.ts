import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class CustomIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001"],
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'user-id', 'Accept', 'Origin', 'X-Requested-With']
      },
      transports: ['websocket', 'polling'],
      allowEIO3: true,
      pingTimeout: 60000,
      pingInterval: 25000,
    });
    
    return server;
  }
}
