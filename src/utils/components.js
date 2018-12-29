import dayjs from 'dayjs'
import { getRandomInt } from 'utils';
import ProvinceJSONData from 'config/province'
import CityJSONData from 'config/city'
import SchoolJSONData from 'config/school'

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
    time: dayjs(Number(time)).format('YYYY年MM月DD日 HH:mm'),
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

/**
 * 级联菜单数据（学校）,转化成
 * [{value: '广东省', label: '广东省', children: [{
 * value: '中山大学', label: '中山大学'}, {
 * value: '华南理工大学', label: '华南理工大学'},
 * ...]}]格式
 *
 * @export
 */
export function getSchoolOptions() {
  let { p } = ProvinceJSONData
  console.log(ProvinceJSONData)
  return p.map(tuple => ({
    value: tuple[1],
    label: tuple[1],
    children: (SchoolJSONData[tuple[0]] || []).map(school => ({
      value: school,
      label: school
    }))
  }))
}

/**
 * 返回给定学校名称所在的省份
 *
 * @export
 * @param {any} s
 */
export function findSchoolInfo(s) {
  let p = ProvinceJSONData.p.find(
    p => !!~(SchoolJSONData[p[0]] || []).indexOf(s))
  return [p ? p[1] : null, s]
}

/**
 * 地区选项级联菜单数据，转化成
 * [{value: '广东', label: '广东', children: [{
 * value: '汕头', label: '汕头'}, {
 * value: '广州', label: '广州'},
 * ...]}]格式
 *
 * @export
 */
export function getLocationOptions() {
  console.log('getlocationOptions')
  console.log(CityJSONData)
  let { citylist } = CityJSONData
  return citylist.map(province => ({
    value: province.p,
    label: province.p,
    children: province.c.map(city => ({
      value: city.n,
      label: city.n
    }))
  }))
}

/**
 * 将给定表示地区的字符串在省份和城市之间断开
 *
 * @export
 * @param {any} l
 * @returns {Array} ['province', 'city']
 */
export function locationSplit(l) {
  let splitPos = !!l.match(/^(黑龙江|内蒙古)/) ? 3 : 2
  return [l.slice(0, splitPos), l.slice(splitPos)]
}