
import { CreateWhiteboardDto } from './dto/create-whiteboard.dto';
import { UpdateWhiteboardDto } from './dto/update-whiteboard.dto';

// src/whiteboard/whiteboard.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';


@Injectable()
export class WhiteboardService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.WhiteboardActionCreateInput) {
    return this.prisma.whiteboardAction.create({ data });
  }

  findAllBySeance(seanceId: number) {
    return this.prisma.whiteboardAction.findMany({
      where: { seanceId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
