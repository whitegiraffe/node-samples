"use strict";
app.get('/', function(req, res){
  res.render('index', { title: 'Hello World !' });
});