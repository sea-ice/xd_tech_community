import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Popover, message } from 'antd'
import dayjs from 'dayjs'

import { getIconBtnToggleProps } from 'utils'

import styles from './index.scss'
import config from 'config/constants'
import ReportBtn from 'components/User/ReportBtn'
import IconBtn from 'components/common/IconBtn'
import CommentBox from '../CommentBox'
import Debounce from 'components/common/Debounce'
import ConfirmIfNotMeet from 'components/common/ConfirmIfNotMeet'

@connect(state => ({
  comments: state.postDetails.comments
}))
class ReplyItem extends Component {
  state = {
    showReplyBox: false,
    replyContent: ''
  };
  constructor (props) {
    super(props)
    this.toggleCommentBox = this.toggleCommentBox.bind(this)
    this.toggleReplies = this.toggleReplies.bind(this)
    this.updateReplyAcceptState = this.updateReplyAcceptState.bind(this)
    this.onReplyContentChange = this.onReplyContentChange.bind(this)
    this.publishReply = this.publishReply.bind(this)
    this.replyInput = React.createRef()
  }
  toggleCommentBox () {
    this.setState(
      { showReplyBox: !this.state.showReplyBox }, () => {
      this.focusReplyBox()
    })
  }
  toggleReplies () {
    this.props.toggleReplies()
  }
  focusReplyBox() {
    this.setState({ replyContent: '' }) // 清除输入框中的内容
    this.replyInput.current.focus()
  }
  updateReplyAcceptState() {
    let { dispatch, replyInfo, comments } = this.props
    let { commentsv1Id, commentsv2Id } = replyInfo
    dispatch({
      type: 'comment/updateReplyAcceptState',
      payload: {
        commentsv1Id,
        commentsv2Id,
        comments
      }
    })
  }
  onReplyContentChange(e) {
    this.setState({ replyContent: e.target.value })
  }
  publishReply(content) {
    let { dispatch, loginUserId, replyInfo } = this.props
    let { commentsv1Id, commentNum } = replyInfo

    dispatch({
      type: 'comment/publishComment',
      payload: {
        // objectId: !!rootComment ? commentsv1Id : commentsv2Id,
        objectId: commentsv1Id,
        userId: loginUserId,
        content,
        reply: true,
        total: commentNum + 1,
        successCallback: () => {
          message.success('回复成功')
          this.setState({ replyContent: '', showReplyBox: false })
        }
      }
    })
  }

  render () {
    let {
      loginUserId,
      replyInfo,
      rootComment,
      open
    } = this.props
    // 如果是一级评论，则replyInfo只具有commentsv1Id，如果是评论的评论，
    // 则同时具有commentsv1Id和commentsv2Id
    let { nickName, avator, commentNum, commentsv1Id, commentsv2Id,
      content, isAccept, approvalNum, time, userId } = replyInfo
    let replyId = !!rootComment ? commentsv1Id : commentsv2Id
    console.log(this.props.comments)

    let commonIconOpt = {
      type: 'icon',
      color: '#666',
      btnPadding: '.2rem',
      iconSize: 20,
      fontSize: 16
    }
    let { showReplyBox, replyContent } = this.state
    return (
      <section className={styles.replyItem}>
        <main className={styles.replyMain}>
          <header className={styles.replyItemHeader}>
            <p className={styles.publisherInfo}>
              <IconBtn
                type="avatar"
                avatarSize={36}
                avatarURL={avator}
                color="#333"
                iconBtnText={nickName}
                btnPadding={0} />
              <time>{dayjs(Number(time)).format('YYYY年MM月DD日 HH:mm')}</time>
            </p>
            {
              rootComment &&
              <p className="commentNumber">#&nbsp;{rootComment}</p>
            }
          </header>
          <p className={styles.commentContent}>{content}</p>
          <footer className={styles.replyItemFooter}>
            <div className={styles.iconBtns}>
              {
                !!rootComment ? (
                  <Debounce
                    btnProps={getIconBtnToggleProps(approvalNum, isAccept, '赞同', '#1890ff')}
                    actionType="userBehaviors/approval"
                    extraPayload={{ type: 2, objectId: replyId, like: !isAccept }}
                    userId={loginUserId}
                    update={this.updateReplyAcceptState}
                    btn={
                      <IconBtn iconType="like" {...commonIconOpt} />
                    }
                  />
                ) : null
              }
              {
                loginUserId === userId ? null : (
                  <ConfirmIfNotMeet
                    condition={!!loginUserId}
                    callbackWhenMeet={this.toggleCommentBox}
                    btn={<IconBtn iconType="message" iconBtnText="回复" {...commonIconOpt} />} />
                )
              }
              {
                (!!rootComment && commentNum) ? (
                  <IconBtn
                    iconType={open ? 'caret-down' : 'caret-up'}
                    iconBtnText={`${open ? '收起' : '展开'}评论(共${commentNum}条)`}
                    onClick={this.toggleReplies}
                    {...commonIconOpt} iconColor="#999" />
                ) : null
              }
            </div>
            <Popover content={
              <ul className="no-margin">
                <li>
                  <ReportBtn
                    userId={loginUserId}
                    objectType={!!rootComment ? 2 : 3}
                    objectId={!!rootComment ? commentsv1Id : commentsv2Id} />
                </li>
              </ul>
            } placement="bottomRight">
              <i
                className={styles.more}
                style={{
                  backgroundImage: `url(${
                    config.SUBDIRECTORY_PREFIX}/assets/ellipsis.svg)`
                }}></i>
            </Popover>
          </footer>
        </main>
        <div className={showReplyBox ? styles.replyBoxSpread : styles.replyBoxCollapse}>
          <div className="replyBoxContainer">
            <h3>回复&nbsp;<span className="reply-to-commentator">Jack&nbsp;:</span></h3>
            <CommentBox
              textareaRef={this.replyInput}
              content={replyContent}
              loginUserId={loginUserId}
              onContentChange={this.onReplyContentChange}
              publishCallback={this.publishReply}/>
          </div>
        </div>
      </section>
    )
  }
}

ReplyItem.propTypes = {
  loginUserId: PropTypes.number,
  rootComment: PropTypes.number, // 顶层评论使用，代表评论楼层
  toggleReplies: PropTypes.func, // 顶层评论使用
  collapseReplies: PropTypes.bool, // 顶层评论使用
  replyInfo: PropTypes.object
}

export default ReplyItem
