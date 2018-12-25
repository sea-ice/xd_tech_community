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
  params.label = tags && tags.length ? getFullTags(tags) : ''
  if (userInfo) {
    params.userId = userInfo.userId
    params.cookie = ''
  } else {
    params.userId = 1
    params.cookie = window.localStorage.getItem(config.UUID_STORAGE_NAME)
  }
  return payload
}
