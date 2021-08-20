const WebSocket = require('ws');
const socket = new WebSocket('ws://localhost:8080');
const axios = require('axios');
const ip = '127.0.0.1', port = '3000';

socket.onmessage = (event) => {
    let processedData = processServerMessage(event.data);
    let neededUrl = processedData.url;
    let neededHeaders = processedData.headers;

    const config = {
        method: 'get',
        url: `http://${ip}:${port}${neededUrl}`,
        headers: neededHeaders
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

function processServerMessage(dataArg) {
    data = JSON.parse(dataArg);
    let host = data.headers.host;
    dataArg = dataArg.replace(new RegExp(host, "g"), `${ip}:${port}`);
    return JSON.parse(dataArg);
}

function processLocalServerResponse(response) {
    return {
        data: response.data,
        headers: response.headers
    };
}