import { Module } from "@nestjs/common"
import { UsersService } from "./users.service"
import { UsersController } from "./users.controller"
import { PrismaModule } from "nestjs-prisma"
import { MailModule } from "../mail/mail.module"
import { S3Module } from "../s3/s3.module"

@Module({
  imports: [
    PrismaModule, // Import du module Prisma
    MailModule, // Import du module Mail
    S3Module, // Import du module S3
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export si utilisé dans d'autres modules
})
export class UsersModule {}
