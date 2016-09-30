'use strict';
const Promise = require('bluebird');

module.exports = function(promises, timeout) {
  if(!parseInt(timeout) > 0) {
    throw new RangeError(`${timeout} is not be a positive number`);
  }
  if(!Array.isArray(promises)) {
    throw new TypeError("promises must be an array");
  }
  
  return Promise.race([Promise.all(promises), Promise.delay(timeout)])
  .then((res) => {
    // If we got an array the Promise.all() completed, just return it
    if (Array.isArray(res)) {
      return res;
    }
    /*
     * Otherwise make an array with only those that completed
     * filling in the unresolved ones with undefined
     */
    const result = [];
    promises.forEach((promise) => {
      result.push(promise.isFulfilled() ? promise.value() : undefined);
    });
    return result;
  });
  
};