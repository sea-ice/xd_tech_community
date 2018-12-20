/**
 * 为不同状态的IconBtn组件生成对应的porps，常用于点赞、关注等操作
 *
 * @export
 * @param {any} num 如果IconBtn文本中不出现数字，则需要给num参数传null
 * @param {any} like
 * @param {string} [action='喜欢']
 * @param {string} [activeColor='#db2d43']
 * @returns
 */
export function getIconBtnToggleProps(
  num, like,
  action = '喜欢',
  activeColor = '#db2d43'
) {
  let newBtnProps = {
    iconBtnText: `${
        num === null ? '' : `${num}人`
      }${
        ((num === null) || num > 0) ? '已' : ''
      }${action}`
  }
  return like ? Object.assign(
    newBtnProps, { iconTheme: 'filled', iconColor: activeColor }) : newBtnProps
}