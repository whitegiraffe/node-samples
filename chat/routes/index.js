var pagesize = 10;
var users = {"SYSTEM":"SYSTEM"};

app.get('/', function(req, res){
    var now = new Date();
    res.render('index', { title: 'Simple Chat'});
});


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

    socket.on('read log', function(param, callback){
        if(!param.oldestDate){
            callback("No more data found.");
        } else {
            var startDate = new Date();
            startDate.setTime(param.oldestDate);
            readLog(startDate.getTime(), pagesize, 0, function(data){
                if(data && data.length>0 ){
                    socket.json.emit('load morelog',data);
                } else {
                    callback("No more data found.");
                }
            });
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

function readLog(startdate, limit, skip, callback) {
    var conditions = {
        "date": {$lt: startdate}
    };
    var options = {
        "limit": limit,
        "skip": skip,
        "sort": [['date','desc']]
    };
    db.collection("chatlog").find(conditions, options).toArray(function(err, data){
        if(err){
            console.log(err);
        } else {
            callback(data);
        }
    });
}