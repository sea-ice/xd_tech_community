const isDevelopment = process.env.NODE_ENV === 'development'
const SUBDIRECTORY_PREFIX = isDevelopment ? '' : '/tech_community'
const SERVER_URL_API_PREFIX = `${SUBDIRECTORY_PREFIX}/api`
const SMS_SERVICE_URL_PREFIX = `${SUBDIRECTORY_PREFIX}/sms`

export default {
  USER_TOKEN_STORAGE_NAME: '__t__',
  UUID_STORAGE_NAME: '__uuid__',
  POSTS_PER_PAGE: 10,
  SUBDIRECTORY_PREFIX,
  SERVER_URL_API_PREFIX,
  SMS_SERVICE_URL_PREFIX,
  author: {
    HAS_BEEN_FOLLOWED: 1,
    HAS_FOLLOWED: 2,
    MUTUAL_FOLLOW: 3,
    NO_RELATIONSHIP: 4
  },
  postType: {
    SHARE: 2,
    APPEAL: 3,
    SHARE_PLAIN: 2, // 普通分享帖:0b10
    SHARE_WITH_COINS: 18, // 金币分享帖:0b10010
    APPEAL_PLAIN: 4, // 普通求助帖:0b100
    APPEAL_WITH_COINS: 52 // 悬赏求助帖(悬赏+金币求助帖):0b110100
  },
  objectType: {
    POST: 0
  },
  statusCodes: {
    SERVER_ERROR: -500
  }
}
