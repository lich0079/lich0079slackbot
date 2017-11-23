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
      console.log(c.name);
      if (c.is_member && c.name ==='general') { generalChannel = c.id }
      if (c.name ==='testbot') { testbotChannel = c.id }
  }
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

// you need to wait for the client to fully connect before you can send messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function () {
  rtm.sendMessage("power overwhelming", generalChannel);
});

rtm.on(RTM_EVENTS.MESSAGE, function(message){
    var self = rtm;

    if (message.subtype === 'channel_join' ||
    message.subtype === 'channel_join' ||
    message.subtype === 'member_joined_channel'
    ) {
        var msgStr = JSON.stringify(message);
        rtm.sendMessage(msgStr, rtm.dataStore.getDMByName('lich0079').id);
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
        // rtm.sendMessage(msgStr, rtm.dataStore.getChannelByName('general').id);
        rtm.sendMessage(str, rtm.dataStore.getDMByName('lich0079').id);
    }

});

module.exports = rtm;



// var WebClient = require('@slack/client').WebClient;

// var token = process.env.BOT_API_KEY || '';
// var web = new WebClient(token);

// web.chat.postMessage('testbot', 'Hello there', function(err, res) {
//     if (err) {
//       console.log('Error:', err);
//     } else {
//       console.log('Message sent: ', res);
//     }
//   });