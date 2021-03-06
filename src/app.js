const WebSocket = require('ws');
const socket = new WebSocket('ws://207.154.211.157:8080');
const axios = require('axios');
const ip = '127.0.0.1';

if (process.argv.length < 3) {
    console.log("Please specify the port");
    console.log("Usage: npm start <port>\n");
    process.exit(0);
}

const port = process.argv[2];

socket.onmessage = (message) => {
    let processed = processServerMessage(message);
    let url = processed.url;
    let headers = processed.headers;

    const config = {
        method: processed.method,
        url: `http://${ip}:${port}${url}`,
        headers: headers,
        maxRedirects: 0,
        validateStatus: null
    };

    axios(config).then(function (response) {
        let processedRes = processLocalServerResponse(response, processed);
        socket.send(JSON.stringify({ result: true, data: processedRes }));
    }).catch(function (error) {
        console.log(error);
        socket.send(JSON.stringify({ result: false, data: { id: processed.id } }));
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
        id: processed.id,
        status: response.status
    };
}