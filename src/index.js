const assert = require('assert');
const {v1:uuid} = require('uuid');

let targetIdKey = Symbol('targetIdKey');
// let methodConfigsKey = Symbol('methodConfigsKey');
let methodConfigsKey = 'methodConfigs';

class DecoratorManager{
    constructor(){
        this.targets = {};
        this.methodConfigs = {};
        this.targetConfigs = {};
        this.decorators = {};
        this.methodConfigsKey = methodConfigsKey;
    }
    
    _registerTarget(target){
        if(!target[targetIdKey]){
            target[targetIdKey] = uuid();
        }
        this.targets[target[targetIdKey]] = target;
        return target[targetIdKey];
    }
    
    getTarget(id){
        return this.targets[id];
    }
    getMember(id, name){
        let target = this.getTarget(id);
        if(target){
            return target[name];
        }
        return null;
    }

    _getMethodConfig(id, name){
        let configs = this.methodConfigs;
        if(!configs[id]){
            configs[id] = {};
        }
        if(!configs[id][name]){
            configs[id][name] = {};
        }
        return configs[id][name];
    }
    _getTargetConfig(id){
        let configs = this.targetConfigs;
        if(!configs[id]){
            configs[id] = {};
        }
        return configs[id];
    }

    register(decoratorName, options = { hasArgs: true }){
        let _this = this;
        let {handler, hasArgs} = options;
        assert(decoratorName, 'name and handler must not be empty');
        assert(typeof decoratorName === 'string', 'name must be a string');
        
        this.decorators[decoratorName] = (...rest)=>{
            return (target, name, descriptor)=>{
                let args = rest;
                if(args.length === 0){
                    args = true;
                }
                if(typeof target === 'function'){
                    //class
                    let id = _this._registerTarget(target.prototype);
                    Object.assign(_this._getTargetConfig(id), {
                        [decoratorName]: args,
                    });
                }else{
                    //method
                    let id = _this._registerTarget(target);
                    Object.assign(_this._getMethodConfig(id, name), {
                        [decoratorName]: args,
                    });
                }
                if(typeof handler === 'function'){
                    return handler.apply(this, target, name, descriptor);
                }else{
                    return descriptor;
                }
        }};
        if(!hasArgs){
            this.decorators[decoratorName] = this.decorators[decoratorName]();
        }
        return this.decorators[decoratorName];
    }

    get configs(){
        let configs = {...this.targetConfigs};
        for(let key in configs){
            if(configs.hasOwnProperty(key)){
                let val = configs[key];
                if(val){
                    val[methodConfigsKey] = this.methodConfigs[key];
                }
            }
        }
        return configs;
    }
    forEach(targetHandler, methodHandler){
        this._forEachConfigs(this.configs, (config, targetId, configs)=>{
            let methodConfigs = config[methodConfigsKey];
            if(methodConfigs){
                this._forEachConfigs(methodConfigs, (methodConfig, name, methodConfigs) => {
                    methodHandler(this.getTarget(targetId), name, methodConfig, methodConfigs);
                });
            } 
            targetHandler(this.getTarget(targetId), config, configs);
        });
    }
    _forEachConfigs(configs, handler){
        if(configs){
            for(let key in configs){
                if(configs.hasOwnProperty(key)){
                    if(typeof handler === 'function'){
                    handler.call(this, configs[key], key, configs);
                    }
                }
            }
        }
    }
}

module.exports = DecoratorManager;