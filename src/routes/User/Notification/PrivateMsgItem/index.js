import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Avatar, Button, Input, message } from 'antd'

import styles from './index.scss'
import Confirm from 'components/common/Confirm'

@connect(state => ({
  loginUserId: state.user.userId
}))
class NotifyItem extends Component {
  state = {
    showComplete: false,
    replyContent: ''
  }
  constructor(props) {
    super(props)
    this.toggleShowComplete = this.toggleShowComplete.bind(this)
    this.setMsgRead = this.setMsgRead.bind(this)
    this.onReplyContentChange = this.onReplyContentChange.bind(this)
    this.sendReply = this.sendReply.bind(this)
    this.deleteMsg = this.deleteMsg.bind(this)
    this.isRead = !!props.isRead // 查看详情的时候使用
  }
  toggleShowComplete(e) {
    let { showComplete } = this.state
    this.setState({ showComplete: !showComplete })
    let { isReceiver } = this.props
    if (isReceiver && !showComplete && !this.isRead) {
      this.setMsgRead(() => {
        this.isRead = true
      })
    }
    e.stopPropagation()
  }
  setMsgRead(successCallback) {
    let { dispatch, isReceiver, id, content, isRead } = this.props
    if (!isReceiver || isRead) return
    dispatch({
      type: 'privateMsg/setMsgRead',
      payload: {
        msgId: id,
        setReadImmediately: content.length <= 60, // 查看详情点击之后文字不立即置灰
        successCallback
      }
    })
  }
  onReplyContentChange(e) {
    this.setState({ replyContent: e.target.value })
  }
  sendReply() {
    return new Promise((resolve, reject) => {
      let { replyContent } = this.state
      if (!replyContent.trim()) {
        message.error('请输入回复内容！')
        return reject()
      }
      let { dispatch, isReceiver, loginUserId, authorId, id, replyId } = this.props
      if (!isReceiver) id = replyId // 如果是追加回复，则回复的消息id为当前消息的replyId
      dispatch({
        type: 'privateMsg/reply',
        payload: {
          senderId: loginUserId,
          receiverId: authorId,
          content: replyContent,
          msgId: id,
          successCallback() {
            message.success('回复成功！')
            resolve(true)
          },
          failCallback() {
            message.success('操作失败，请稍后再试！')
            reject()
          }
        }
      })
    })
  }
  deleteMsg() {
    let { dispatch, id, isReceiver, updateCurrentPage } = this.props
    dispatch({
      type: 'privateMsg/deleteMsg',
      payload: {
        msgId: id,
        type: isReceiver ? 1 : 0, // 如果是发送者，type传0，否则传1
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
      isReceiver,
      time,
      avatar,
      avatarBgColor,
      nickName,
      isRead,
      content,
      replyId
    } = this.props
    let { showComplete, replyContent } = this.state
    return (
      <div className={(isReceiver && isRead) ? styles.read : styles.notifyItem}>
        <div className={styles.avatarWrapper}>
          <Avatar
            style={{ backgroundColor: avatar ? '#fff' : avatarBgColor, verticalAlign: 'middle' }}
            src={avatar} shape="square" size={80}
          >{nickName}</Avatar>
        </div>
        <main className={styles.main}>
          <div
            className={styles.contentWrapper}
            style={{ cursor: ((content.length <= 60) && isReceiver) ? 'pointer' : 'auto' }}
            onClick={this.setMsgRead}
          >
            <header className={styles.header}>
              <h4 className={styles.title}>{
                isReceiver ? (
                  <React.Fragment>
                    <strong>{nickName}</strong>&nbsp;
                    {replyId === -1 ? `给你发了一封私信` : `回复了你的私信`}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {replyId === -1 ? `已发送至：` : `已回复：`}
                    &nbsp;<strong>{nickName}</strong>
                  </React.Fragment>
                )}
              </h4>
              <time>{time}</time>
            </header>
            {
              content.length > 60 ? (
                <div className={styles.summaryWithDetails}>
                  <p className={styles.summary}>
                    {showComplete ? content : `${content.slice(0, 60)}...`}
                  </p>
                  <a
                    href="javascript:void(0);"
                    className="showDetailsBtn"
                    onClick={this.toggleShowComplete}
                  >{showComplete ? '收起' : '查看详情'}</a>
                </div>
              ) : (
                <p className={isReceiver ? styles.clickableSummary : styles.summary}>{content}</p>
              )
            }
          </div>
          <div className={styles.btnWrapper}>
            {
              (isReceiver || (replyId !== -1)) ? (
                <div className={styles.btn}>
                  <Confirm
                    triggerModalBtn={<Button type="primary" block>{isReceiver ? '' : '追加'}回复</Button>}
                    modalTitle="回复私信"
                    confirmBtnText="发送"
                    handleOk={this.sendReply}
                  >
                    <p>回复&nbsp;<strong>{nickName}</strong>&nbsp;的私信：</p>
                    <Input.TextArea
                      placeholder="请输入回复内容"
                      value={replyContent}
                      onChange={this.onReplyContentChange}></Input.TextArea>
                  </Confirm>
                </div>
              ) : null
            }
            <div className={styles.btn}>
              <Button block onClick={this.deleteMsg}>删除</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

NotifyItem.propTypes = {
};

export default NotifyItem;
