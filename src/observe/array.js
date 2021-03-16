const oldArrayMethods = Array.prototype;
const methods = ['sort', 'splice', 'push', 'shift', 'unshift', 'reverse', 'pop'];   // 这7个方法会改变原始的数组

export const arrayMethods = Object.create(oldArrayMethods);

// 重写数组的这7个方法
methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        const result = oldArrayMethods[method].apply(this, args);   // this指向observer里的data
        let ob = this.__ob__;
        let inserted; // 新增的数据
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);   // 当splice有第3个以上（包括3个）的参数时，说明有新增的数据
            default:
                break;
        }
        if (inserted) {
            ob.observeArray(inserted);
        }
        return result;
    }
})