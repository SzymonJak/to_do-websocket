const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const tasks = [{id: 2, name: 'Shopping'}, {id: 4, name: 'Go out with the dog'}, {id: 6, name: 'Do the loundry'}, {id: 8, name: 'Clean windows'}];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/public/index.html'));
});

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
    socket.on('removeTask', (id) => {
        const elemIndex = tasks.findIndex(i => i.id === id);
        tasks.splice(elemIndex, 1);

        socket.broadcast.emit('updateData', tasks);
    });
});

app.use((req, res) => {
    res.status(404).send({ message: '404 not found...' });
});
