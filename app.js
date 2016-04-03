var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path =  require('path');
var config = require('./config.js');

var visitorsData = {};

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, 'public/')));


app.get(/\/(about|contact)?$/, function(req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/dashboard', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/dashboard/html'));
});

io.on('connection', function(socket) {
  socket.on('visitor-data', function(data) {
    console.log('user started session');
    visitorsData[socket.id] = data;
  });

  socket.on('disconnect', function() {
    console.log('user session ended');
    delete visitorsData[socket.id];
  });
});

http.listen(app.get('port'), function() {
   console.log('listening on *:' + app.get('port'));
});
