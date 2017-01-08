const bodyParser = require('body-parser'),
      logger = require('morgan');

module.exports = app => {
  // Pretty print for easy development
  app.set("json spaces", 4);

  // Set the port used by the server
  app.set('port', 2000);

  // Setting up basic middleware for all Express requests
  app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
  app.use(bodyParser.json()); // Send JSON responses
  app.use(logger('dev')); // Log requests to API using morgan


  // Enable CORS from client-side
  app.use(function(req, res, next) {
    var allowedOrigins = ['http://localhost:4200', 'http://localhost:4321', 'http://localhost:2000'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // res.header("Access-Control-Allow-Origin", ["http://localhost:4200", "http://localhost:4321"]);
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, PATCH, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

  //app.use(multer({dest:'./uploads/'}).single('singleInputFileName'));
  //app.use(multer({dest:'../uploads'}).array('multiInputFileName'));
  //var type = upload.single('recfile')

};
