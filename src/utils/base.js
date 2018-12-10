
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
