$(function(){
      var socket = io.connect();
      socket.on('connect', function(){
          var param = {"oldestDate" : (new Date()).getTime()};
          socket.json.emit('read log', param, function(err_msg){
          });
      });
      socket.on('cast msg', function(data){
          showMessage(data, "#chatlog", "prepend", "slow");
      });

      socket.on('load morelog', function(logs){
          var oldestDate = null;
          logs.forEach(function(data) {
        	  oldestDate = showMessage(data, "#more", "before", "fast");
          });
          $('#oldestDate').val(oldestDate);
      });

      function showMessage(data, targetId, position, speed){
          var logcolor = "black";
          if(data.name=="SYSTEM"){
              logcolor = "blue";
          }

          var date = new Date();
          date.setTime(data.date);

          var elem = $('<p></p>').
              append($('<div></div>').addClass('name').text(data.name)).css("color",logcolor).
              append($('<div></div>').addClass('message').text(data.message)).css("color",logcolor).
              append($('<div></div>').addClass('date').text(date.toLocaleString())).hide();

          switch(position){
          case "append":
              $(targetId).append(elem);
              break;
          case "prepend":
              $(targetId).prepend(elem);
              break;
          case "before":
              $(targetId).before(elem);
              break;
          case "after":
              $(targetId).after(elem);
              break;
          default:
        	  $(targetId).prepend(elem);
          }
       
      $('#chatlog p:hidden:first').slideDown(speed);
        return data.date;
      }

      $('#send-msg').submit(function(){
          var data = {"name"    : $('#name').val(),
                      "message" : $('#message').val()};
          socket.json.emit('post msg', data, function(err_msg){
              if(err_msg){
                  $("#err-msg").text(err_msg);
              } else {
                  $("#err-msg").text("");
              }
          });
          $('#message').val('').focus();
          return false;
      });
      
      $('#more').click(function(){
          var param = {"oldestDate" : $('#oldestDate').val()};
          socket.json.emit('read log', param, function(err_msg){
              if(err_msg){
                  $("#err-msg").text(err_msg);
              }              
          });
          return false;
      });

      $('#more').hover(
          function(){
              $(this).css("cursor","pointer");
          },
          function(){
              $(this).css("cursor","default");
          }
      );

      $("#chatlog .date").each(function(){
          var date = new Date();
          date.setTime($(this).text());
          $(this).text(date.toLocaleString());
      });
            
});
