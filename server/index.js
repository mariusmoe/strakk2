const express = require('express'),
      consign = require('consign'),
      app = express(),
      path = require('path');

// Serve static files so images can be loaded.
// app.use(express.static(path.join(__dirname, 'uploads')));
// app.use(express.static(path.join(__dirname, '../client-angular/dist')));

// Start server
consign()
  .include("models")    // Barrel loading
  .then("libs/middleware.js")
  .then("router.js")
  .then("libs/boot.js")
  .into(app);
