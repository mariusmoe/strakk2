export const environment = {
  production: true,

  // Routes for production
  URL: {
    login: 'http://it2810-02.idi.ntnu.no:2000/api/auth/login',
    deleteAccount: 'http://it2810-02.idi.ntnu.no:2000/api/auth/delete_my_account',
    changeEmail: 'http://it2810-02.idi.ntnu.no:2000/api/auth/change_email',
    registerUser: 'http://it2810-02.idi.ntnu.no:2000/api/auth/register',
    renewJWT: 'http://it2810-02.idi.ntnu.no:2000/api/auth/get_new_token',
    getArticles: 'http://it2810-02.idi.ntnu.no:2000/api/articles/filtered',
    addArticle: 'http://it2810-02.idi.ntnu.no:2000/api/articles/add_article',
    getArticleById: 'http://it2810-02.idi.ntnu.no:2000/api/articles/byid',
    getRecentlyViewedArticles: 'http://it2810-02.idi.ntnu.no:2000/api/articles/recently_viewed',
    getUsers: 'http://it2810-02.idi.ntnu.no:2000/api/auth/test_auth_route',
    uploadArticleImages: 'http://it2810-02.idi.ntnu.no:2000/api/articles/upload_article_images',
    thisRoot: 'http://it2810-02.idi.ntnu.no:2000/',
    changePassword: 'http://it2810-02.idi.ntnu.no:2000/api/auth/change_password'
  }
};
