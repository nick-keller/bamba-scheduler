var mongoose = require('mongoose'),
  Schema     = mongoose.Schema;

var TaskSchema = new Schema({
  type          : String,
  options       : Schema.Types.Mixed,
  executionTime : Date,
  repeat        : Boolean,
  repeated      : Number,
  responses     : [String]
});

TaskSchema.virtual('createdAt')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Task', TaskSchema);
