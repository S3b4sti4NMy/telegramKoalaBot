import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.TOKEN);
import keepAlive from './keep_alive.js';
keepAlive();

// Expresiones Regulares
const tktShortRegex = /https:\/\/vm\.tiktok\.com\/.*/;
const tktLongRegex = /https:\/\/www\.tiktok\.com\/.*/;
const xLinkRegex = /https:\/\/x\.com\/.*/;
const igLinkRegex = /https:\/\/www\.instagram\.com\/.*/;

// Codigo funcionalidades del Bot
bot.hears(tktShortRegex, (ctx) => {
    const tktShortUser = ctx.message.text;
    const tktShortFinal = tktShortUser.replace('https://vm.tiktok.com/', 'https://vm.vxtiktok.com/');
    const chatId = ctx.message.chat.id;
    const messageId = ctx.message.message_id
    const chatType = ctx.chat.type;

        if (chatType === 'private') {
            ctx.reply(tktShortFinal);
            }  else {
                    const userName = ctx.from.username;
                    const nameToShow = userName ? `${userName}` : ctx.from.first_name;
                    ctx.telegram.deleteMessage(chatId, messageId)
                        .then(() => {
                            ctx.reply(`Mensaje enviado por: ${nameToShow}\n ${tktShortFinal}`);
                        })
                        .catch((err) =>
                            ctx.reply('Error al eliminar el mensaje.', err));
            }

});

bot.hears(tktLongRegex, (ctx) => {
    const tktLongUser = ctx.message.text;
    const tktLongFinal = tktLongUser.replace('https://www.tiktok.com/', 'https://vxtiktok.com/');
    const chatId = ctx.message.chat.id;
    const messageId = ctx.message.message_id
    const chatType = ctx.chat.type;

        if (chatType === 'private') {
            ctx.reply(tktLongFinal);
            }  else {
                    const userName = ctx.from.username;
                    const nameToShow = userName ? `${userName}` : ctx.from.first_name;
                    ctx.telegram.deleteMessage(chatId, messageId)
                        .then(() => {
                            ctx.reply(`Mensaje enviado por: ${nameToShow}\n ${tktLongFinal}`);
                        })
                        .catch((err) =>
                            ctx.reply('Error al eliminar el mensaje.', err));
            }
});

bot.hears(xLinkRegex, (ctx) => {
    const xLinkUser = ctx.message.text;
    const xLinkFinal = xLinkUser.replace('https://x.com/', 'https://fxtwitter.com/');
    const chatId = ctx.message.chat.id;
    const messageId = ctx.message.message_id

    const chatType = ctx.chat.type;

        if (chatType === 'private') {
            ctx.reply(xLinkFinal);
            }  else {
                const userName = ctx.from.username;
                const nameToShow = userName ? `${userName}` : ctx.from.first_name;
                    ctx.telegram.deleteMessage(chatId, messageId)
                        .then(() => {
                            ctx.reply(`Mensaje enviado por: ${nameToShow}\n ${xLinkFinal}`);
                        })
                        .catch((err) =>
                            ctx.reply('Error al eliminar el mensaje.', err));
            }
});

bot.hears(igLinkRegex,(ctx) => {
    const igLinkUser = ctx.message.text;
    const igLinkFinal = igLinkUser.replace('https://www.instagram.com/', 'https://ddinstagram.com/')
    const chatId = ctx.message.chat.id;
    const messageId = ctx.message.message_id
    const chatType = ctx.chat.type;
    if (chatType === 'private') {
        ctx.reply(igLinkFinal);
    } else {
        const userName = ctx.from.username;
                const nameToShow = userName ? `${userName}` : ctx.from.first_name;
                    ctx.telegram.deleteMessage(chatId, messageId)
                        .then(() => {
                            ctx.reply(`Mensaje enviado por: ${nameToShow}\n ${igLinkFinal}`);
                        })
                        .catch((err) =>
                            ctx.reply('Error al eliminar el mensaje.', err));
    }
});

bot.hears('.status', (ctx) => ctx.reply('Sigo hosteado correctamente!'));

bot.launch();