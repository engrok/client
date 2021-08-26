const WebSocket = require('ws');
const socket = new WebSocket('ws://localhost:8080');
const axios = require('axios');
const ip = '127.0.0.1';
const port = process.argv[2];

socket.onmessage = (message) => {
    let processed = processServerMessage(message);
    let url = processed.url;
    let headers = processed.headers;

    const config = {
        method: processed.method,
        url: `http://${ip}:${port}${url}`,
        headers: headers,
        validateStatus: null
    };

    axios(config).then(function (response) {
        let processedRes = processLocalServerResponse(response, processed);
        socket.send(JSON.stringify(processedRes));
    }).catch(function (error) {
        console.log(error);
    })
};

function processServerMessage(message) {
    let msgData = message.data;
    let host = JSON.parse(msgData).headers.host;
    msgData = msgData.replace(new RegExp(host, 'g'), `${ip}:${port}`);
    return JSON.parse(msgData);
}

function processLocalServerResponse(response, processed) {
    return {
        data: response.data,
        headers: response.headers,
        id: processed.id
    };
}