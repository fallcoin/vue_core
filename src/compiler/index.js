import { generate } from "./generate";
import { parseHTML } from "./parse";
export function compileToFunctions(template) {
    // html模板 =》 render函数
    // 1.将html模板转换为ast语法树
    const ast = parseHTML(template);
    // 2.优化静态结点
    // 3.通过这颗ast树转化成代码
    const code = generate(ast);
    // 4.将字符串变成render函数
    const render = new Function(`with(this){return ${code}}`);

    return render;
}