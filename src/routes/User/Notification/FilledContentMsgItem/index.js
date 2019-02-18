import React, { Component } from 'react'
import dayjs from 'dayjs'
import { connect } from 'dva'

import ReceiveMsgItemLayout from '../ReceiveMsgItemLayout'
import { msgTemplates } from './msgItem.config'

const getReceiveMsgItemProps = ({ msgType, updateCurrentPage, ...rest }) => {
  if (msgType === 'userMsgs') {
    let { object, type, isRead } = rest
    let { header, content, extraContent, btnGroup = null } = msgTemplates[type]
    let { time, nickName, avator, notificationId } = object
    header = header(object, rest)
    content = !!content ? content(object) : content !== null ? object.content : ''
    extraContent = !!extraContent ? extraContent(object) : null
    btnGroup = btnGroup && btnGroup(object, rest)
    return {
      msgType,
      msgId: notificationId,
      avatar: avator,
      nickName,
      header,
      time: dayjs(Number(time)).format('YYYY年MM月DD日 HH:mm'),
      content,
      extraContent,
      btnGroup,
      isRead: !!isRead,
      updateCurrentPage
    }
  } else if (msgType === 'sysMsgs') {
    let { id, time, isRead, content } = rest
    return {
      msgType,
      msgId: id,
      header: '',
      time: dayjs(Number(time)).format('YYYY年MM月DD日 HH:mm'),
      content,
      isRead: !!isRead,
      updateCurrentPage
    }
  }
}

@connect(state => ({
  loginUserId: state.user.userId
}))
class FilledContentMsgItem extends Component {
  render() {
    return <ReceiveMsgItemLayout {...getReceiveMsgItemProps(this.props)} />
  }
}

export default FilledContentMsgItem