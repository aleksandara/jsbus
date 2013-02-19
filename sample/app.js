/*global __dirname console process require*/

var app, express, http, home, path;

// Global requires.
express = require('express');
http = require('http');
path = require('path');

// Routes.
home = require('./routes/home.js');

app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express['static'](path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', home.index);
app.get('/qunit', home.qunit);
app.get('/sample', home.sample);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
