// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,

  // Routes for development
  URL: {
    login: 'http://localhost:2000/api/auth/login',
    deleteAccount: 'http://localhost:2000/api/auth/delete_my_account',
    changeEmail: 'http://localhost:2000/api/auth/change_email',
    registerUser: 'http://localhost:2000/api/auth/register',
    renewJWT: 'http://localhost:2000/api/auth/get_new_token',
    getRecipes: 'http://localhost:2000/api/recipe/recipe',
    addArticle: 'http://localhost:2000/api/articles/add_article',
    getArticleById: 'http://localhost:2000/api/articles/byid',
    getRecentlyViewedArticles: 'http://localhost:2000/api/articles/recently_viewed',
    getUsers: 'http://localhost:2000/api/auth/test_auth_route',
    uploadArticleImages: 'http://localhost:2000/api/articles/upload_article_images',
    thisRoot: 'http://localhost:2000/',
    changePassword: 'http://localhost:2000/api/auth/change_password'
  }


};
