const TelegramBot = require('node-telegram-bot-api');
const { PrismaClient } = require('@prisma/client'); // Importe o PrismaClient
// replace the value below with the Telegram token you receive from @BotFather
const token = '6532664208:AAF5s3sRzKj21jEGtC1syeRhKCGSjtSNfTk';

const prisma = new PrismaClient(); // Inicialize o PrismaClient
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const date = new Date(msg.date * 1000);
  const hour = date.getHours();

  if (hour >= 9 && hour <= 18) {
    bot.sendMessage(chatId, 'bom dia/boa tarde, link do site:https://uvv.br');
  } else {
    bot.sendMessage(chatId, 'Estamos fora do horário comercial (09:00 às 18:00). Por favor, forneça seu e-mail para que possamos entrar em contato.');
    bot.once('message', async (msg) => {
      const email = msg.text;
      // Store the email in the SQLite database using Prisma
      await prisma.user.create({
        data: {
          email: email,
        },
      });
    });
  }
});
