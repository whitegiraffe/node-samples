
app.get('/', function(req, res){
  res.render('index', { title: 'Simple Chat' })
});

var users = {"SYSTEM":"SYSTEM"};

io.sockets.on('connection', function(socket){
    socket.on('post msg', function(data, callback){
        if(socket.user && socket.user==data.name) {
            callback(null);
            castMsg(data);
        } else {
            checkUser(socket, data, callback);
        }
    });
    socket.on('disconnect', function(){
        if(socket.user){    
            delete users[socket.user];
            castMsg(createSysMsg( socket.user + " has left the room."));
        }
    }); 
});

function checkUser(socket, data, callback){
    if(users[data.name]){
        callback("'" + data.name + "' is already in use.");
    } else {
        if(!socket.user){
            castMsg(createSysMsg( data.name + " comes in the room."));
        }
        else if(socket.user!=data.name){
            delete users[socket.user];
            castMsg(createSysMsg( socket.user + " changed name to '" + data.name + "'"));
        }

        callback(null);
        users[data.name] = socket.user = data.name;
        castMsg(data);
    }   
}

function castMsg(data){
    io.sockets.json.emit('cast msg',setDate(data));
    storeMsg(data);
}

function storeMsg(data){
    db.collection("chatlog").insert(data, {safe: true}, function(err, records){
        if(err){
            console.log(err);
        }
    });
}

function setDate(data) {
        var now = new Date();
        data.date = now.getTime();
        return data;
}

function createSysMsg(msg) {
    var sysMsgData = {};
    sysMsgData.name = "SYSTEM";
    sysMsgData.message = msg;
    return sysMsgData;
}