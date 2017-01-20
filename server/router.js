const AuthenticationController = require('./controllers/authentication'),
      RecipeController = require('./controllers/recipes'),
      UserController = require('./controllers/users'),
      express = require('express'),
      passportService = require('./libs/passport'),
      passport = require('passport'),
      multer  = require('multer'),
      upload = multer({ dest: 'uploads/'}),
      fs = require('fs');


// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

// Constants for role types
const REQUIRE_ADMIN = "Admin",
      REQUIRE_MEMBER = "Member";

module.exports = function(app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
        authRoutes = express.Router(),
        recipeRoutes = express.Router(),
        userRoutes    = express.Router();

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);
  // Set user routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/user', userRoutes);
  // Set article routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/recipe', recipeRoutes);

  /*
   |--------------------------------------------------------------------------
   | Auth routes
   |--------------------------------------------------------------------------
  */
  // Registration route
  authRoutes.post('/register', AuthenticationController.register);

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  // TODO Password reset request route (generate/send token)
  authRoutes.post('/forgot-password', AuthenticationController.forgotPassword);

  // TODO send mail with
  authRoutes.post('/reset-password/:token', AuthenticationController.verifyToken);

  // Confirm account from link sent with email
  authRoutes.get('/confirm_account/:confirmation_string', AuthenticationController.confirmAccount);

  // Request new email
  authRoutes.post('/request_new_email_confirmation', AuthenticationController.newConfirmationLink)

  // Request test_auth_route
  authRoutes.get('/test_auth_route', requireAuth, AuthenticationController.testAuth)

  // change email for this account
  authRoutes.post('/change_email', requireAuth, AuthenticationController.changeEmail);

  // Delete the account with the provided JWT
  authRoutes.delete('/delete_my_account', requireAuth, AuthenticationController.delteAccount);

  // Request a new token
  authRoutes.get('/get_new_token', requireAuth, AuthenticationController.getNewJWT);

  // Change password from within app
  authRoutes.post('/change_password', requireAuth, AuthenticationController.changePassword);

  // TODO Login with oAuth2.0 -- way ahead

  /*
   |--------------------------------------------------------------------------
   | Recipes routes
   |--------------------------------------------------------------------------
  */
  // Get all articles in DB
  recipeRoutes.get('/all', requireAuth, RecipeController.allRecipes);

  // Get 50 articles based on filters
  recipeRoutes.get('/filtered', requireAuth, RecipeController.filteredRecipes);

  // Get all recipes
  recipeRoutes.get('/recipe', requireAuth, RecipeController.allRecipes);

  // Get one article by id
  recipeRoutes.get('/recipe/:id', requireAuth, RecipeController.getOneById);

  // Edit recipe
  recipeRoutes.patch('/recipe/:id', requireAuth, RecipeController.editById);

  // delete recipe
  recipeRoutes.delete('/recipe/:id', requireAuth, RecipeController.deleteById);

  // Add one recipe for this user
  recipeRoutes.post('/recipe', requireAuth, RecipeController.addRecipe);

  // Get recently viewed articles
  recipeRoutes.get('/recently_viewed', requireAuth, RecipeController.recentlyViewed);

  // Upload up to four images for one article.
  // This method need to bee here becouse of its dependency on multiple params.
  const type = upload.array('file',4)
  recipeRoutes.post('/upload_recipe_images', type, requireAuth, function (req,res) {
      // get the temporary location of the file
      let tmp_path = req.files[0].path;
      // set where the file should actually exists - in this case it is in the "images" directory
      let target_path = 'uploads/' + req.user._id.toString() + ":" + req.files[0].originalname;
      // console.log(target_path);
      // move the file from the temporary location to the intended location
      fs.rename(tmp_path, target_path, function(err) {
          if (err) throw err;
          // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
          fs.unlink(tmp_path, function() {
              if (err) throw err;
              // console.log('File uploaded to: ' + target_path + ' - ' + req.files[0].size + ' bytes');
          });
      });
      // TODO send error if server crash
    res.status(204).end();
  });



  //TODO: Write different action possible for articles
  // apiRoutes.use('/articles', recipeRoutes);
  // Get all Articles
  // recipeRoutes.get('/all', ArticlesController.getAll);


  // Set url for API group routes
app.use('/api', apiRoutes);
};
