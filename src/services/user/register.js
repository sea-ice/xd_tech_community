import config from 'config/constants'
import smsConfig from 'config/secret.config'
import { request } from 'utils'

export function getSmsCode ({phone}) {
  return request(
    `${config.SMS_SERVICE_URL_PREFIX}/1.1/requestSmsCode`, {
    method: 'POST',
    body: JSON.stringify({
      mobilePhoneNumber: phone,
      name: '西电技术社区',
      op: '注册'
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-LC-Id': smsConfig.LEANCLOUD_SMS_ID,
      'X-LC-Key': smsConfig.LEANCLOUD_SMS_KEY
    }
  })
}

export function verifySmsCode ({phone, code}) {
  return request(
    `${
      config.SMS_SERVICE_URL_PREFIX
    }/1.1/verifySmsCode/${encodeURIComponent(code)}`, {
    method: 'POST',
    body: JSON.stringify({
      mobilePhoneNumber: phone
    }),
    headers: {
      'Content-Type': 'application/json',
      'X-LC-Id': smsConfig.LEANCLOUD_SMS_ID,
      'X-LC-Key': smsConfig.LEANCLOUD_SMS_KEY
    }
  })
}
