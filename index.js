const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');

const app = express();
const port = process.env.PORT;

let users = [];
app.use(cors());

app.get('/', (req, res) => {
    res.send("working");
})

const server = http.createServer(app);

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log("New Connection");

    socket.on('joined', ({ user }) => {
        console.log(`${user} has Joined`);
        users[socket.id] = user;
        socket.emit('welcome', { user: 'Admin', message: `${user}, Welcome to the Chat` });
        socket.broadcast.emit('userJoined', { user: 'Admin', message: `${users[socket.id]} has Joined` });
    })

    socket.on('message', ({ message, id }) => {
        io.emit('sendMessage', { user: users[socket.id], message: message, id: id });
    })

    socket.on('disconnect', () => {
        console.log('user left');
        socket.broadcast.emit('leave', { user: 'Admin', message: `${users[socket.id]} has Left` });
    })
})


server.listen(port, () => {
    console.log(`server is working on http://localhost:${port}`);
})