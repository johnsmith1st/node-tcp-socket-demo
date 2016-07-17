'use strict';

const _ = require('lodash');
const lorem = require('lorem-ipsum');
const watch = require('./watch');

const argv = require('minimist')(process.argv.slice(2));

let sampling = Number.parseInt(argv['s'] || argv['sampling'] || '1000');
let load = Number.parseInt(argv['l'] || argv['load'] || '1024');

/**
 * Generate test data.
 * @param {number} load
 * @returns {Buffer}
 * @private
 */
function _data(load) {
  let txt = lorem({ count: load }).toString().substring(0, load);
  return new Buffer(txt);
}

/**
 * Make some test.
 * @param {Socket} client
 * @param {number} sampling
 * @param {number} load
 * @returns {Promise}
 * @private
 */
function _test(client, sampling, load) {
  
  let cases = _.range(sampling)
    .map(s => _data(load))
    .map(s => {
      return function (start, stop, done) {
        console.log('sending:', s.toString());
        start();
        client.write(s, (err) => {
          stop();
          if (!err) console.log('send completed');
          return done(err);
        });
      };
    });

  return watch.average(cases)
    .then(span => {
      console.log('average span:', span);
    })
    .catch(err => {
      console.error(err);
    });

}

/**
 * Process client.
 * @param {Socket} client
 */
module.exports.process = (client) => {

  console.log('client connected to server');

  client.on('error', (err) => {
    console.error(err);
  });

  client.on('data', (data) => {
    console.log('received:', data.toString());
  });

  client.on('end', () => {
    console.log('client disconnected from server');
  });

  _test(client, sampling, load)
    .then(() => {
      client.end('bye bye !!!');
    });
  
};

/**
 * Process client on server side.
 * @param {Socket} client
 */
module.exports.processClient = (client) => {

  console.log('client connected');

  client.on('error', (err) => {
    console.error(err);
  });

  client.on('data', (data) => {
    console.log('received:', data.toString());
    client.write('OK');
  });

  client.on('end', () => {
    console.log('client disconnected');
  });

};

