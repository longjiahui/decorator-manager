const DecoratorManager = require('./index');

let manager = new DecoratorManager();
let test = manager.register('test');

@test
class A{
    @test('a', 1)
    a(){
        console.log('A.a()');
    }
    @test
    b(){
        
    }
}

console.log(JSON.stringify(manager.configs));