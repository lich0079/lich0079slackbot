'use strict';

var SlackBot = require('slackbots');

var lich0079Bot = function Constructor(settings) {
    this.settings = settings;
};

lich0079Bot.prototype.run = function () {

    var bot = new SlackBot(this.settings);

    // this.on('start', this._onStart);
    bot.on('message', function(message){
        var self = bot;

        if (message.type === 'channel_join' ||
        message.type === 'channel_join' ||
        message.type === 'member_joined_channel'
        ) {
            var msgStr = JSON.stringify(message);
            self.postMessageToUser('lich0079', msgStr);
        }


        if (message.type === 'message') {
            var msgStr = JSON.stringify(message);
            self.postMessageToChannel('testbot', msgStr);
        }

    });


    bot.on('start', function(){
        var self = bot;
        self.postMessageToChannel('testbot', 'bot online 222');
        // self.postMessageToChannel('testbot', self.getChannel('D855Q4HQX'));
        self.postMessageToChannel('testbot', self.getChannel('testbot'));
        console.log(self.getChannel('testbot'));
        console.log(self.getChannel('D855Q4HQX'));
    });
};

module.exports = lich0079Bot;