"use strict";

var request = require('request');
var Consts = require('./consts');
var Sentences = require('./sentences');
var Api = require('./mockApi');
var MongoClient = require('mongodb').MongoClient;
var DateFormat = require('dateformat');

function insertUserInfoToMongo(userInfo, callback) {
  console.log("insertUserInfoToMongo: " + Consts.MONGODB_URL);
  MongoClient.connect(Consts.MONGODB_URL, function(err, db) {
    console.log("Connected correctly to server: " + err);
    var col = db.collection(Consts.MONGODB_USER_INFO_COL);
    console.log("found the collection");
    col.insertOne(userInfo, function(err, r) {
      console.log("insert complete: " + err);
      db.close();
      console.log("db closed");
      callback();
    });
  });
}

function getUserInfoFromMongo(userId, callback) {
  console.log("getUserInfoFromMongo");
  MongoClient.connect(Consts.MONGODB_URL, function(err, db) {
    console.log("Connected correctly to server: " + err);
    var col = db.collection(Consts.MONGODB_USER_INFO_COL);
    console.log("found the collection: " + err);
    col.find({user_id : userId}).limit(1).toArray(function(err, docs) {
      db.close();
      if (docs instanceof Array && docs.length == 1) {
        console.log("Found the user in the mongo: " + docs[0]);
        callback(docs[0]);
      } else {
        callback();
      }
    });
  });
}

function sendToAnalyticsInternal(sender, text, direction) {
  console.log("sendToAnalyticsInternal from sender " + sender + " with text: " + text);
  request({
      url: Consts.ANALYTICS_API,
      qs: {
        token: process.env.ANALYTICS_TOKEN
      },
      method: 'POST',
      json: {
        message: {
          text: text,
          message_type: direction,
          user_id: sender,
          conversation_id: sender + "-" + DateFormat(new Date(), "dd_mm_yy")
        }
      }
    },
    function(error, response, body) {
      if (error) {
        console.log('Error sending message to analytics: ', error);
      } else if (response.body.error) {
        console.log('Error in body response when sending message to analytics: ', response.body.error);
      }
    });
}

function sendWelcomeMessage() {
  request({
    url: Consts.FACEBOOK_WELCOME_MSG_URL,
    method: 'POST',
    json: {
      setting_type: "call_to_actions",
      thread_state: "new_thread",
      call_to_actions: [{
        message: {
          text: Sentences.page_welcome_msg
        }
      }]
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending welcome message: ', error);
    } else if (response.body.error) {
      console.log('Error in response body when sending welcome message: ', response.body.error);
    }
  });
}

function getProductArrayByCategoryId(api_data, category_id) {
  for (var i = 0; i < api_data.length; i++) {
    var curI = api_data[i];
    if(curI.id === category_id) return curI.products;
  }
  return null;
}

function getProductArrayByCategoryName(api_data, category_name) {
  for (var i = 0; i < api_data.length; i++) {
    var curI = api_data[i];
    if(curI.name === category_name) return curI.products;
  }
  return null;
}

function buildCategoriesElements(api_data) {
  var elements = [];
  for (var i = 0; i < api_data.length; i++) {
    var curI = api_data[i];
    curElement.title = curI.name;
    curElement.image_url = curI.image_url;
    curElement.subtitle = "" + curI.products.length + " products";
    curElement.buttons = [{
      type: 'web_url',
      title: 'Shop Online',
      url: curI.url
    },
    {
      type: 'postback',
      title: 'Show Products',
      payload: 'show_prods_for_' + curI.id
    }];
    elements[i] = curElement;
  }
  return elements;
}

function buildProductsElements(api_data) {
  var elements = [];
  for (var i = 0; i < api_data.length; i++) {
    var curI = api_data[i];
    curElement.title = curI.name;
    curElement.image_url = curI.image_url;
    curElement.subtitle = "$" + curI.price;
    curElement.buttons = [{
      type: 'web_url',
      title: 'Shop Online',
      url: curI.url
    },
    {
      type: 'postback',
      title: 'Add To Cart',
      payload: 'add_prod_to_cart' + curI.id
    }];
    elements[i] = curElement;
  }
  return elements;
}

function sendMultipleAttachmentsOneByOne(bot, message, arr, index) {
  if (typeof index !== "number") index = 0;
  if (index >= arr.length) return;
  console.log("Showing index " + index);
  bot.reply(message, {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: arr[index]
        }
      }
    },
    function() {
      var newIndex = index + 1;
      sendMultipleAttachmentsOneByOne(bot, message, arr, newIndex);
    });
}

function httpGetJson(url, callback) {
  request({
    url: url,
    method: 'GET'
  }, function(error, response, body) {
    if (error) {
      console.error('Error http get ' + url, error);
    } else if (response.body.error) {
      console.error('Error in response body for http get ' + url, response.body.error);
    } else {
      try {
        console.log(response.body);
        var jsonResponse = JSON.parse(response.body);
        callback(jsonResponse);
        return;
      } catch (e) {
        console.error('Error parsing json response from http get ' + url);
      }
    }
    callback();
  });
}

function getUserInfoInternal(userId, callback) {
  getUserInfoFromMongo(userId, function(userInfo) {
    if (typeof userInfo !== "undefined") {
      console.log("Got the user info from mongoDB");
      callback(userInfo);
    } else {
      console.log("Can't find the user info in the mongoDB");
      httpGetJson(Consts.FACEBOOK_USER_PROFILE_API.replace("<USER_ID>", userId), function(userInfo) {
        userInfo.user_id = userId;
        insertUserInfoToMongo(userInfo, callback);
      });
    }
  });
}

function notSureWhatUserWantsInternal(bot, message) {
  console.log("No idea what the user wants...");
  bot.reply(message, Utils.randomFromArray(Sentences.bot_not_sure_what_user_means));
  sendToAnalyticsInternal("unknown_msgs", message.text, "incoming");
}

var utils = {
  setWelcomeMessage: function() {
    sendWelcomeMessage();
  },
  randomFromArray: function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },
  sendUserMsgToAnalytics: function(sender, text) {
    sendToAnalyticsInternal(sender, text, "incoming");
  },
  sendBotMsgToAnalytics: function(sender, text) {
    sendToAnalyticsInternal(sender, text, "outgoing");
  },
  showCategoriesToUser: function(bot, message) {
    Api.getProducts(function(data) {
      sendMultipleAttachmentsOneByOne(bot,
        message,
        [buildCategoriesElements(data)]);
    });
  },
  showProductsToUser: function(bot, message, category_id) {
    Api.getProducts(function(data) {
      sendMultipleAttachmentsOneByOne(bot,
        message,
        [buildProductsElements(getProductArrayByCategoryId(data))]);
    });
  },
  getUserInfo: function(userId, callback) {
    getUserInfoInternal(userId, callback);
  },
  notSureWhatUserWants: function(bot, message) {
    notSureWhatUserWantsInternal(bot, message);
  }
}

module.exports = utils;