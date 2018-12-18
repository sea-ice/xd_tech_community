const isDevelopment = process.env.NODE_ENV === 'development'
const SUBDIRECTORY_PREFIX = isDevelopment ? '' : '/tech_community'
const SERVER_URL_API_PREFIX = `${SUBDIRECTORY_PREFIX}/api`
const SMS_SERVICE_URL_PREFIX = `${SUBDIRECTORY_PREFIX}/sms`

export default {
  USER_TOKEN_STORAGE_NAME: '__t__',
  POSTS_PER_PAGE: 10,
  SUBDIRECTORY_PREFIX,
  SERVER_URL_API_PREFIX,
  SMS_SERVICE_URL_PREFIX
}
