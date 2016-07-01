'use strict'
const Promise = require('bluebird');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const sometime = require('../index.js');

const start = Date.now();

/*
 * make a promise the resolves or rejcts after a specifc time with a specifc value
 * @param delay - wait this long before resolving or rejecting.
 * @param resolveWith this value or false reject
 * 
 */
function delayedPromise(resolveWith, delay) {
  return Promise.delay(delay)
  .then(() => {
    if (resolveWith) return resolveWith;
    throw new Error(`Rejecting after ${delay}ms`);
  });
}


/*
 * creates a set of promises that return after 100ms intervals
 * @param {int} rejectAt - option one of the promises will reject after this time
 */

function newPromiseSet(count, rejectAt) {
  const promises = [];
  for(var i = 1; i <= count; i++) {
    promises.push(delayedPromise(i, i * 100));
  }
  if (rejectAt) {
      promises.push(delayedPromise(false, rejectAt));
  }
  return promises;
}


describe("Promise.sometime", function() {
  it("Behaves like Promise.all() and returns all promises if it doesn't timeout", () => {
    const promises = newPromiseSet(5);
    return expect(sometime(promises, 1000))
    .to.eventually.deep.equal([1, 2, 3, 4, 5]);
  });
  
  it("Returns the ones that completed if it does timeout", () => {
    const promises = newPromiseSet(5);
    return expect(sometime(promises, 350))
    .to.eventually.deep.equal([1, 2, 3, undefined, undefined]);
  });
  
  it("Reject if a promise rejects before the timeout", () => {
    const promises = newPromiseSet(5, 250);
    return expect(sometime(promises, 350))
    .to.eventually.be.rejectedWith("Rejecting after 250ms");
  });
  
  it("Returns the ones that completed if it does timeout and rejects after the timout", () => {
    const promises = newPromiseSet(5,450);
    return expect(sometime(promises, 350))
    .to.eventually.deep.equal([1, 2, 3, undefined, undefined, undefined]);
  });
  
  it("Handles mixed promises and values", () => {
    const promises = newPromiseSet(5);
    promises.push(6);
    return expect(sometime(promises, 1000))
    .to.eventually.deep.equal([1, 2, 3, 4, 5, 6]);
  });
});