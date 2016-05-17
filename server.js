"use strict";

var Botkit = require('botkit');
var Sentences = require('./sentences');
var Api = require('./mockApi');
var Utils = require('./utils');
var DateFormat = require('dateformat');

var controller = Botkit.facebookbot({
  access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
  verify_token: process.env.FACEBOOK_VERIFY_TOKEN
})

var bot = controller.spawn({});

// Set up the welcome message.
if (process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
  Utils.setWelcomeMessage();
}

// Start web server.
var webServerPort = process.env.PORT || 8080;
controller.setupWebserver(webServerPort, function(err, webserver) {
  controller.createWebhookEndpoints(controller.webserver, bot, function() {
  });
});

// Log the message and add more info to the message.
controller.middleware.receive.use(function(bot, message, next) {
  Utils.getUserInfo(message.user, function(userInfo) {
    if (userInfo) {
      message.userInfo = userInfo;
      message.userFullName = userInfo.first_name + " " + userInfo.last_name;
      message.fullNameWithId = userInfo.first_name + "_" + userInfo.last_name + "_" + message.user;
    } else {
      message.userFullName = "";
      message.fullNameWithId = message.user;
    }
    Utils.sendUserMsgToAnalytics(message.fullNameWithId, message.text);
    next();
  });
});

controller.middleware.send.use(function(bot, message, next) {
  console.log(JSON.stringify(message));
  Utils.getUserInfo(message.channel, function(userInfo) {
    if (userInfo) {
      message.userInfo = userInfo;
      message.fullNameWithId = userInfo.first_name + "_" + userInfo.last_name + "_" + message.channel;
    } else {
      message.fullNameWithId = message.channel;
    }
    Utils.sendBotMsgToAnalytics(message.fullNameWithId, message.text || "-empty-");
    next();
  });
});

// User clicked the send-to-messenger plugin.
controller.on('facebook_optin', function(bot, message) {
  bot.reply(message, 'Hey, welcome !');
});

// User said hello.
controller.hears(Sentences.user_welcoming_messages, 'message_received', function(bot, message) {
  bot.reply(message, Utils.randomFromArray(Sentences.bot_welcoming_messages) + " " + message.userFullName);
});

// User said thanks.
controller.hears(Sentences.user_says_thanks, 'message_received', function(bot, message) {
  bot.reply(message, Utils.randomFromArray(Sentences.bot_says_you_are_welcome));
});

// User wants to buy.
controller.hears(Sentences.user_wants_to_buy, 'message_received', function(bot, message) {
  Utils.showCategoriesToUser(bot, message);
});

// Not suer what the users wants. Final fallback.
controller.on('message_received', function(bot, message) {
  Utils.notSureWhatUserWants(bot, message);
  return false;
});

// Facebook postsbacks.
controller.on('facebook_postback', function(bot, message) {
  Utils.sendUserMsgToAnalytics(message.user, "facebook_postback-" + message.payload);
  if (message.payload.indexOf('show_prods_for_') === 0) {
    var category_id = message.payload.replace("show_prods_for_","");
    Utils.showProductsToUser(bot, message, category_id);
  }
});
