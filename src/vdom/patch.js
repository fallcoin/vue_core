export function patch(oldVnode, vnode) {
    let el = createElm(vnode);  // 产生真实的结点
    let parentElm = oldVnode.parentNode;    // 获取老的元素的父亲
    parentElm.insertBefore(el, oldVnode.nextSibling);   // 当前产生的新的真实元素插入到旧的结点后面
    parentElm.removeChild(oldVnode);    // 删除老的元素
}

function createElm(vnode) {
    const { tag, children, key, data, text } = vnode;
    if (typeof tag === 'string') {
        // 标签
        vnode.el = document.createElement(tag);
        children.forEach(child => vnode.el.appendChild(createElm(child)));  // 递归
    } else {
        // 文本元素
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}