var express = require('express');
var router = express.Router();
var User = require('../models/user');
var FeedPost = require('../models/feed');

// GET route for reading data
router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'arkell tech inc'
	});
});

//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.firstname &&
	req.body.lastname &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      firstname: req.body.firstname,
	  lastname: req.body.lastname,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET route after registering
router.get('/profile', function (req, res, next) {
	User.count({}, function( error, count){
		User.findById(req.session.userId).exec(function (error, user) {
		if (error) {
			return next(error);
		} else {
			User.findById(req.session.userId).exec(function (error, user) {
				if (error) {
					return next(error);
			} else {
				if (user === null) {
					var err = new Error('Not authorized! Go back!');
					err.status = 400;
					return next(err);
				} else {
					//page succussfully loaded here
					req.session.activeFeed = user.feedtabs[0];
					FeedPost.find({'postedto':user._id}, function (error, feed) {
						feed.reverse();
						res.render('profile', {
							title: 'arkell tech',
							firstname: user.firstname,
							lastname: user.lastname,
							jobtitle: user.jobtitle,
							latestpost: user.latestpost,
							status: user.status,
							inboxcount: user.inboxcount,
							feed: feed,
							feedtabs: user.feedtabs,
							profilepic: user.profilepic,
							profilestatus: user.profilestatus,
							totalmembers: count
							});
						});
					}
				}
			});
			}
		});
	});
});
router.post('/profile', function(req,res, next){
	if (req.body.post){
		var postData = {
		  feed: req.session.activeFeed,
		  postedby: req.session.userId,
		  postedto: req.session.userId,
		  post: req.body.post,
		  date: new Date()
		}
		FeedPost.create(postData, function (error, post) {
			if (error) {
				return next(error);
			} else {
				return res.redirect('/postedToFeed');
			}
		});
	} else if(req.body.newtab) {
		User.count({}, function( error, count){
			User.findById(req.session.userId).exec(function (error, user) {
			if (error) {
				return next(error);
			} else {
				user.feedtabs.push(req.body.newtab);
				user.save();
				return res.redirect('/postedToFeed');
			}
			});
		});
	} else {
		var err = new Error('All fields required.');
		err.status = 400;
		return next(err);
	}
});
router.get('/postedToFeed', function(req,res){
	res.redirect('/profile');
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;