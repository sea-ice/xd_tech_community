import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Popover, message } from 'antd'
import dayjs from 'dayjs'

import styles from './index.scss'
import Confirm from 'components/common/Confirm'
import ReportUserForm from 'components/User/ReportUserForm'
import IconBtn from 'components/common/IconBtn'
import CommentBox from '../CommentBox'
import Debounce from 'components/common/Debounce'
import ConfirmIfNotMeet from 'components/common/ConfirmIfNotMeet'

@connect()
class ReplyItem extends Component {
  state = {
    showReplyBox: false,
    replyContent: ''
  };
  constructor (props) {
    super(props)
    this.toggleCommentBox = this.toggleCommentBox.bind(this)
    this.toggleReplies = this.toggleReplies.bind(this)
    this.starReply = this.starReply.bind(this)
    this.onReplyContentChange = this.onReplyContentChange.bind(this)
    this.publishReply = this.publishReply.bind(this)

    this.reportAuthorTemplate = <ul className="no-margin">
      <li>
        <Confirm
          triggerModalBtn={
            <a href="javascript:void(0);" className={styles.popoverItem}>举报该用户</a>
          }
          modalTitle="请认真填写举报信息"
          confirmBtnText="提交"
        >
          <ReportUserForm />
        </Confirm>
      </li>
    </ul>
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
  starReply() {

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
    let { nickName, avator, commentNum, commentsv1Id, commentsv2Id, content, isAccept, approvalNum, time, userId } = replyInfo
    let replyId = !!rootComment ? commentsv1Id : commentsv2Id

    let commonIconOpt = {
      color: '#666',
      btnPadding: '.2rem',
      fontSize: '.22rem'
    }
    let { showReplyBox, replyContent } = this.state
    return (
      <section className={styles.replyItem}>
        <main className={styles.replyMain}>
          <header className={styles.replyItemHeader}>
            <p className={styles.publisherInfo}>
              <IconBtn
                type="avatar"
                avatarSize={28}
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
              <Debounce
                active={!!isAccept}
                number={approvalNum}
                normalText="%n人赞同"
                activeStyle={{ iconTheme: 'filled', iconColor: '#db2d43' }}
                actionType="userBehaviors/approval"
                extraPayload={{ type: 0, objectId: replyId }}
                userId={loginUserId}
                update={this.starReply}
                btn={
                  <IconBtn iconClassName={styles.agreeIcon} {...commonIconOpt} />
                }
              />
              {
                !rootComment || (!!loginUserId && (loginUserId === userId)) ? null : (
                  <ConfirmIfNotMeet
                    condition={!!loginUserId}
                    callbackWhenMeet={this.toggleCommentBox}
                    btn={<IconBtn
                      iconClassName={styles.replyIcon}
                      iconBtnText="回复" {...commonIconOpt} />} />
                )
              }
              {
                (rootComment && commentNum) ? (
                  <IconBtn
                    iconClassName={open ? styles.spreadIcon : styles.collapseIcon}
                    iconBtnText={`${open ? '收起' : '展开'}评论(共${commentNum}条)`}
                    onClick={this.toggleReplies}
                    {...commonIconOpt} />
                ) : null
              }
            </div>
            <Popover content={this.reportAuthorTemplate} placement="bottomRight">
              <i className={styles.more}></i>
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
