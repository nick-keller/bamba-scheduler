var express = require('express'),
  router    = express.Router(),
  mongoose  = require('mongoose'),
  Task      = mongoose.model('Task');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  Task.find(function (err, tasks) {
    if (err) return next(err);
    res.render('index', {
      title: 'Planificateur bamba',
      tasks: tasks
    });
  });
});
