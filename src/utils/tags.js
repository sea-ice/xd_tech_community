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
export function getFullTags (tags) {
  return tags.map(tag => categories.filter(
      c => !!c.tags.find(t => t.name === tag)
    ).map(
      c => `${c.id}${tag}`
    ).join(',')).join(',')
}
