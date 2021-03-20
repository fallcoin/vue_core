import { arrayMethods } from "./array";
import { Dep } from "./dep";

class Obsever {
    constructor(data) {
        // 为对象添加__ob__属性，代表已经观测过
        Object.defineProperty(data, '__ob__', {
            enumerable: false,
            configurable: false,
            value: this
        })
        // 当对象为数组时，单独处理
        if (Array.isArray(data)) {
            data.__proto__ = arrayMethods;
            this.observeArray(data);
        } else {
            this.walk(data);
        }
    }
    // 观测数组的每一项
    observeArray(data) {
        data.forEach(item => {
            observe(item);
        })
    }
    // 遍历对象上的每个属性
    walk(data) {
        const keys = Object.keys(data);
        // 为每个属性进行观测
        keys.forEach(key => {
            defineReative(data, key, data[key]);
        });
    }
}

function defineReative(data, key, value) {
    observe(value); // 值有可能也是对象，所以对值进行观测
    let dep = new Dep();    // 每个数据对象对应一个dep
    Object.defineProperty(data, key, {
        get() {
            // 收集依赖
            Dep.target && dep.addSub(Dep.target);   // 此时target指向watcher实例
            return value;
        },
        set(newValue) {
            if (newValue === value) {
                return;
            }
            observe(newValue);  // 新值可能是对象，需要进行观测
            value = newValue;
            // 数据更新时，通知dep中的watcher更新视图
            dep.notify();
        }
    })
}

export function observe(data) {
    // 如果data不是对象或是null，则不进行劫持
    if (typeof data !== 'object' || data === null) {
        return data;
    }
    // data有__ob__表示已经观测过了
    if (data.__ob__) {
        return data;
    }
    // 返回劫持后的对象
    return new Obsever(data);
}