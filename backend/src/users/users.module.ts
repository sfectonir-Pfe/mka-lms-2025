import { Module } from "@nestjs/common"
import { UsersService } from "./users.service"
import { UsersController } from "./users.controller"
import { PrismaModule } from "nestjs-prisma"
import { MailModule } from "../mail/mail.module"

@Module({
  imports: [
    PrismaModule, // Import du module Prisma
    MailModule, // Import du module Mail
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export si utilisé dans d'autres modules
})
export class UsersModule {}
