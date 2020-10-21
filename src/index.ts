import express from 'express';
import { WebClient } from '@slack/web-api';
import { createEventAdapter } from '@slack/events-api';
import { createServer } from 'http';
import * as _ from 'lodash';

require('dotenv').config();

const app = express();
const slackEvents = createEventAdapter(process.env.SIGNING_SECRET);
const webClient = new WebClient(process.env.BOT_USER_OAUTH_ACCESS_TOKEN);

const UNDEFINED_STR: string = '후보 없음';

slackEvents.on('message', async (event: any) => {
  const prefix: string = event.text.substring(0, 4);
  const args: string = event.text.substring(4);

  if (prefix === '!랜덤 ' && 0 < args.length) {
    const candidates: Array<string> = args.split(',');
    const shuffled: Array<string> = _.shuffle(candidates);

    const result: string = `:tada::tada: *당첨: ${shuffled[0]}* / 하마터면 당첨될 뻔: ${1 < shuffled.length ? shuffled[1] : UNDEFINED_STR}`;
    webClient.chat.postMessage({
      text: result,
      channel: event.channel,
    });
  }
});

app.use('/slack/dablerandom', slackEvents.requestListener());

createServer(app).listen(3000, () => {
  console.log('run random bot');
});