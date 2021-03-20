export function getDataValueByExpr(vm, expr) {
    expr.split('.').reduce((data, current) => {
        return data[current];
    }, vm._data)
}