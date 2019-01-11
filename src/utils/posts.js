import config from 'config/constants'
import { getFullTags } from 'utils'

export function fillPostListPayload (userInfo, postType, page, tags=[]) {
  // 用户是否登录
  // 帖子类型：分享帖、求助帖
  // url：根据帖子类型和用户是否登录确定
  // 帖子列表请求参数：
  // page：传递的payload.params中已给定
  // userId：仅在用户已登录的情况下传递
  // label：tags参数
  let params = { page, number: config.POSTS_PER_PAGE }
  let payload = { postType, params }
  payload.url = postType === 'share' ?
    `${config.SERVER_URL_API_PREFIX}/article/getShareRecommend/LoadMore` :
    `${config.SERVER_URL_API_PREFIX}/article/getHelpRecommend/LoadMore`
  params.label = !!tags ? getFullTags(tags) : ''
  if (userInfo) {
    params.userId = userInfo.userId
    params.cookie = ''
  } else {
    params.userId = 1
    params.cookie = window.localStorage.getItem(config.UUID_STORAGE_NAME)
  }
  return payload
}
/**
 * 将应用中正在编辑的帖子状态转化为后端所需要的字段格式
 *
 * @export
 * @param {any} payload
 */
export function getInterfaceDraftFormat(payload) {
  let { articleId, userId, type, title, content, selectedTags, setShareCoins, setAppealCoins, coinsForAcceptedUser, coinsPerJointUser, jointUsers } = payload
  let postTypes = config.postType
  if (type === postTypes.SHARE) {
    type = postTypes[setShareCoins ? 'SHARE_WITH_COINS' : 'SHARE_PLAIN']
  } else if (type === postTypes.APPEAL) {
    type = postTypes[setAppealCoins ? 'APPEAL_WITH_COINS' : 'APPEAL_PLAIN']
  }
  return {
    articleId,
    userId,
    type,
    title,
    content, // html字符串
    label: getFullTags(selectedTags),
    image: '-1',
    createTime: '' + Date.now(),
    coin: coinsPerJointUser,
    coinPersonNum: jointUsers,
    reward: coinsForAcceptedUser
  }
}

/**
 * 将后台的帖子数据格式转化为store保存的格式
 *
 * @export
 * @param {any} response
 * @returns
 */
export function getStoreDraftFormat(response) {
  let { articleId, type, title, content, label, image, coin, coinPersonNum, reward } = response
  let postTypes = config.postType
  let setShareCoins = type === postTypes.SHARE_WITH_COINS
  let setAppealCoins = type === postTypes.APPEAL_WITH_COINS

  if (
    setShareCoins ||
    (type === postTypes.SHARE_PLAIN)
  ) {
    type = postTypes.SHARE
  } else if (
    setAppealCoins ||
    (type === postTypes.APPEAL_PLAIN)
  ) {
    type = postTypes.APPEAL
  }
  return {
    articleId,
    type,
    title,
    content,
    selectedTags: !!label ? label.split(',') : [],
    setShareCoins,
    setAppealCoins,
    coinsForAcceptedUser: reward,
    coinsPerJointUser: coin,
    jointUsers: coinPersonNum
  }
}
