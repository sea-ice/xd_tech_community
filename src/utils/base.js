
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
 * 随机生成给定范围内的整数，包含start，但不包含end
 *
 * @export
 * @param {any} start
 * @param {any} end
 * @returns
 */
export function getRandomInt(start, end) {
  if (end === undefined) {
    end = start
    start = 0
  }
  return Math.floor(start + (end - start) * Math.random())
}

/**
 * 处理类型为生成器的回调函数，对外统一使用生成器函数进行调用
 * @param {*} fn
 * @param {*} args
 */
export function* safeCallback(fn, ...args) {
  let isGenerator = typeof fn === 'function' &&
    Object.getPrototypeOf(fn) !== Object.getPrototypeOf(Function)
  return isGenerator ? (yield* fn(...args)) : fn(...args)
}

/**
 * 计算给定时间time相对于relativeTo时间之间的差值，
 * 并以'xxx小时|天|周|月前/后'的格式返回
 *
 * @export
 * @param {any} time
 * @param {any} relativeTo
 * @returns
 */
export function differTime(time, relativeTo) {
  let isBefore = time.isBefore(relativeTo)
  let diffPostfix = isBefore ? '前' : '后'
  let units = [{
    unit: 'seconds',
    limit: 59,
    text: '秒'
  }, {
    unit: 'minutes',
    limit: 59,
    text: '分钟'
  }, {
    unit: 'hours',
    limit: 23,
    text: '小时'
  }, {
    unit: 'days',
    limit: 6,
    text: '天'
  }, {
    unit: 'weeks',
    limit: 4,
    text: '周'
  }, {
    unit: 'months',
    limit: 11,
    text: '个月'
  }, {
    unit: 'years',
    text: '年'
  }]
  let result
  for (let i = 0, len = units.length; i < len; i++) {
    let diff = Math.abs(time.diff(relativeTo, units[i].unit))
    if (units[i].limit) {
      if (diff > units[i].limit) {
        continue
      } else {
        result = diff + units[i].text
        break
      }
    } else {
      result = diff + units[i].text
    }
  }
  return result + diffPostfix
}