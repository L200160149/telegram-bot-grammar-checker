import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GrammarController } from './grammar/grammar.controller';
import { GrammarService } from './grammar/grammar.service';
import { GrammarModule } from './grammar/grammar.module';
import { TelegramService } from './telegram/telegram.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [GrammarModule, HttpModule, ConfigModule.forRoot()],
  controllers: [AppController, GrammarController],
  providers: [AppService, GrammarService, TelegramService],
})
export class AppModule {}