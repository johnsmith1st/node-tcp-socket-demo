'use strict';

const net = require('net');
const contract = require('./contract');
const protocol = require('./protocol');

let socketServer = net.createServer((socket) => {
  protocol.processClient(socket);
});

/// handling error
///
socketServer.on('error', (err) => {
  console.error(err);
});

/// start
///
socketServer.listen(contract.PORT, (err) => {
  return (err)
    ? console.error(err)
    : console.log('server started on port', contract.PORT);
});