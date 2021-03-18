export function renderMixin(Vue) {
    // 创建元素
    Vue.prototype._c = function () {
        return createElement(...arguments);
    }
    // 将插值表达式的变量转为字符串
    Vue.prototype._s = function (val) {
        return val === null ? '' : (typeof val === 'object') ? JSON.stringify(val) : val;
    }
    // 创建文本元素
    Vue.prototype._v = function (text) {
        return createTextVnode(text)
    }
    Vue.prototype._render = function () {
        const vm = this;
        const render = vm.$options.render;
        const vnode = render.call(vm);
        return vnode;
    }
}

function createElement(tag, data = {}, ...children) {
    return vnode(tag, data, data.key, children);
}

function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
}
// 用来产生虚拟dom
function vnode(tag, data, key, children, text) {
    return {
        tag,
        data,
        key,
        children,
        text
    }
}