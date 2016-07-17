'use strict';

const _ = require('lodash');
const Promise = require('bluebird');

/**
 * @param {Function} fn
 * @param {Function} callback
 */
function watch(fn, callback) {

  let begin = 0, end = 0;
  let start = () => begin = +Date.now();
  let stop = () => end = +Date.now();
  let done = (err) => callback(err, end - begin);

  try {
    fn(start, stop, done);
  }
  catch(err) {
    callback(err);
  }

}

/**
 * @param {Function} fn
 * @returns {Promise}
 */
function watchAsync(fn) {
  return new Promise((resolve, reject) => {
    watch(fn, (err, span) => err ? reject(err) : resolve(span));
  });
}

/**
 * @param {Array<Function>} arr
 * @returns {Promise}
 */
function watchAverageAsync(arr) {
  return Promise
    .mapSeries(arr, fn => watchAsync(fn))
    .then(r => _.sum(r) / r.length);
}

module.exports = watch;
module.exports.async = watchAsync;
module.exports.average = watchAverageAsync;