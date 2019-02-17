import React, { Component } from 'react'
import dayjs from 'dayjs'

import ReceiveMsgItemLayout from '../ReceiveMsgItemLayout'
import { msgTemplates } from './msgItem.config'

const getReceiveMsgItemProps = ({ msgType, ...rest }) => {
  if (msgType === 'userMsgs') {
    let { object, type, isRead } = rest
    let { header, content, extraContent } = msgTemplates[type]
    let { time, nickName, avator, notificationId } = object
    header = header(object)
    content = !!content ? content(object) : content !== null ? object.content : ''
    extraContent = !!extraContent ? extraContent(object) : null
    return {
      msgType,
      msgId: notificationId,
      avatar: avator,
      nickName,
      header,
      time: dayjs(Number(time)).format('YYYY年MM月DD日 HH:mm'),
      content,
      extraContent,
      isRead: !!isRead
    }
  } else if (msgType === 'sysMsgs') {
    let { id, time, isRead, content } = rest
    return {
      msgType,
      msgId: id,
      header: '',
      time: dayjs(Number(time)).format('YYYY年MM月DD日 HH:mm'),
      content,
      isRead: !!isRead
    }
  }
}

export default class FilledContentMsgItem extends Component {
  render() {
    return <ReceiveMsgItemLayout {...getReceiveMsgItemProps(this.props)} />
  }
}