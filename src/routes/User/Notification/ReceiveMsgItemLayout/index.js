import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Avatar, Button, message } from 'antd'

import styles from './index.scss'
import config from 'config/constants'

@connect(state => ({
  loginUserId: state.user.userId
}))
class ReceiveMsgItemLayout extends Component {
  state = {
    showComplete: false
  }
  constructor(props) {
    super(props)
    this.toggleShowComplete = this.toggleShowComplete.bind(this)
    this.setMsgRead = this.setMsgRead.bind(this)
    this.onShortMsgItemClick = this.onShortMsgItemClick.bind(this)
    this.deleteMsg = this.deleteMsg.bind(this)
    this.isRead = !!props.isRead // 查看详情的时候使用，和实际消息是否已读保持同步
  }
  onShortMsgItemClick() {
    let { content } = this.props
    if (content.length > 60) return
    // 只处理短消息，长消息通过点击详情按钮设置已读状态
    this.setMsgRead()
  }
  toggleShowComplete(e) {
    let { showComplete } = this.state
    this.setState({ showComplete: !showComplete })
    if (!showComplete && !this.isRead) {
      this.setMsgRead(() => {
        this.isRead = true
      })
    }
    e.stopPropagation()
  }
  setMsgRead(successCallback) {
    let { dispatch, msgType, loginUserId, msgId, content, isRead } = this.props
    if (isRead) return
    console.log(`content: ${content}`)
    dispatch({
      type: `${msgType}/setMsgRead`,
      payload: {
        userId: loginUserId,
        msgId,
        setReadImmediately: content.length <= 60, // 查看详情点击之后文字不立即置灰
        successCallback
      }
    })
  }
  deleteMsg() {
    let { dispatch, msgType, msgId, updateCurrentPage } = this.props
    dispatch({
      type: `${msgType}/deleteMsg`,
      payload: {
        msgId,
        successCallback: () => {
          updateCurrentPage()
          message.success('删除成功！')
        },
        failCallback() {
          message.success('删除失败，请稍后再试！')
        }
      }
    })
  }
  render() {
    let {
      time,
      avatar,
      avatarBgColor,
      nickName,
      isRead,
      header,
      content,
      btnGroup = null,
      extraContent
    } = this.props
    let { showComplete } = this.state
    let isClickable = (content.length <= 60) && !isRead
    avatar = avatar === undefined ? `${config.SUBDIRECTORY_PREFIX}/assets/sys_avatar.png` : avatar

    return (
      <div className={isRead ? styles.read : styles.notifyItem}>
        <main className={styles.main}>
          <div
            className={styles.contentWrapper}
            style={{ cursor: isClickable ? 'pointer' : 'auto' }}
            onClick={this.onShortMsgItemClick}
          >
            <header className={styles.header}>
              <h4 className={styles.title}>{header}</h4>
              <time>{time}</time>
            </header>
            {!!extraContent ? (
              <div className={styles.extraContent}>{extraContent}</div>
            ) : null}
            {
              !!content ? content.length > 60 ? (
                <div className={styles.summaryWithDetails}>
                  <p className={styles.summary}>
                    <span>{showComplete ? content : `${content.slice(0, 60)}...`}</span>
                    <a
                      href="javascript:void(0);"
                      className={styles.showDetailsBtn}
                      onClick={this.toggleShowComplete}
                    >{showComplete ? '收起' : '查看详情'}</a>
                  </p>
                </div>
              ) : (
                <p className={isClickable ? styles.clickableSummary : styles.summary}>{content}</p>
              ) : null
            }
          </div>
          <div className={styles.btnWrapper}>
            { btnGroup }
            <div className={styles.btn}>
              <Button block onClick={this.deleteMsg}>删除</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

ReceiveMsgItemLayout.propTypes = {
  msgType: PropTypes.string,
  msgId: PropTypes.number,
  header: PropTypes.node,
  content: PropTypes.string,
  time: PropTypes.string,
  isRead: PropTypes.bool,
  btnGroup: PropTypes.node // 可选
  // extraContent, avatar和avatarBgColor均可选
};

export default ReceiveMsgItemLayout;
