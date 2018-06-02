const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/')); 

app.get("/", function(req, res) {
    res.sendFile("index.html", {"root": __dirname});
});

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('change video', (id) => {
        io.emit('change video', id);
    });

    socket.on('change time', (time) => {
        io.emit('change time', time);
    });

    socket.on('pause video' , () => {
        io.emit('pause video');
    });
    
    socket.on('play video' , () => {
        io.emit('play video');
    });
});

http.listen(3000, () => {
    console.log("listening on 3000");
});


    