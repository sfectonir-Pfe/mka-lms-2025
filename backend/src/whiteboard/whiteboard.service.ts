
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

  deleteAllBySeance(seanceId: number) {
    return this.prisma.whiteboardAction.deleteMany({
      where: { seanceId },
    });
  }

  deleteByClientIds(seanceId: number, clientIds: string[]) {
    if (!Array.isArray(clientIds) || clientIds.length === 0) return Promise.resolve({ count: 0 }) as any
    // Delete any actions whose JSON data.clientId matches one of the provided ids
    return this.prisma.whiteboardAction.deleteMany({
      where: {
        seanceId,
        OR: clientIds.map((id) => ({ data: { path: ['clientId'], equals: id } } as any)),
      },
    })
  }

  deleteByDbIds(seanceId: number, dbIds: number[]) {
    if (!Array.isArray(dbIds) || dbIds.length === 0) return Promise.resolve({ count: 0 }) as any
    return this.prisma.whiteboardAction.deleteMany({
      where: { seanceId, id: { in: dbIds } },
    })
  }
}
