var request         = require('request');
var mongoose        = require('mongoose');
var FileCookieStore = require('tough-cookie-filestore');
var path            = require('path');
var rootPath        = path.normalize(__dirname + '/../..');
var loginConfig     = require(rootPath + '/config/login.json');
var j               = request.jar(new FileCookieStore(rootPath + '/config/cookies.json'));
var request         = request.defaults({jar:j});
var Task            = mongoose.model('Task');

var Client = {
  token : '',
  login : function(callback) {
    request.post({
      url  : 'http://asylamba.com/action/a-connect',
      form : {
        'data-browser'   : loginConfig['data-browser'],
        'email'          : loginConfig.email,
        'password'       : loginConfig.password,
        'stay-connected' : 'on'
      },
      headers: {
        'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/43.0.2357.130 Chrome/43.0.2357.130 Safari/537.36',
        'Origin'     :'http://asylamba.com',
        'Referer'    :'http://asylamba.com/connexion'
      }
    }, function(err, httpResponse, body){
      // console.log(err);
      // console.log(httpResponse.statusCode);
      // console.log(httpResponse.statusMessage);
      // console.log(body);
      Client.connect(callback);
    });
  },
  connect: function(callback) {
    request.get({
      url     : 'http://asylamba.com/action/a-serverconnection/server-7?',
      headers : {
        'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/43.0.2357.130 Chrome/43.0.2357.130 Safari/537.36',
        'Origin'     :'http://asylamba.com',
        'Referer'    :'http://asylamba.com/serveurs'
      }
    }, function(err, httpResponse, body){
      // console.log(err);
      // console.log(httpResponse.statusCode);
      // console.log(httpResponse.statusMessage);
      var token = body.match(/Changer de bases<\/h2><div class="overflow"><a href="[^"]+token-(.*?)" class="active"><em>Colonie<\/em>/i);
      console.log(token[1]);
      Client.token = token[1];
      if (typeof callback === "function") {
        callback();
      }
    });
  },
  // getToken: function(callback) {
  //   request.get({
  //     url     : 'http://game.asylamba.com/s7/bases/view-generator',
  //     headers : {
  //       'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/43.0.2357.130 Chrome/43.0.2357.130 Safari/537.36',
  //       'Host'       :'game.asylamba.com',
  //       'Referer'    :'http://game.asylamba.com/s7/profil'
  //     }
  //   }, function(err, httpResponse, body){
  //     console.log(err);
  //     console.log(httpResponse.statusCode);
  //     console.log(httpResponse.statusMessage);
  //     console.log(body);
  //     var token = body.match(/Changer de bases<\/h2><div class="overflow"><a href="[^"]+token-(.*?)" class="active"><em>Colonie<\/em>/i);
  //     console.log(token);
  //     Client.token = token[1];
  //     if (typeof callback === "function") {
  //       callback();
  //     }
  //   });
  // },
  buildAction: function(options, callback) {
    request.get({
      url     : 'http://game.asylamba.com/s7/action/a-buildbuilding/baseid-' + options.baseId + '/building-' + options.building + '/token-' + Client.token + '/sftr-1',
      headers : {
        'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/43.0.2357.130 Chrome/43.0.2357.130 Safari/537.36',
        'Host'       :'game.asylamba.com',
        'Referer'    :'http://game.asylamba.com/s7/bases/view-generator'
      }
    }, function(err, httpResponse, body){
      // console.log(err);
      // console.log(httpResponse);
      var response = body.match(/<ul id="alert-content"><li data-type="\d+">(.*?)<\/li><\/ul>/i);
      if (null === response) {
        console.log("login failed");
        Client.connect(function() {
          Client.buildAction(options, callback);
        });
      } else {
        console.log("login successful");
        console.log(response[1]);
        if (typeof callback === "function") {
          callback(response[1]);
        }
      }
    });
  },
  buildShipAction: function(options, callback) {
    request.get({
      url     : 'http://game.asylamba.com/s7/action/a-buildship/baseid-' + options.baseId + '/ship-' + options.ship + '/quantity-' + options.quantity + '/token-' + Client.token + '/sftr-1',
      headers : {
        'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/43.0.2357.130 Chrome/43.0.2357.130 Safari/537.36',
        'Host'       :'game.asylamba.com',
        'Referer'    :'http://game.asylamba.com/s7/bases/view-dock1'
      }
    }, function(err, httpResponse, body){
      // console.log(err);
      // console.log(httpResponse.statusCode);
      // console.log(httpResponse.statusMessage);
      var response = body.match(/<ul id="alert-content"><li data-type="\d+">(.*?)<\/li><\/ul>/i);
      if (null === response) {
        console.log("login failed");
        Client.connect(function() {
          Client.buildShipAction(options, callback);
        });
      } else {
        console.log("login successful");
        console.log(response[1]);
        if (typeof callback === "function") {
          callback(response[1]);
        }
      }
    });
  },
  lootAction: function(options, callback) {
    request.get({
      url     : 'http://game.asylamba.com/s7/action/a-loot/commanderid-' + options.commanderId + '/placeid-' + options.placeId + '/token-' + Client.token,
      headers : {
        'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/43.0.2357.130 Chrome/43.0.2357.130 Safari/537.36',
        'Host'       :'game.asylamba.com',
        'Referer'    :'http://game.asylamba.com/s7/map'
      }
    }, function(err, httpResponse, body){
      // console.log(err);
      // console.log(httpResponse.statusCode);
      // console.log(httpResponse);
      var response = body.match(/<ul id="alert-content"><li data-type="\d+">(.*?)<\/li><\/ul>/i);
      if (null === response) {
        console.log("login failed");
        Client.connect(function() {
          Client.lootAction(options, callback);
        });
      } else {
        console.log("login successful");
        console.log(response[1]);
        if (typeof callback === "function") {
          callback(response[1]);
        }
      }
    });
  },
  searchAction: function(options, callback) {
    request.get({
      url     : 'http://game.asylamba.com/s7/action/a-buildtechno/baseid-' + options.baseId + '/techno-' + options.techno + '/token-' + Client.token + '/sftr-1',
      headers : {
        'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/43.0.2357.130 Chrome/43.0.2357.130 Safari/537.36',
        'Host'       :'game.asylamba.com',
        'Referer'    :'http://game.asylamba.com/s7/bases/view-generator'
      }
    }, function(err, httpResponse, body){
      // console.log(err);
      // console.log(httpResponse.statusCode);
      // console.log(httpResponse.statusMessage);
      var response = body.match(/<ul id="alert-content"><li data-type="\d+">(.*?)<\/li><\/ul>/i);
      if (null === response) {
        console.log("login failed");
        Client.connect(function() {
          Client.searchAction(options, callback);
        });
      } else {
        console.log("login successful");
        console.log(response[1]);
        if (typeof callback === "function") {
          callback(response[1]);
        }
      }
    });
  },
  executeTask: function(taskId) {
    console.log('Task received ' + taskId);
    Task.findOne(taskId, function(err, task) {
      if (err)
        throw err;
      console.log(task);
      console.log(task.type);
      Client.login(function() {
        var callback = function(response) {
          console.log("Task executed completly");
          task.repeated++;
          task.responses.push(response);
          task.save(function (err) {
            if (err)
              throw err;
          });
        };
        switch (task.type) {
          case "buildbuilding":
            console.log("Building task");
            Client.buildAction(task.options, callback);
            break;
          case "buildtechno":
            console.log("Searching task");
            Client.searchAction(task.options, callback);
            break;
          case "buildship":
            console.log("Ship Building task");
            Client.buildShipAction(task.options, callback);
            break;
          case "loot":
            console.log("Looting task");
            Client.lootAction(task.options, callback);
            break;
        }
      });
    });
  }
};

module.exports = Client;
