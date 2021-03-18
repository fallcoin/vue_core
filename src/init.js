import { compileToFunctions } from "./compiler/index";
import { mountComponent } from "./lifecycle";
import { initState } from "./state";

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options;
        // 初始化状态,vue组件中的状态：data，props，watch
        initState(vm);
        // 如果当前有el属性说明要渲染模板
        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }

    }
    // 挂载
    Vue.prototype.$mount = function (el) {
        const vm = this;
        const options = vm.$options;
        vm.$el = el = document.querySelector(el);

        // 没render将template转化为render方法
        if (!options.render) {
            let template = options.template;
            if (!template && el) {
                template = el.outerHTML;
            }
            const render = compileToFunctions(template);
            options.render = render;
        }
        // 挂载这个组件
        mountComponent(vm, el);
    }
}