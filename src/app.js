const WebSocket = require('ws');
const socket = new WebSocket('ws://localhost:8080');
const axios = require('axios');
const ip = '127.0.0.1', port = '3000';

socket.onmessage = (message) => {
    let processed = processServerMessage(message);
    let url = processed.url;
    let headers = processed.headers;

    const config = {
        method: 'get',
        url: `http://${ip}:${port}${url}`,
        headers: headers
    };

    axios(config).then(function (response) {
        let processedRes = processLocalServerResponse(response);
        socket.send(JSON.stringify(processedRes));
    }).catch(function (error) {
        // TODO
    }).then(function () {
        // TODO
    });
};

function processServerMessage(message) {
    let msgData = message.data;
    let host = JSON.parse(msgData).headers.host;
    msgData = msgData.replace(new RegExp(host, 'g'), `${ip}:${port}`);
    return JSON.parse(msgData);
}

function processLocalServerResponse(response) {
    return {
        data: response.data,
        headers: response.headers
    };
}