const WebSocket = require('ws');
const socket = new WebSocket('ws://localhost:8080');
const axios = require('axios');
const ip = '127.0.0.1', port = '3000';

socket.onmessage = ({ message }) => {
    processServerMessage(message);
    axios.get(`http://${ip}:${port}`)
        .then(function (response) {
            let processedRes = processLocalServerResponse(response.headers);
            socket.send(JSON.stringify(processedRes));
        })
        .catch(function (error) {
            // TODO
        })
        .then(function () {
            // TODO
        });
};

function processServerMessage(message) {
}

function processLocalServerResponse(message) {
    return message;
}