import htmlParser from 'htmlparser2'

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


export const getPostExcerpt = (() => {
  let targetText = false
  let excerpt = ''
  let parser
  let isTable = false

  /**
   * 获取帖子内容的摘要
   * lengthLimit为0表示对提取的摘要长度不进行限制
   */
  return (html, lengthLimit = Infinity, includeTags = ['blockquote', 'p']) => {
    if (!html) return ''
    parser = parser || new htmlParser.Parser({
      onopentag(name, attrs) {
        if (
          !isTable &&
          !!~includeTags.indexOf(name) &&
          excerpt.length < lengthLimit
        ) {
          targetText = true
        } else if (name === 'table') {
          isTable = true
        }
      },
      ontext(text) {
        if (targetText) {
          excerpt += `${!!excerpt ? ' ' : ''}${text}`
        }
      },
      onclosetag(name) {
        if (!!~includeTags.indexOf(name)) {
          targetText = false
        } else if (name === 'table') {
          isTable = false
        }
      }
    }, { decodeEntities: true })
    parser.write(html)
    parser.end()

    let result = excerpt.slice(0, lengthLimit)
    excerpt = ''

    return result
  }
})()

