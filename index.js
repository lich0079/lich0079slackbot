'use strict';

var lich0079bot = require('./lich0079bot');
var rtm = require('./slacksdkbot');

var token = process.env.BOT_API_KEY;

// var bot = new lich0079bot({
//     token: token,
//     name: 'lich0079 xxx bot'
// });

// bot.run();

rtm.start();