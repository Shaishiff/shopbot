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

// User wants to show cart.
controller.hears(["show cart"], 'message_received', function(bot, message) {
  Utils.showUserCart(bot, message);
});

// User wants to clear cart.
controller.hears(["clear cart"], 'message_received', function(bot, message) {
  Utils.clearUserCart(bot, message);
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
    console.log("Post back for showing products for category " + category_id);
    Utils.showProductsToUser(bot, message, category_id);
  } else if (message.payload.indexOf('add_prod_to_cart_') === 0) {
    var add_to_cart = message.payload.replace("add_prod_to_cart_","");
    console.log("Post back for add to cart " + add_to_cart);
    var prod_id = add_to_cart.split("@")[0];
    var prod_name = add_to_cart.split("@")[1];
    var prod_price = add_to_cart.split("@")[2];
    Utils.addToUserCart(message.user, prod_id, prod_name, prod_price, function(){
      bot.reply(message, prod_name + " was added to your cart.\nYou can write:\n\"Show cart\" - to see what you currently have in your cart.\n\"Clear cart\" - to clear it.");
    });
  }
});
