"use strict"

const jwt = require('jsonwebtoken'),
      crypto = require('crypto'),
      User = require('../models/user'),
      Recipe = require('../models/recipe'),
      config = require('../libs/config'),
      randomstring = require("randomstring"),
      status = require('../status');

/**
 * Set user info from request
 */
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

/** [filteredArticles description] */
exports.filteredArticles = function(req, res, next) {

}

/**
 * Retrive all recipes
 * @param  {json}   req  request object
 * @param  {json}   res  response object
 * @param  {Function} next pass error further
 * @return {json}        response
 */
exports.allRecipes = function(req, res, next) {
  Recipe.find({}, (err, recipes) => {
    if (err) { return next(err); }
    return res.status(200).send({recipes: recipes});
  });
}

/**
 * get one recipe by ID
 * @param  {json}   req  [description]
 * @param  {json}   res  [description]
 * @param  {Function} next [description]
 * @return {json}        [description]
 */
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
  if (!req.body) {
    return res.status(204).json({ message: 'Nothing to edit' });
  }
  const newMesage = req.body;
  Recipe.findOne({_id: req.params.id}, (err, oneRecipe) => {
    if (err) { return next(err); }
      oneRecipe.strakkId      = newMesage.strakkId    || oneRecipe.strakkId ,
      oneRecipe.title         = newMesage.title       || oneRecipe.title,
      oneRecipe.intro         = newMesage.intro       || oneRecipe.intro,
      oneRecipe.txt           = newMesage.txt         || oneRecipe.txt,
      oneRecipe.price         = newMesage.price       || oneRecipe.price,
      oneRecipe.coverimg      = newMesage.coverimg    || oneRecipe.coverimg,
      oneRecipe.symbolLink    = newMesage.symbolLink  || oneRecipe.symbolLink,
      oneRecipe.otherImg      = newMesage.otherImg    || oneRecipe.otherImg,
      oneRecipe.diagramImg    = newMesage.diagramImg  || oneRecipe.diagramImg
    oneRecipe.save( (err) => {
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
  let userInfo = setUserInfo(req.user);
  let newRecipe = req.body;

  // Check that the new article is not empty.
  if ((typeof(newRecipe) == 'undefined') ) {
        // console.log("\nUnprocessable Entity ERROR\n")
        return res.status(422);
  }
  // Check for bad recipe.
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
