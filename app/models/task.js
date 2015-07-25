var mongoose = require('mongoose'),
  Schema     = mongoose.Schema;

var TaskSchema = new Schema({
  type          : String,
  target        : String,
  executionTime : Date,
  repeat        : Boolean,
  repeated      : Number
});

TaskSchema.virtual('createdAt')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Task', TaskSchema);
