"use strict";

// TODO: change confirm_email_link

const jwt = require('jsonwebtoken'),
      crypto = require('crypto'),
      User = require('../models/user'),
      config = require('../libs/config'),
      randomstring = require("randomstring"),
      status = require('../status'),
      // confirm_email_link = 'http://it2810-02.idi.ntnu.no:2000/api/auth/confirm_account/';
      confirm_email_link = 'http://localhost:2000/api/auth/confirm_account/';  // NEED to be changed in production

// var helper = require('sendgrid').mail;
var sg = require('sendgrid')(config.sendgridAPI);


// Generate JWT
// TO-DO Add issuer and audience
function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // in seconds
  });
}

// Set user info from request
function setUserInfo(request) {
  let getUserInfo = {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    email: request.email,
    role: request.role
  };

  return getUserInfo;
}

//========================================
// Login Route
//========================================
exports.login = function(req, res, next) {
  // console.log(req);
  // console.log("ERROR")

  let userInfo = setUserInfo(req.user);

  res.status(200).json({
    token: 'JWT ' + generateToken(userInfo),
    user: userInfo
  });
}


//========================================
// Registration Route
//========================================
// Register a new user
exports.register = function(req, res, next) {
  // Check for registration errors
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const confirmation_issued = new Date();

  // Return error if no email provided
  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.'});
  }
  // Return error if full name not provided
  if (!firstName || !lastName) {
    return res.status(422).send({ error: 'You must enter your full name.'});
  }
  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }
  User.findOne({ email: email }, function(err, existingUser) {
      if (err) { return next(err); }

      // If user is not unique, return error
      if (existingUser) {
        return res.status(422).send({ error: 'That email address is already in use.' });
      }

      let randomConfirmationString = randomstring.generate(40);
      // If email is unique and password was provided, create account
      let user = new User({
        email: email,
        password: password,
        profile: { firstName: firstName, lastName: lastName },
        confirmation_string: randomConfirmationString,
        confirmation_issued: confirmation_issued
      });
      // ----------------------------------------------
      //              Start of email
      // ----------------------------------------------
      let subj = 'Activate your account';
      let confirm_link_with_random_string = confirm_email_link +
                                            randomConfirmationString;
      // set template variables
      let templateVariables = {
            "-name-": firstName,
            "-link-": confirm_link_with_random_string
          }

      // compose the custom parts in the email
      const email_to_send = {
        from: { email: 'postmaster@moe.com' },
        personalizations: [
           {
             to: [
               {
                 email: email,
               }
             ],
             subject: subj,
             substitutions: templateVariables,
          },
        ],
        content:
         [ { type: 'text/plain', value: 'it2810 Gruppe 2' },
           { type: 'text/html', value: 'it2810 Gruppe 2' } ],
        template_id: 'ccbc2797-b482-4b2f-8b95-bbf739c31512'
      }

      var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: email_to_send
      });

      // Send the email with sendgrid.
      sg.API(request, function(error, response) {
        if (error){
          // console.log("Mail server responded with: " + response.statusCode);
          // console.log(response.body);
          // console.log(response.headers);
          // console.log(error);
          return res.status(400).send({message: 'Something is wrong with the email! ' + error, status: 400})
        }
        if (response.statusCode == 202){
            // console.log("Mail server OK: " + response.statusCode)
        }
        else{
          // console.log("Mail server responded with: " + response.statusCode);
          // console.log(response.body);
          // console.log(response.headers);
          return res.status(409).send({message: 'Something might have gone wrong!', status: 409})
        }
      });

      // *********************************************
      //              End of email
      // *********************************************

      // Save the user
      user.save(function(err, user) {
        if (err) { return next(err); }
        // TODO: Dont send this if the email fails
        res.status(200).send({ message: 'Account created', status: 200 });
      });
  });
}

