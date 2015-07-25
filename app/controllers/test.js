var express         = require('express');
var router          = express.Router();
var mongoose        = require('mongoose');
var request         = require('request');
var ask             = mongoose.model('Task');
var FileCookieStore = require('tough-cookie-filestore');
var path            = require('path');
var rootPath        = path.normalize(__dirname + '/../..');
var loginConfig     = require(rootPath + '/config/login.json');
var j               = request.jar(new FileCookieStore(rootPath + '/config/cookies.json'));
var request         = request.defaults({jar:j});

module.exports = function (app) {
  app.use('/', router);
};

router.get('/connect', function (req, res, next) {
  request.post({
    url  :'http://asylamba.com/action/a-connect',
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
    console.log(err);
    console.log(httpResponse);
    console.log(body);
    request.get({
      url     :'http://asylamba.com/action/a-serverconnection/server-7?',
      headers : {
        'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/43.0.2357.130 Chrome/43.0.2357.130 Safari/537.36',
        'Origin'     :'http://asylamba.com',
        'Referer'    :'http://asylamba.com/connexion'
      }
    }, function(err, httpResponse, body){
      console.log(err);
      console.log(httpResponse);
    })
  });
  return res.json({
    message: "Coucou"
  })
});