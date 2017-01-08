"use strict"

const jwt = require('jsonwebtoken'),
      crypto = require('crypto'),
      User = require('../models/user'),
      Recipe = require('../models/recipe'),
      config = require('../libs/config'),
      randomstring = require("randomstring"),
      status = require('../status');

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

exports.filteredArticles = function(req, res, next) {

}

exports.allArticles = function(req, res, next) {
  Recipe.find({}, (err, recipes) => {
    if (err) { return next(err); }
    return res.status(200).send({recipes: recipes});
  });
}

exports.getOneById = function(req, res, next) {
  Recipe.findById(req.params.id, (err, oneUser) => {
    if (err) {
      console.log(req.params.id)
      console.log("error here")
      return next(err);
    }
    if (oneUser == null) {
      console.log("- no user found")
      return res.status(406).send({message: "Could not find the recipe"});
    }
    return res.status(200).send({user: oneUser});
  });

}

exports.editById = function(req, res, next) {
  const newMesage = req.body.message;
  Recipe.findOne({_id: req.params.id}, (err, oneUser) => {
    if (err) { return next(err); }
    if (!newMesage) {
      return res.status(204).json({ message: 'Nothing to edit' });
    }
    let newRecipe = new Recipe({
    title         : newRecipe.title,
    intro         : newRecipe.intro,
    txt           : newRecipe.txt,
    price         : newRecipe.price,
    coverimg      : newRecipe.coverimg,
    symbolLink    : newRecipe.symbolLink,
    otherImg      : newRecipe.otherImg,
    diagramImg    : newRecipe.diagramImg
    })
    newRecipe.save( (err) => {
      if (err) {return res.status(400).send({message: 'Somthing went wrong' + err, status: 2345}); }
      return res.status(200).send({message: 'Accepted - recepie changed'})
    })
  });
}

exports.deleteById = function(req, res, next) {
  Recipe.findByIdAndRemove(req.params.id, (err, recipe) => {
    if (err) { return next(err); }
    return res.status(200).send({message: 'Accepted - recepie deleted', deleted: recipe})
  });
}

exports.addRecipe = function(req, res, next) {
  console.log("- processing")
  let userInfo = setUserInfo(req.user);
  console.log("- OK")
  let newRecipe = req.body;
  console.log("- OK")
  console.log(req.body);
  // Check that the new article is not empty.
  if ((typeof(newRecipe) == 'undefined') ) {
        // console.log("\nUnprocessable Entity ERROR\n")
        return res.status(422);
  }
  // Check for bad recipe.
  console.log(newRecipe.title)
  if (newRecipe.title == '' || newRecipe.intro == '' || newRecipe.txt == '' ||
      !(typeof(parseInt(newRecipe.price)) == "number")) {
        console.error("Recipe format is wrong");
        return res.status(422).send({message: 'The recipe is not formated right, is the price a number? ' + newRecipe, status: 4567})
      }
    console.log("- OK")
    let theNewRecipe = new Recipe({
    strakkId      : newRecipe.strakkId,
    title         : newRecipe.title,
    intro         : newRecipe.intro,
    txt           : newRecipe.txt,
    price         : newRecipe.price,
    coverimg      : newRecipe.coverimg,
    symbolLink    : newRecipe.symbolLink,
    otherImg      : newRecipe.otherImg,
    diagramImg    : newRecipe.diagramImg
  });

    // Save the new article
    theNewRecipe.save(function(err){
      if (err) {
        return res.status(400).send({message: 'Something is wrong. Could not add article: ' + err, status: 2345});
      }
      return res.status(200).send({message: 'Accepted - recepie added'})
    });

}

exports.recentlyViewed = function(req, res, next) {

}