//========================================
// Confirm email route
//========================================
// Confirm the account taht have the link that was clicked.
exports.confirmAccount = function(req, res, next) {
  let confirm_string = req.params.confirmation_string;

  User.findOne({confirmation_string: confirm_string}, (err, user) => {
    if(!user){
      return res.status(400).send({message: status.USER_NOT_FOUND.message, status: status.USER_NOT_FOUND.code})
    }
    if (user.active){
      return res.status(400).send({message: status.EMAIL_ALREADY_CONFIRMED.message, status: status.EMAIL_ALREADY_CONFIRMED.code})
    }
    let date_in_one_hour = new Date( user.confirmation_issued.getTime() + (1*60*60*1000));

    let date_now = new Date();
    if ((date_in_one_hour.getTime()/1000) < (date_now.getTime()/1000)){
      return res.status(400).send({message: 'Activation code has expired. Get a new one!', status: 9999})
    }
    user.active = true;
    user.save(function(err){
      if(err){
        throw err;
      }
      return res.status(200).send({message: status.EMAIL_SUCCESSFULLY_CONFIRMED.message, status: status.EMAIL_SUCCESSFULLY_CONFIRMED.code})
    })
  })
}

//========================================
// Confirm email route
//========================================
// Issue a new confirmation email for the user provided.
exports.newConfirmationLink = function(req, res, next){
  const email = req.body.email;
  // Return error if no email provided
  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.'});
  }
  User.findOne({ email: email }, function(err, user) {
      if (err) { return next(err); }
      if (user.active) {
        return res.status(400).send({message: 'User already activated', status: 5555});
      }
      let newRandomConfirmationString = randomstring.generate(40);
      user.confirmation_string = newRandomConfirmationString
      user.confirmation_issued = new Date();
      // ----------------------------------------------
      //              Start of email
      // ----------------------------------------------
      let subj = 'Activate your account again';
      let newconfirm_link_with_random_string = confirm_email_link +
                                            newRandomConfirmationString;

      let templateVariables = {
            "-name-": user.firstName,
            "-link-": newconfirm_link_with_random_string
          }

      const email_to_send = {
        from: { email: 'postmaster@moe.com' },
        personalizations: [
           {
             to: [
               {
                 email: email,
               }
             ],
             subject: subj,
             substitutions: templateVariables,
          },
        ],
        content:
         [ { type: 'text/plain', value: 'We sent you an email befor but you did not answer. Here is a new one!' },
           { type: 'text/html', value: 'We sent you an email befor but you did not answer. Here is a new one!' } ],
        template_id: 'ccbc2797-b482-4b2f-8b95-bbf739c31512'
      }

      var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: email_to_send
      });

      sg.API(request, function(error, response) {
        if (error){
          // console.log("Mail server responded with: " + response.statusCode);
          // console.log(response.body);
          // console.log(response.headers);
          // console.log(error);
          return res.status(400).send({message: 'Something is wrong with the email! ' + error, status: 400})
        }
        if (response.statusCode == 202){
            // console.log("Mail server OK: " + response.statusCode)
        }
        else{
          // console.log("Mail server responded with: " + response.statusCode);
          // console.log(response.body);
          // console.log(response.headers);
          return res.status(409).send({message: 'Something might have gone wrong!', status: 409})
        }
      });
      // *********************************************
      //              End of email
      // *********************************************
      user.save(function(err){
        if(err){
          throw err;
        }
        return res.status(200).send({message: 'New email with confirmation is on its way ', status: 8888})
      })
})
}

//========================================
// Test authorization
//========================================
// @Depricated
exports.testAuth = function(req, res, next){
  let userInfo = setUserInfo(req.user);

  res.status(200).json({
    token: 'JWT ' + generateToken(userInfo),
    user: userInfo,
    message: 'This is a secure route'
  });
}

