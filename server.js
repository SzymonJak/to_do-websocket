const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const tasks = [{id: 2, name: 'Shopping'}, {id: 4, name: 'Go out with the dog'}];

app.use(express.static(path.join(__dirname, '/client')));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '/client/src/index.js'));
// });

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running port:8000');
});
const io = socket(server);

io.on('connection', (socket) => {
    console.log('New user connected');
    socket.emit('updateData', tasks); //sends tasks array to just connected socket
    socket.on('addTask', (task) => {
        tasks.push(task);
        socket.broadcast.emit('addTask', task);
    });
    socket.on('removeTask', (elemIndex) => {
        tasks.splice(elemIndex, 1);
        socket.broadcast.emit('removeTask', elemIndex);
    });
});

app.use((req, res) => {
    res.status(404).send({ message: '404 not found...' });
});
