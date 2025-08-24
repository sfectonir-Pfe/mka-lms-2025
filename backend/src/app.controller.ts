import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Get('websocket-test')
  getWebSocketTest() {
    return {
      message: 'WebSocket server is running',
      timestamp: new Date().toISOString(),
      status: 'ok'
    };
  }
}