//========================================
// Delete account
//========================================
// Deletes the account that is currently loged in
exports.delteAccount = function(req, res, next){
  let userInfo = setUserInfo(req.user);
  // TODO Remove all articles this user has created!
  User.remove({ _id: userInfo._id }, function(err, user) {
    if (err){
      console.err(err)
      return res.status(400).send({message: 'Something is wrong. Could not delete account ' + error, status: 2345})
    }
    return res.status(200).send({message: 'Your account has been deleted', status: 3457})
  });
  //return res.status(400).send({message: 'Could not find this user.', status: 2342})
}

//========================================
// changeEmail for this account
//========================================
// Change the email of the account that is currently loged in.
exports.changeEmail = function(req, res, next) {
  User.findById(req.user._id, function(err, foundUser) {
    if (err) {
      res.status(422).json({ error: 'No user was found.' });
      return next(err);
    }

    if (req.body.email == '') {
      res.status(422).json({ error: 'No user was found.' });
      return next(err);
    }
    foundUser.email = req.body.email

    foundUser.save(function(err){
      if(err){
        throw err;
      }
      return res.status(200).send({message: 'Email changed ', status: 87543})
    });
  });

}

//========================================
// Request new JWT
//========================================
exports.getNewJWT = function(req, res, next){
  let userInfo = setUserInfo(req.user);
  res.status(200).json({
    token: 'JWT ' + generateToken(userInfo),
    user: userInfo
  });
}

//========================================
// Authorization Middleware
//========================================
// Role authorization check
exports.roleAuthorization = function(role) {
  return function(req, res, next) {
    const user = req.user;

    User.findById(user._id, function(err, foundUser) {
      if (err) {
        res.status(422).json({ error: 'No user was found.' });
        return next(err);
      }

      // If user is found, check role.
      if (foundUser.role == role) {
        return next();
      }

      res.status(401).json({ error: 'You are not authorized to view this content.' });
      return next('Unauthorized');
    })
  }
}

//========================================
// Forgot Password Route
//========================================
// NYI
exports.forgotPassword = function(req, res, next) {
  const email = req.body.email;

  User.findOne({ email: email }, function(err, existingUser) {
    // If user is not found, return error
    if (err || existingUser == null) {
      res.status(422).json({ error: 'Your request could not be processed as entered. Please try again.' });
      return next(err);
    }

      // If user is found, generate and save resetToken

      // Generate a token with Crypto
      crypto.randomBytes(48, function(err, buffer) {
        const resetToken = buffer.toString('hex');
        if (err) { return next(err); }

        existingUser.resetPasswordToken = resetToken;
        existingUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        existingUser.save(function(err) {
          // If error in saving token, return it
          if (err) { return next(err); }

          const message = {
            subject: 'Reset Password',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset-password/' + resetToken + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          }

          // Otherwise, send user email via Mailgun
          // mailgun.sendEmail(existingUser.email, message);

          res.status(200).json({ message: 'Please check your email for the link to reset your password.'});
          next();
        });
      });
  });
}

//========================================
// Reset Password Route
//========================================
// NYI
exports.verifyToken = function(req, res, next) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, resetUser) {

    // If query returned no results, token expired or was invalid. Return error.
      if(!resetUser) {
        res.status(422).json({ error: 'Your token has expired. Please attempt to reset your password again.' });
      }

      // Otherwise, save new password and clear resetToken from database
      resetUser.password = req.body.password;
      resetUser.resetPasswordToken = undefined;
      resetUser.resetPasswordExpires = undefined;

      resetUser.save(function(err) {
        if (err) { return next(err); }

        // If password change saved successfully, alert user via email
        const message = {
          subject: 'Password Changed',
          text: 'You are receiving this email because you changed your password. \n\n' +
          'If you did not request this change, please contact us immediately.'
        }

        // Otherwise, send user email confirmation of password change via Mailgun
        // mailgun.sendEmail(resetUser.email, message);

        res.status(200).json({ message: 'Password changed successfully. Please login with your new password.'});
        next();
      });
  });
}
