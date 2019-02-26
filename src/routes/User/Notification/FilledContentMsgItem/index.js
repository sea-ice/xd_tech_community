import React, { Component } from 'react'
import { connect } from 'dva'
import { Avatar } from 'antd'

import ReceiveMsgItemLayout from '../ReceiveMsgItemLayout'
import { msgTemplates } from './msgItem.config'
import { timeRelativeToNow } from 'utils'
import config from 'config/constants'
import styles from './index.scss'

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
      time: timeRelativeToNow(time),
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
      header: <div className={styles.avatarWrapper}>
        <Avatar
          src={`${config.SUBDIRECTORY_PREFIX}/assets/sys_avatar.png`}
          shape="circle" size={36}
        ></Avatar>
        <strong>源来官方</strong>
        <i
          className={styles.crown}
          style={{ backgroundImage: `url(${config.SUBDIRECTORY_PREFIX}/assets/crown.svg)` }}></i>
      </div>,
      time: timeRelativeToNow(time),
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