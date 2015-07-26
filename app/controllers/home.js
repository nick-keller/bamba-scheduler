var express = require('express'),
  router    = express.Router(),
  mongoose  = require('mongoose'),
  moment    = require('moment'),
  schedule  = require('node-schedule'),
  Client    = require('../models/client'),
  Task      = mongoose.model('Task');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  Task.find(function (err, tasks) {
    if (err) return next(err);
    res.render('index', {
      title: 'Planificateur bamba',
      tasks: tasks,
      buildings: {
        0: "Générateur",
        1: "Raffinerie",
        2: "Chantier Alpha",
        5: "Technosphère",
        6: "Plateforme Commerciale",
        8: "Centre de Recyclage",
        7: "Stockage",
        9: "Spatioport",
        3: "Chantier de Ligne"
      }
    });
  });
});

router.post('/add-task', function (req, res, next) {
  console.log(req.body);
  var date = moment(req.body.executionTime, "DD/MM/YYYY HH:mm");
  console.log(date.toDate());
  console.log(date.fromNow());
  var task = new Task({
    type          : req.body.taskType,
    executionTime : date.toDate(),
    repeat        : false,
    repeated      : 0,
    options       : {
      baseId   : req.body.baseId,
      building : req.body.building
    }
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
