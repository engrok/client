const WebSocket = require('ws');
const socket = new WebSocket('ws://localhost:8080');

socket.on('open', () => {
    socket.send('something');
});

socket.onmessage = ({ data }) => {
    console.log('Message from server ', data);
};