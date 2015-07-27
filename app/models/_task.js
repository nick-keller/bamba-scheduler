var mongoose = require('mongoose'),
  Schema     = mongoose.Schema;

var TaskSchema = new Schema({
  params: {
    type: [{
      name: String,
      value: String
    }]
  },
  referer: {
    type: String,
    default: 'http://game.asylamba.com/s7/bases/view-generator'
  },
  method : {
    type: String,
    default: 'get'
  },
  post_data: Schema.Types.Mixed,
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
