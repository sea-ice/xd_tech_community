import categories from 'config/categoryTags.json'


/**
 * 根据给定的标签列表返回所有包含该标签的`大类的id+标签名称`的格式
 * example:
 *['Javascript', 'Html'] => '0Javascript,1Javascript,1Html'
 *
 * @export
 * @param {*} tags
 * @returns
 */
export function getFullTags(tags) {
  return tags.map(tag => categories.filter(
      c => !!c.tags.find(t => t.name === tag)
    ).map(
      c => `${c.id}${tag}`
    ).join(',')).join(',')
}

/**
 * 将后台返回的label字符串去重
 * @param {*} label 格式为"0Java,1Java,1JavaScript"，已经假设传入的label不为空
 * @returns {Array} 格式为['Java', 'JavaScript']
 */
export function removeDuplicateTags(label) {
  let splitTags = label.split(',')
  let uniqueTags = {}
  splitTags.forEach(tag => {
    let match = tag.match(/\d+([^\d].*)$/)
    uniqueTags[!!match ? match[1] : tag] = true
  })
  return Object.keys(uniqueTags)
}