var express = require("express"),
    app = express(),
    http = require("http"),
    server = http.createServer(app),
    io = require("socket.io")(server);

app.use(express.static(__dirname + "/Public"));
app.get("/", function (req, res) {
    
    res.sendFile(__dirname + "/Public/Index.html");
});

var usernames = {};
io.sockets.on("connection", function (socket) {

    socket.on("sendchat", function (data) {
        console.log(socket.username + "  " + data + "this is send chat");
        io.sockets.emit("updatechat", socket.username, data);
    }); 



    socket.on('base64 file', function (msg) {

        io.sockets.emit('base64 file',  //include sender
            {
                username: socket.username,
                file: msg.file,
                fileName: msg.fileName
            }

        );
    });

    socket.on("adduser", function (user) {
        socket.username = user;
        usernames[user] = user;
        socket.emit("updatechat", 'SERVER', user + " , you have connected");
        socket.broadcast.emit("updatechat", 'SERVER', user + "  has connected");
        io.sockets.emit("updateusers", usernames);

    });

    socket.on("disconnect", function () {

        delete usernames[socket.username];
        socket.broadcast.emit("updatechat", 'SERVER', socket.username + "  has disconnected");
        io.sockets.emit("updateusers", usernames);

    });

    

});

var port = 8080;
server.listen(port);

console.log("your server is running at 8080");
