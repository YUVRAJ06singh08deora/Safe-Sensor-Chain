const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const WebSocket = require('ws');
const http = require('http');
const port = new SerialPort({ path: '/dev/cu.usbserial-0001', baudRate: 9600 });

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  parser.on('data', (data) => {
    // Send the serial data to the connected WebSocket client (your React component)
    ws.send(data);
  });
});

server.listen(8080, () => {
  console.log('WebSocket server listening on port 8080');
});
