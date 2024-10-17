import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.TOKEN);
import keepAlive from './keep_alive.js';
import axios from 'axios';
import cron from 'node-cron';
import dotenv from 'dotenv';
keepAlive();

// Expresiones Regulares
const tktShortRegex = /https:\/\/vm\.tiktok\.com\/.*/;
const tktLongRegex = /https:\/\/www\.tiktok\.com\/.*/;
const xLinkRegex = /https:\/\/x\.com\/.*/;
const igLinkRegex = /https:\/\/www\.instagram\.com\/.*/;
const BITLY_ACCESS_TOKEN = 'd65c244066aef6666e14fc1b1c4fde5b94b85dc6';

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
    const messageId = ctx.message.message_id;

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

// Deprecated
// bot.hears(igLinkRegex,(ctx) => {
//     const igLinkUser = ctx.message.text;
//     const igLinkFinal = igLinkUser.replace('https://www.instagram.com/', 'https://ddinstagram.com/')
//     const chatId = ctx.message.chat.id;
//     const messageId = ctx.message.message_id
//     const chatType = ctx.chat.type;
//     if (chatType === 'private') {
//         ctx.reply(igLinkFinal);
//     } else {
//         const userName = ctx.from.username;
//                 const nameToShow = userName ? `${userName}` : ctx.from.first_name;
//                     ctx.telegram.deleteMessage(chatId, messageId)
//                         .then(() => {
//                             ctx.reply(`Mensaje enviado por: ${nameToShow}\n ${igLinkFinal}`);
//                         })
//                         .catch((err) =>
//                             ctx.reply('Error al eliminar el mensaje.', err));
//     }
// });

// Función para acortar enlaces utilizando Bitly API
const shortenUrl = async (longUrl) => {
    const bitlyApiUrl = 'https://api-ssl.bitly.com/v4/shorten';

    try {
        const response = await axios.post(bitlyApiUrl, 
            {
                long_url: longUrl
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${BITLY_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.link;
    } catch (error) {
        console.error('Error al acortar el enlace:', error.response ? error.response.data : error.message);
        return longUrl;
    }
};

bot.hears(igLinkRegex, async (ctx) => {
    const igLinkUser = ctx.message.text;
    const linkApi =  `http://localhost:3000/api/video?postUrl=${igLinkUser}`;
    const chatId = ctx.message.chat.id;
    const messageId = ctx.message.message_id;
    const userName = ctx.from.username;
    const nameToShow = userName ? `${userName}` : ctx.from.first_name;
    
    try {
        const response = await axios.get(linkApi);
        const longUrl = response.data.data.videoUrl;

        // Acortar el enlace usando la función shortenUrl con Bitly
        const shortUrl = await shortenUrl(longUrl);

        ctx.telegram.deleteMessage(chatId, messageId);
        ctx.reply(`Mensaje enviado por: ${nameToShow} ` + shortUrl);

    } catch (error) {
        ctx.reply('No es un reel', error);
    }

});

async function getDolarBlue() {
    try {
        const response = await axios.get('https://api.bluelytics.com.ar/v2/latest');
        const blue = await response.data.blue.value_sell;
        return blue;
    } catch (error) {
        console.error('Error al obtener el valor', error)
        return null;
    }
}

const chatId = process.env.TELEGRAM_CHAT_ID;
const sendDolarBlue = async () => {
    const dolarBlue = await getDolarBlue();
    if (dolarBlue) {
        await bot.telegram.sendMessage(chatId, `El valor del Dolar Blue es: $${dolarBlue} 💵`);
    } else {
        await bot.telegram.sendMessage(chatId, ('No se pudo obtener el valor.'))
    }
};

sendDolarBlue();

bot.hears('.dolar', async (ctx) => {
    const dolarBlue = await getDolarBlue();
    if (dolarBlue) {
        ctx.reply(`El valor del Dolar Blue al momento es: $${dolarBlue} 💵`);
    } else {
        ctx.reply('No se pudo obtener el valor, asi que te devuelvo esto: 🖕');
    }
});

// Confirmacion de que el bot sigue hosteado
bot.hears('.status', (ctx) => ctx.reply('Sigo hosteado correctamente'));

bot.launch();
