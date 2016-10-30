# extensible-function
An extensible ES6 function with idiomatic inheritance and various other benifits:

[![Build Status](https://travis-ci.org/Aldlevine/extensible-function.svg?branch=master)](https://travis-ci.org/Aldlevine/extensible-function)

#### Installation
```bash
npm install --save extensible-function
```

 - When extending `ExtensibleFunction`, the code is idiomatic of extending any ES6 class (no, mucking about with pretend constructors or proxies).
 - The prototype chain is retained through all subclasses, and `instanceof` / `.constructor` return the expected values.
 - `.bind()` `.apply()` and `.call()` all function as expected. This is done by overriding these methods to alter the context of the "inner" function as opposed to the `ExtensibleFunction` (or it's subclass') instance.
 - `.bind()` returns a new instance of the functions constructor (be it `ExtensibleFunction` or a subclass). It uses `Object.assign()` to ensure the properties stored on the bound function are consistent with those of the originating function.
 - Closures are honored, and arrow functions continue to maintain the proper context.
 - The "inner" function is stored via a `Symbol`, which is obfuscated by the module.

## ExtensibleFunction

#### Example of extending `ExtensibleFunction`
```javascript
const ExtensibleFunction = require('extensible-function');
// OR //
import ExtensibleFunction from 'extensible-function';

// Lets extend our `ExtensibleFunction` into an `ExtendedFunction`
class ExtendedFunction extends ExtensibleFunction {
  constructor (fn, ...args) {
    // Just use `super()` like any other class
    // You don't need to pass ...args here, but if you used them
    // in the super class, you might want to.
    super(fn, ...args);
    // Just use `this` like any other class. No more messing with fake return values!
    let [constructedPropertyValue, ...rest] = args;
    this.constructedProperty = constructedPropertyValue;
  }
}
```

#### Example of using the `ExtendedFunction`
```javascript
let fn = new ExtendedFunction(function (x) {
  // Add `this.y` to `x`
  // If either value isn't a number, coax it to one, else it's `0`
  return (this.y>>0) + (x>>0)
}, "I'm a constructed property value");

fn.additionalProperty = "I'm an additional property value";
```

#### This is what you get
```javascript
fn instanceof Function; // true
fn instanceof ExtensibleFunction; //true
fn instanceof ExtendedFunction; //true
fn.bind() instanceof Function; //true
fn.bind() instanceof ExtensibleFunction; //true
fn.bind() instanceof ExtendedFunction; //true
fn.constructor == ExtendedFunction; //true
fn.constructedProperty == "I'm a constructed property value"; //true
fn.additionalProperty == "I'm an additional property value"; //true
fn.constructedProperty == fn.bind().constructedProperty; //true
fn.additionalProperty == fn.bind().additionalProperty; //true
fn() == 0; //true
fn(10) == 10; //true
fn.apply({y:10}, [10]) == 20; //true
fn.call({y:10}, 20) == 30; //true
fn.bind({y:30})(10) == 40; //true
```

## ExtensibleFunction.Bound

The module also provides a convenient constructor which binds a function to itself. Yeah, it sounds weird but the benefit is that calls to these functions have their `this` set to themselves.

#### Example of using ExtensibleFunction.Bound
```javascript
class BoundExtendedFunction extends ExtensibleFunction.Bound {
  constructor (fn, x) {
    super(fn);
    this.x = x;
  }
}

let bfn = new BoundExtendedFunction(function(y){
  return this.x + y;
}, 100);

bfn(42); // 142
bfn.x = 0;
bfn(42); // 42
```
