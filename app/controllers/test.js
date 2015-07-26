var express = require('express');
var router  = express.Router();
var Client  = require('../models/client');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/connect', function (req, res, next) {
  // Client.getToken(function() {
  //   Client.buildAction({
  //     baseid   : '16309',
  //     building : '5'
  //   });
  // });
  return res.json({
    message: "Coucou"
  })
});
