import { observe } from "./observe/index";

export function initState(vm) {
    const opts = vm.$options;
    if (opts.props) {
        initProps(vm);
    }
    if (opts.data) {
        initData(vm);
    }
    if (opts.watch) {
        initWatch(vm);
    }
    if (opts.methods) {
        initMethods(vm);
    }
    if (opts.computed) {
        initComputed(vm);
    }
}

function initProps() {

}
function initMethods() {

}
function initWatch() {

}
function initComputed() {

}
function initData(vm) {
    let data = vm.$options.data;
    vm._data = data = typeof data === 'function' ? data.call(vm) : data;

    // 当去vm上取属性的时候，把属性的取值代理到vm._data上
    for (const key in data) {
        proxy(vm, '_data', key);
    }
    // 劫持对象
    observe(data);
}

function proxy(target, data, key) {
    Object.defineProperty(target, key, {
        get() {
            return target[data][key];
        },
        set(newValue) {
            vm[data][key] = newValue;
        }
    });
}