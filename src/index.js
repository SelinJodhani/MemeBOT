const { Telegraf } = require('telegraf');
const scrapeImages = require('./scrapeImages.js');

const token = process.env.BOT_TOKEN;

if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(token);

bot.on('inline_query', async ctx => {
  const data = await scrapeImages(ctx.inlineQuery.query);
  const results = data.slice(0, 10); // TODO: pagination

  const ourReturn = ctx.answerInlineQuery(results);

  return ourReturn;
});

bot
  .on('chosen_inline_result', ({ chosenInlineResult }) => {
    console.log('chosen inline result', chosenInlineResult);
  })
  .catch(err => {
    console.error(err);
  });

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
