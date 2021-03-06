'use strict';
require('dotenv').config();
var fs = require('fs'),
    path = require('path'),
    http = require('http');

var app = require('connect')();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var PORT = process.env.PORT || 8080;
var express = require('express');
var cors = require('cors');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
require('./utils/database');

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};
app.use(cors());
app.use(bodyParser.json());
app.use(cookieSession({
  name: 'cookie',
  secret: process.env.COOKIE_PSW,
  maxAge: 1000 * 60 * 60 * 24,
}));
app.use('/', express.static(path.join(__dirname,'./public')))

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi({
    swaggerUi: '/backend/swaggerui'
  }));

  // Start the server
  http.createServer(app).listen(PORT, function () {
    console.log(`Our app is running on http://localhost:${ PORT }`);
    console.log(`Swagger-ui is available on http://localhost:${ PORT }/backend/swaggerui`);
  });

});
