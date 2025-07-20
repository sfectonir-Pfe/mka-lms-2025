// src/whiteboard/whiteboard.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { WhiteboardService } from './whiteboard.service';

@Controller('whiteboard')
export class WhiteboardController {
  constructor(private readonly whiteboardService: WhiteboardService) {}

  @Get('actions')
  findAllBySeance(@Query('seanceId') seanceId: number) {
    return this.whiteboardService.findAllBySeance(Number(seanceId));
  }
}
