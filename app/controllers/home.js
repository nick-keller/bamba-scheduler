var express = require('express'),
  router    = express.Router(),
  mongoose  = require('mongoose'),
  moment    = require('moment'),
  schedule  = require('node-schedule'),
  Client    = require('../services/client'),
  technos   = require('../models/technos.json'),
  buildings = require('../models/buildings.json'),
  ships     = require('../models/ships.json'),
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
      technos   : technos,
      ships     : ships
    });
  });
});

router.post('/add-task', function (req, res, next) {
  // console.log(req.body);
  var date  = moment(req.body.executionTime, "DD/MM/YYYY HH:mm"),
    options = {
      baseId   : req.body.baseId
    };

  switch (req.body.taskType) {
    case 'buildbuilding':
      options.building = req.body.building;
      break;
    case 'buildtechno':
      options.techno = req.body.techno;
      break;
    case 'buildship':
      options.ship     = req.body.ship;
      options.quantity = req.body.quantity;
      break;
    case 'loot':
      options.commanderId = req.body.commanderId;
      options.placeId     = req.body.placeId;
      break;
    default:
      // temporary error handling
      throw "Invalid task type";
  }

  console.log(req.body.taskType + ' ' + date.fromNow());

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
    // console.log(task);
    var j = schedule.scheduleJob(date.toDate(), function(id){
        console.log('Executing task ' + id);
        Client.executeTask(id);
    }.bind(null, task._id));
  });
  res.redirect('back');
});
