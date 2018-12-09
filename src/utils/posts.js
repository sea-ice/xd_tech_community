import config from 'config/constants'
import {getFullTags} from 'utils'

export function fillPostListPayload (userInfo, postType, page, tags=[]) {
  // 用户是否登录
  // 帖子类型：分享帖、求助帖
  // url：根据帖子类型和用户是否登录确定
  // 帖子列表请求参数：
  // page：传递的payload.params中已给定
  // userId：仅在用户已登录的情况下传递
  // label：tags参数
  let params = {page, number: config.POSTS_PER_PAGE}
  let payload = {postType, params}
  if (userInfo) {
    payload.url = postType === 'share' ? '/api/article/getShareRecommend/LoadMore' : '/api/article/getHelpRecommend/LoadMore'
    params.userId = userInfo.userId
    params.label = tags.length ? getFullTags(tags) : ''
  } else {
    // params.label = ''
  }
  return payload
}
