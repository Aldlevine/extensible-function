// The Symbol that becomes the key to the "inner" function
const EFN_KEY = Symbol('ExtensibleFunctionKey');

// Here it is, the `BaseExtensibleFunction`!!!
class BaseExtensibleFunction extends Function {
  // Just pass in your function.
  constructor (fn, bindSelf) {
    // This essentially calls Function() making this function look like:
    // `function (EFN_KEY, ...args) { return this[EFN_KEY](...args); }`
    // `EFN_KEY` is passed in because this function will escape the closure
    super('EFN_KEY, ...args','return this[EFN_KEY](...args)');
    // Create a new function from `this` that binds to `this` as the context
    // and `EFN_KEY` as the first argument.
    let ret = Function.prototype.bind.apply(this, [this, EFN_KEY]);
    // This is the only difference between `ExtensibleFunction`
    // and `BoundExtensibleFunction`. If bindSelf it binds the "inner"
    // function to the return value
    if(bindSelf) fn = fn.bind(ret);
    // For both the original and bound funcitons, we need to set the `[EFN_KEY]`
    // property to the "inner" function. This is done with a getter to avoid
    // potential overwrites/enumeration
    Object.defineProperty(this, EFN_KEY, {get: ()=>fn});
    Object.defineProperty(ret, EFN_KEY, {get: ()=>fn});
    // Return the bound function
    return ret;
  }

  // We'll make `bind()` work just like it does normally
  bind (...args) {
    // We don't want to bind `this` because `this` doesn't have the execution context
    // It's the "inner" function that has the execution context.
    let fn = this[EFN_KEY].bind(...args);
    // Now we want to return a new instance of `this.constructor` with the newly bound
    // "inner" function. We also use `Object.assign` so the instance properties of `this`
    // are copied to the bound function.
    return Object.assign(new this.constructor(fn), this);
  }

  // Pretty much the same as `bind()`
  apply (...args) {
    // Self explanatory
    return this[EFN_KEY].apply(...args);
  }

  // Definitely the same as `apply()`
  call (...args) {
    return this[EFN_KEY].call(...args);
  }
}

// This is the unbound version: `ExtensibleFunction`
// This function will retain it's given context
class ExtensibleFunction extends BaseExtensibleFunction {
  constructor (fn) {
    super(fn, false);
  }
}

// This is the bound version: `BoundExtensibleFunction`
// This function will be bound to its own context
// (`this` called within the function will reference itself)
class BoundExtensibleFunction extends BaseExtensibleFunction {
  constructor (fn) {
    super(fn, true);
  }
}

ExtensibleFunction.Bound = BoundExtensibleFunction;

module.exports = ExtensibleFunction;
