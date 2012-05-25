
app.get('/', function(req, res){
  res.render('index', { title: 'Simple Chat' })
});

var users = {"SYSTEM":"SYSTEM"};

io.sockets.on('connection', function(socket){
    socket.on('post msg', function(data, fn){
        if(socket.user && socket.user==data.name) {
            fn(null);
            io.sockets.json.emit('cast msg', data);
        } else {
            checkUser(socket, data, fn);
        }
    });
    socket.on('disconnect', function(){
        if(socket.user){    
            io.sockets.json.emit('cast msg', {
                "name" : "SYSTEM", "message" : socket.user + " has left the room."
            });
        }
    }); 
});

function checkUser(socket, data, fn){
    if(users[data.name]){
        fn("'" + data.name + "' is already in use.");
    } else {
        if(!socket.user){
            io.sockets.json.emit('cast msg', {
                "name" : "SYSTEM", "message" : data.name + " comes in the room."
            });
        }
        else if(socket.user!=data.name){
            delete users[socket.user];
            io.sockets.json.emit('cast msg', {
                "name" : "SYSTEM", 
                "message" : socket.user + " changed name to '" + data.name + "'"
            });
        }

        fn(null);
        users[data.name] = socket.user = data.name;
        io.sockets.json.emit('cast msg', data);
    }   
}
