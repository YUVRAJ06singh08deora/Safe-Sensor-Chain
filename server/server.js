const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const serialPort = new SerialPort({ path: '/dev/cu.usbserial-0001', baudRate: 9600 }); // Adjust the port and baud rate as needed
const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }))
parser.on('data', (data) => {
  // Send data to connected clients (WebSocket)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data.toString());
    }
  });
});

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
