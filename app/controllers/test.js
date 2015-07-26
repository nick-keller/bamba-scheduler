var express = require('express');
var router  = express.Router();
var Client  = require('../models/client');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/connect', function (req, res, next) {
  Client.connect();
  return res.json({
    message: "Coucou"
  })
});
