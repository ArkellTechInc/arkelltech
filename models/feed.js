var mongoose = require('mongoose');

var FeedSchema = new mongoose.Schema({
  feed: {
    type: String,
    required: true,
	'default': ['Home']
  },
  postedby: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  postedto: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  post: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
  }
});

var FeedPost = mongoose.model('FeedPost', FeedSchema);
module.exports = FeedPost;

