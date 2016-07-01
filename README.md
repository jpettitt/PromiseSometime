# promise-sometime

Promise.all() behavior but with a timout instead of a count.

## Installation

`npm install promise-sometime`

## Usage

### sometime([promises], timeout)

Waits for `promises` until either they all resolve, one rejects, or the `timeout` ms has elapsed.

Returns and array or results in the same way as `Promise.all()`.  If the timout is reached the array
will have `undefined` for any promises that have not yet resolved.

## Example
```js
const promiseSome = require('promise-some');

var p1 = new Promise((resolve, reject) => { 
  setTimeout(resolve, 1000, "one"); 
}); 
var p2 = new Promise((resolve, reject) => { 
  setTimeout(resolve, 2000, "two"); 
});
var p3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 3000, "three");
});
var p4 = new Promise((resolve, reject) => {
  setTimeout(resolve, 4000, "four");
});


promiseSome([p1, p2, p3, p4], 3500).then(value => { 
  console.log(value);
}, function(reason) {
  console.log(reason)
});

//From console:
// [ "one", "two", "three", undefined ]

```

`promiseSome()` has the same "fail fast" behavior as `Promise.all()` if the rejection happens before the timeout.