var express = require('express'),
  router    = express.Router(),
  mongoose  = require('mongoose'),
  moment    = require('moment'),
  schedule  = require('node-schedule'),
  Client    = require('../models/client'),
  technos   = require('../models/technos.json'),
  buildings = require('../models/buildings.json'),
  Task      = mongoose.model('Task');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  Task.find({$query: {}, $orderby: {executionTime : -1}}, function (err, tasks) {
    if (err) return next(err);
    res.render('index', {
      title     : 'Planificateur bamba',
      tasks     : tasks,
      buildings : buildings,
      technos   : technos
    });
  });
});

router.post('/add-task', function (req, res, next) {
  console.log(req.body);
  var date = moment(req.body.executionTime, "DD/MM/YYYY HH:mm"),
    options = {};
  console.log(date.toDate());
  console.log(date.fromNow());

  switch (req.body.taskType) {
    case 'buildbuilding':
      options = {
        baseId   : req.body.baseId,
        building : req.body.building
      };
      break;
    case 'buildtechno':
      options = {
        baseId : req.body.baseId,
        techno : req.body.techno
      };
      break;
    default:
      // temporary error handling
      throw "Invalid task type";
  }

  var task = new Task({
    type          : req.body.taskType,
    executionTime : date.toDate(),
    repeat        : false,
    repeated      : 0,
    options       : options
  });

  task.save(function (err, task) {
    if (err)
      throw err;
    console.log(task);
    var j = schedule.scheduleJob(date.toDate(), function(id){
        console.log('Executing task ' + id);
        Client.executeTask(id);
    }.bind(null, task._id));
  });
  res.redirect('/');
});
