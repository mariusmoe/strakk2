const User = require('../models/user'),
    multer = require('multer'),
    fs     = require('fs');

// File uploading setup
const DIR = '../uploads/';
const upload = multer({dest: DIR});
const type = upload.single('recfile')


//========================================
// User Routes
//========================================
// Return this user's model if authenticated
exports.viewProfile = function(req, res, next) {
  const userId = req.params.userId;

  if (!req.user._id == userId) { return res.status(401).json({ error: 'You are not authorized to view this user profile.'}); }
    User.findById(userId, function(err, user) {
      if (err) {
        res.status(400).json({ error: 'No user could be found for this ID.' });
        return next(err);
      }

      res.status(200).json({ user: user });
      return next();
    });
}
