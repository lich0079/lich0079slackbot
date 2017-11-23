var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var RTM_MESSAGE_SUBTYPES = require('@slack/client').RTM_MESSAGE_SUBTYPES;
var MemoryDataStore = require('@slack/client').MemoryDataStore;

var bot_token = process.env.BOT_API_KEY || '';

var rtm = new RtmClient(bot_token, {
    logLevel: 'error', // check this out for more on logger: https://github.com/winstonjs/winston
    dataStore: new MemoryDataStore() // pass a new MemoryDataStore instance to cache information
  });

let generalChannel;
let testbotChannel;

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
  for (const c of rtmStartData.channels) {
      if (c.is_member && c.name ==='general') { generalChannel = c.id }
      if (c.is_member && c.name ==='testbot') { testbotChannel = c.id }
  }
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

// you need to wait for the client to fully connect before you can send messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
  rtm.sendMessage("power overwhelming", generalChannel);
});

rtm.on(RTM_EVENTS.MESSAGE, function(message){
    var self = rtm;

    if (message.type === 'channel_join' ||
    message.type === 'channel_join' ||
    message.type === 'member_joined_channel'
    ) {
        var msgStr = JSON.stringify(message);
        self.postMessageToUser('lich0079', msgStr);
    }


    console.log(
        'User %s posted a message in %s channel',
        rtm.dataStore.getUserById(message.user).name,
        rtm.dataStore.getChannelGroupOrDMById(message.channel).name
      );

    var str = 
        'User '+rtm.dataStore.getUserById(message.user).name+' posted a message in '+rtm.dataStore.getChannelGroupOrDMById(message.channel).name+' channel, '+ message.text;

    if (message.type === 'message') {
        var msgStr = JSON.stringify(message);
        rtm.sendMessage(msgStr, generalChannel);
        rtm.sendMessage(str, rtm.dataStore.getDMByName('lich0079').id);
    }

});

module.exports = rtm;