import { getDataValueByExpr } from "../compiler/util";
import { Dep } from "./dep";

export class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        this.oldExpValue = this.getOldExpValue();
    }
    getOldExpValue() {
        Dep.target = this;  // 把target指向watcher实例
        const old = getDataValueByExpr(this.vm, this.expr); // 此时会去取数据，会创建该数据的dep实例
        Dep.target = null;  // target指向复位
        return old;
    }
    update() {
        const newValue = getDataValueByExpr(this.vm, this.expr);
        if (newValue !== this.oldExpValue) {
            this.cb(newValue);
        }
    }
}