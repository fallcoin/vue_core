const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;    // 插值表达式
// 处理属性
function genProps(attrs) {
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        // 当属性为style时单独处理
        if (attr.name === 'style') {
            const obj = {};
            attr.value.split(';').forEach(item => {
                const [key, value] = item;
                obj[key] = value;
            });
            attr.value = obj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`;
    }
    return `{${str.slice(0, -1)}}`; // 最后多了一个,
}
function getChildren(el) {
    const children = el.children;
    if (children) {
        return children.map(child => gen(child)).join(','); // 将转化后的孩子用,连接
    }
}
function gen(node) {
    if (node.type == 1) {   // 如果当前ast元素是结点
        return generate(node);
    } else {
        const text = node.text;
        // 不带插值表达式
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`;
        }

        const tokens = [];   // 每个{{}}里面的代码
        let lastIndex = defaultTagRE.lastIndex = 0;
        // lastIndex只会位于开始位置或插值表达式的结束位置
        // 如果正则是全局模式，需要每次重置为0
        let match,  // 每次匹配到的结果
            index;
        while (match = defaultTagRE.exec(text)) {
            index = match.index;    // 保存匹配到的索引
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)));  // 纯文本
            }
            tokens.push(`_s(${match[1].trim()})`);  // 匹配到的插值表达式
            lastIndex = index + match[0].length;    // 更新lastIndex的位置
        }
        // 匹配完结尾还有一段纯文本
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return `_v(${tokens.join('+')})`;
    }
}
// 把ast转化为render函数
export function generate(ast) {
    const children = getChildren(ast);
    const code = `_c('${ast.tag}', ${ast.attrs.length ? `${genProps(ast.attrs)}` : 'undefined'}${children ? `,${children}` : ''})`;
    return code;
}