import { getRandomInt, timeRelativeToNow } from 'utils';


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

/**
 * 将私信信息转化为PrivateMsgItem接收的props格式
 *
 * @export
 * @param {any} {
 *   id,
 *   type,
 *   isRead,
 *   receiverId,
 *   senderId,
 *   nickName,
 *   time,
 *   content,
 * }
 * @returns
 */
export function privateMsgItemStandardProps({
  id,
  type,
  isRead,
  receiverId,
  senderId,
  avator,
  nickName,
  time,
  content,
  ...rest
}) {
  let isReceiver = type === 1 // 当前用户是私信接收者
  return {
    isReceiver,
    time: timeRelativeToNow(time),
    avatar: avator,
    authorId: isReceiver ? senderId : receiverId,
    nickName,
    isRead,
    content,
    id,
    ...rest
  }
}

/**
 * 给定一个数组，为数组中的每项根据getUniqueKey函数自定义的规则设置专属的颜色
 *
 * @export
 * @param {any} items
 * @param {any} getUniqueKey
 * @returns
 */
export function setItemsBgColor(items, getUniqueKey) {
  let colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#6b76ff', '#a96851', '#f3d516', '#ff5959', '#a3a7e4', '#efa35c']
  let colorMap = {}
  let usedColors = []
  for (let item of items) {
    let uniqueKey = getUniqueKey(item)
    if (!colorMap[uniqueKey]) {
      let colorIdx = getRandomInt(colors.length)
      while (!!~usedColors.indexOf(colorIdx)) {
        colorIdx = getRandomInt(colors.length)
      }
      usedColors.push(colorIdx)
      colorMap[uniqueKey] = colors[colorIdx]
    }
    item.avatarBgColor = colorMap[uniqueKey]
  }
  return items
}