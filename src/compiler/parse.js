const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;  // 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;    // <a:b>
const startTagOpen = new RegExp(`^<${qnameCapture}`);   // 开始标签的开头
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);    // 结束标签的开头
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/   // 属性
const startTagClose = /^\s*(\/?)>/;  // 标签结尾

export function parseHTML(html) {
    function createASTElement(tagName, attrs) {
        return {
            tag: tagName,
            type: 1,
            children: [],
            attrs,
            parent: null
        }
    }
    let root;   // ast树
    let currentParent;  // 当前解析的标签
    const stack = [];
    function start(tagName, attrs) {
        const element = createASTElement(tagName, attrs);
        if (!root) {    // 没根则这个元素为根
            root = element;
        }
        currentParent = element;
        stack.push(element);
    }
    function end(tagName) {
        const element = stack.pop();    // 匹配到结束标签时出栈
        if (tagName !== element.tag) {
            throw new Error("标签错误");
        }
        currentParent = stack[stack.length - 1];    // 更新当前解析的标签，当前解析的标签应为栈顶元素
        // 确定元素间的父子关系
        if (currentParent) {
            element.parent = currentParent;
            currentParent.children.push(element);
        }
    }
    function chars(text) {
        text = text.trim();
        if (text) {
            currentParent.children.push({
                type: 3,
                text
            })
        }
    }

    // 只要html不为空就一直解析，解析一部分删掉一部分
    while (html) {
        // <div>hello</div>
        let textEnd = html.indexOf('<');
        // 肯定是标签
        if (textEnd === 0) {
            // 处理开始标签
            const startTagMatch = parseStartTag();
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }
            // 处理结束标签
            const endTagMatch = html.match(endTag);
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                end(endTagMatch[1]);
                continue;
            }
        }
        // 文本
        let text;
        if (textEnd > 0) {
            text = html.substring(0, textEnd);  // 到下一个标签开头< 的文本内容
        }
        if (text) {
            advance(text.length);   // 删掉匹配到的文本
            chars(text);
        }
    }
    // 截取html，更新内容
    function advance(n) {
        html = html.substring(n);
    }
    // 解析开始标签
    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length);   // 删去了<div
            // 处理属性
            let end, attr;
            // 当没有遇到 > 的时候且能匹配到属性
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                })
                advance(attr[0].length); // 去掉当前属性
            }
            // 删除 >
            if (end) {
                advance(end[0].length);
                return match;
            }
        }
    }

    return root;
}