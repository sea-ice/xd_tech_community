
/**
 * 判断两个数组是否具有完全相同的元素
 *
 * @export
 * @param {*} src
 * @param {*} dest
 * @returns
 */
export function hasSameElements (src, dest) {
  if (src.length !== dest.length) return false

  dest.sort()
  return src.sort().every((s, i) => dest[i] === s)
}

/**
 * 处理类型为生成器的回调函数，对外统一使用生成器函数进行调用
 * @param {*} fn
 * @param {*} args
 */
export function* safeCallback(fn, ...args) {
  let isGenerator = typeof fn === 'function' &&
    Object.getPrototypeOf(fn) !== Object.getPrototypeOf(Function)
  return isGenerator ? (yield fn(...args)) : fn(...args)
}