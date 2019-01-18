import ProvinceJSONData from 'config/province'
import CityJSONData from 'config/city'
import SchoolJSONData from 'config/school'

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