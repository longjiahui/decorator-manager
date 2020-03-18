自动生成decorator并将管理所有被标记的类和方法的信息

# Install

`npm i decorator-manager`
```javascript
const DecoratorManger = require('decorator-manager')
```

# API

### Constructor `DecoratorManager()`

### Method `register(decoratorName: string, options: Object)`

- options
  - hasArgs: 默认true,表示注册的decorator是否具有参数

### Method `forEach(targetHandler: Function, methodHandler: Function)`

遍历所有配置

- `targetHandler(target, config: Array, configs: Array)`: 处理装饰类的装饰器配置
  - target: 当前类的prototype
  - config: 该target的配置，按参数顺序为数组顺序
  - configs: 同`manager.configs`
- `methodHandler(target, name: string, config: Array, methodConfigs: Array`: 处理装饰方法的装饰器配置
  - target: 当前类的prototype
  - name: 当前方法名
  - config: 该方法的配置，按参数顺序为数组顺序
  - methodConfigs: 当前类的全部装饰了装饰器的方法配置
  
### Method `getTarget(targetId: string)`

### Property `get configs: Object`

返回注册的decorators的使用情况

### Property `get methodConfigsKey: Symbol`
### Property `get decorators: {string: Function}`

# Example

```javascript
let manager = new DecoratorManager();

manager.register('router');
manager.register('loginCheck', {hasArgs: false});
let {router, loginCheck} = manager.decorators;

@router('a', 'b')
class A{

    @loginCheck
    @router('c', 'd')
    a(){

    }
}
console.log(JSON.stringify(manager.configs));
/*
output:
{
    //targetId -- manager.getTarget(id) can get the target
    "719f5330-68f3-11ea-9c68-f16f400f393e": {
        "router": [
            "a",
            "b"
        ],
        "methodConfigs": {
            "a": {
                "router": [
                    "c",
                    "d"
                ],
                "loginCheck": true
            }
        }
    }
}
*/
``` 
