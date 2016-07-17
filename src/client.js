'use strict';

const net = require('net');
const contract = require('./contract');
const protocol = require('./protocol');

let argv = require('minimist')(process.argv.slice(2));

let host = argv['h'] || argv['host'] || '127.0.0.1';

let client = net.createConnection(contract.PORT, host, () => {
  protocol.process(client);
});