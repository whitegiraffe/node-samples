
app.get('/', function(req, res){
  res.render('index', { title: 'Chat' })
});