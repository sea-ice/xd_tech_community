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
    APPEAL: 3
  },
  objectType: {
    POST: 0
  },
  notifyTemplates: {
    '1': {
      // user1_id:

      header: '回复了你的xxx帖子：'
    },
    '2': {
      header: '回复了你的xxx帖子：'
    },
    '3': {
      header: '回复了你在xxx帖子中的yyy评论：'
    },
    '4': {
      // user1_id:
      header: '赞了你的xxx帖子',
      noReply: true,
    },
    '5': {
      header: '赞了你的xxx帖子',
      noReply: true
    },
    '6': {
      header: '赞了你在xxx帖子中的yyy评论：',
      noReply: true
    },
    '7': {
      header: '给你点了赞',
      noReply: true
    },
    '8': {
      header: '收藏了你的xxx帖子',
      noReply: true
    },
    '9': {
      header: '收藏了你的xxx帖子',
      noReply: true
    },
    '10': {
      header: ''
    },
    '11': {
      header: ''
    },
    '12': {
      header: ''
    },
    '13': {
      header: '' // 被举报者的处理结果
    },
    '14': {
      header: '你好，你对xxx的举报我们已经收到，感谢你对社区的日益完善所做的努力！', //
      ignoreContent: true
    }
  }
}
