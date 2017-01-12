const mongoose = require('mongoose'),
      config = require('./config');
// Use a different Promise provider then mongooses mpromise (its depricated)
mongoose.Promise = Promise;
module.exports = app => {
  // optional callback that gets fired when initial connection completed
  const uri = config.database;
  mongoose.connect(uri, function(error) {
    // if error is truthy, the initial connection failed.
    if (error){
      console.log("ERROR when connecting to mongoDB. Did you forgot to run mongod?");
    }
  }).then(() => {
    // Start to listen on port specified in the config file
    app.listen(app.get("port"), () =>{
      console.log(`DEL API - Port ${app.get("port")}`);
    });
  })
};
