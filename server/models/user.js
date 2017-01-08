// Importing Node packages required for schema
const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require('bcrypt-nodejs'),
      validator = require('validator');

//================================
// User Schema
//================================
const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    // Validate the email. If the email is not a true email saving the user WILL
    // provoke an error.
    validate: [ validator.isEmail, 'invalid email' ]
  },
  password: {
    // The password are not stored in clear text. It is hashed and salted.
    type: String,
    required: true
  },
  profile: {
    firstName: { type: String },
    lastName: { type: String }
  },
  role: {
    // Decide which user priveleges the user is granted
    type: String,
    enum: ['Member', 'Admin'],
    default: 'Member'
  },
  active: {
    // Verified by email
    type: Boolean,
    default: false
  },
  recentlyViewed: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  confirmation_string: { type: String, required: true },
  confirmation_issued: {type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
},
{
  timestamps: true
});

//================================
// User ORM Methods
//================================

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function(next) {
  const user = this,
        SALT_FACTOR = 10;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
}

module.exports = mongoose.model('User', UserSchema);
