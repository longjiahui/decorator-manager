var _dec, _class, _class2;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

const DecoratorManager = require('./index');

let manager = new DecoratorManager();
let test = manager.register('test');
let A = (_dec = test('a', 1), test(_class = (_class2 = class A {
  a() {
    console.log('A.a()');
  }

  b() {}

}, (_applyDecoratedDescriptor(_class2.prototype, "a", [_dec], Object.getOwnPropertyDescriptor(_class2.prototype, "a"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "b", [test], Object.getOwnPropertyDescriptor(_class2.prototype, "b"), _class2.prototype)), _class2)) || _class);
console.log(JSON.stringify(manager.configs));