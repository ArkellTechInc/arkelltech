var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  feedtabs: {
	type: Array,
	validate: [arrayLimit, '{PATH} too many tabs']
  },
  jobtitle: {
    type: String,
    trim: true,
	'default': "member"
  },
  profilestatus: {
    type: String,
    trim: true,
	'default': "just registered"
  },
  latestpost: {
    type: String,
    trim: true,
	'default': "N/A"
  },
  status: {
    type: String,
	enum: ["workin'", "mossin'"],
    trim: true,
	'default': "workin'",
  },
  profilepic: {
    type: String,
    trim: true,
	'default': "images/nopic.jpg"
  },
  inboxcount: {
    type: Number,
	'default': 1
  },
  postcount: {
    type: Number,
	'default': 1
  }
  
});

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});
function arrayLimit(val) {
  return val.length <= 7;
}


var User = mongoose.model('User', UserSchema);
module.exports = User;

