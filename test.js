let assert = require('assert');
let ExtensibleFunction = require('./index');

const CONSTRUCTED_PROPERTY_VALUE = `Hi, I'm a property set during construction`;
const ADDITIONAL_PROPERTY_VALUE = `Hi, I'm a property added after construction`;

class ExtendedFunction extends ExtensibleFunction {
  constructor (fn, ...args) {
    super(fn, ...args);
    let [constructedPropertyValue, ...rest] = args;
    this.constructedProperty = constructedPropertyValue;
  }
}

let fn = new ExtendedFunction(function (x) {
  return (this.y>>0) + (x>>0)
}, CONSTRUCTED_PROPERTY_VALUE);

fn.additionalProperty = ADDITIONAL_PROPERTY_VALUE;

describe('ExtensibleFunction', ()=>{
  describe('instanceof', ()=>{
    it('should be an instance of Function', ()=>{
      assert(fn instanceof Function);
    });
    it('should be an instance of ExtensibleFunction', ()=>{
      assert(fn instanceof ExtensibleFunction);
    });
    it('should be an instance of ExtendedFunction', ()=>{
      assert(fn instanceof ExtendedFunction);
    });
  });

  describe('properties', ()=>{
    it('constructed property should be set from constructor', ()=>{
      assert.equal(fn.constructedProperty, CONSTRUCTED_PROPERTY_VALUE);
    });
    it('additional property should be set outside constructor', ()=>{
      assert.equal(fn.additionalProperty, ADDITIONAL_PROPERTY_VALUE);
    });
    describe('#bind()', ()=>{
      it('constructed property should be carried from original to bound function', ()=>{
        assert.equal(fn.constructedProperty, fn.bind().constructedProperty);
      });
      it('additional property should be carried from original to bound function', ()=>{
        assert.equal(fn.additionalProperty, fn.bind().additionalProperty);
      });
    });
  });

  describe('execution', ()=>{
    it('function calls should return expected values', ()=>{
      assert.equal(fn(), 0);
      assert.equal(fn(10), 10);
    });
  });

  describe('#apply()', ()=>{
    it('applied function should takeover provided context and pass arguments', ()=>{
      assert.equal(fn.apply({y:10}, [10]), 20);
    });
  });

  describe('#call()', ()=>{
    it('applied function should takeover provided context and pass arguments', ()=>{
      assert.equal(fn.call({y:10}, 20), 30);
    });
  });

  describe('#bind()', ()=>{
    it('should pass the bound context to the "inner" function', ()=>{
      assert.equal(fn.bind({y:30})(10), 40);
    });
    describe('instanceof', ()=>{
      it('fn.bind() should be an instance of Function', ()=>{
        assert(fn.bind() instanceof Function);
      });
      it('fn.bind() should be an instance of ExtensibleFunction', ()=>{
        assert(fn.bind() instanceof ExtensibleFunction);
      });
      it('fn.bind() should be an instance of ExtendedFunction', ()=>{
        assert(fn.bind() instanceof ExtendedFunction);
      });
    });
    describe('execution', ()=>{
      it('bound function should takeover provided context and pass arguments', ()=>{
        assert.equal(fn.bind({y:30})(10), 40);
        assert.equal(fn.bind({y:30}, 20)(), 50);
      });
    });
  });
});
