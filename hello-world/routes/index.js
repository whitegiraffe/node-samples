
app.get('/', function(req, res){
    db.collection('things').find({greeting:/^Hello/},{greeting:true}).limit(10)
    .toArray(function(err, greetings){
        if(err) throw err;
        res.render('index', { title: 'Hello World !', greetings: greetings });
    });
});