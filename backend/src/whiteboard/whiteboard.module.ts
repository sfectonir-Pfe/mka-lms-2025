import { Module } from '@nestjs/common';
import { WhiteboardService } from './whiteboard.service';
import { WhiteboardController } from './whiteboard.controller';
import { WhiteboardGateway } from './whiteboard.gateway';

@Module({
  controllers: [WhiteboardController],
  providers: [WhiteboardService,WhiteboardGateway],
})
export class WhiteboardModule {}
