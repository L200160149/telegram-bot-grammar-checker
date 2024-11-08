import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
// import TelegramBot from 'node-telegram-bot-api';
import { lastValueFrom } from 'rxjs';
const TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class TelegramService implements OnModuleInit {
    private bot: any;
    private readonly token = process.env.TELEGRAM_TOKEN;
    private userStates = new Map<number, string>();

    constructor(private readonly httpService: HttpService) {
        this.bot = new TelegramBot(this.token, { polling: true });
    }

    onModuleInit() {
        this.bot.on('message', async (msg) => {
            const chatId = msg.chat.id;

            if (msg.text) {
                const text = msg.text.trim();

                if (text === '/grammar') {
                    this.userStates.set(chatId, 'grammar'); // Set state to grammar
                    this.bot.sendMessage(chatId, 'You are now in Grammar Check mode. Send a sentence to check');
                } else if (text === '/conversation') {
                    this.userStates.set(chatId, 'conversation'); // Set state to conversation
                    this.bot.sendMessage(chatId, 'The Conversation Mode is under development');
                } else if (text === '/exit') {
                    this.userStates.delete(chatId); // Remove user state
                } else {
                    // Handle based on the user's current state
                    const userState = this.userStates.get(chatId);

                    if (userState === 'grammar') {
                        await this.handleGrammarCheck(chatId, text);
                    } else if (userState === 'conversation') {
                        await this.handleConversation(chatId, text)
                    } else {
                        this.bot.sendMessage(
                            chatId,
                            `🤖 *Welcome to the Bot!*\n\nPlease choose an option by sending the corresponding command:\n\n/grammar (Check Grammar)\n/conversation (Start a Conversation)\n/exit (Exit)\n\n*Example:* Type "/grammar" to check grammar.`,
                            { parse_mode: 'Markdown' }
                        ).then((sentMessage) => {
                            // Pin the message
                            this.bot.pinChatMessage(chatId, sentMessage.message_id, { disable_notification: true})
                        });
                        
                    }
                }
            }
        })
    }

    async handleGrammarCheck(chatId: number, sentence: string) {
        try {
            const response = await this.checkGrammar(sentence);
            this.bot.sendMessage(chatId, response.reply)
        } catch (error) {
            this.bot.sendMessage(chatId, 'Please send a sentence to check.')
        }
    }

    async handleConversation(chatId: number, text: string) {
        this.bot.sendMessage(chatId, 'The Conversation Mode is under development')
    }

    async checkGrammar(sentence: string): Promise<any> {
        const response = await lastValueFrom(
            this.httpService.post(`http://localhost:${process.env.PORT}/api/ask-query`, {sentence})
        );
        
        return response.data;
    }
}
