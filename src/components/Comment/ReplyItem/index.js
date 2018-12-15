import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Popover} from 'antd'

import styles from './index.scss'
import Confirm from 'components/common/Confirm'
import ReportUserForm from 'components/User/ReportUserForm'
import IconBtn from 'components/common/IconBtn'
import CommentBox from '../CommentBox'

class ReplyItem extends Component {
  state = {
    showReplyBox: false,
  };
  constructor (props) {
    super(props)
    this.toggleCommentBox = this.toggleCommentBox.bind(this)
    this.toggleReplies = this.toggleReplies.bind(this)

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
    this.replyBox = React.createRef()
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
    this.replyBox.current.focus()
  }
  render () {
    let {
      replyDetails,
      rootComment,
      collapseReplies
    } = this.props
    let {username, avatar} = replyDetails.publisher
    let {publishTime, agree, content} = replyDetails
    avatar = 'https://www.baidu.com/s?rsv_idx=2&tn=baiduhome_pg&wd=%E5%BC%BA%E8%BF%AB%E7%97%87%E5%A4%B4%E5%83%8F&usm=1&ie=utf-8&rsv_cq=%E7%94%B7%E7%94%9F%E5%A4%B4%E5%83%8F%E5%8A%A8%E6%BC%AB&rsv_dl=0_right_recommends_merge_21102&cq=%E7%94%B7%E7%94%9F%E5%A4%B4%E5%83%8F%E5%8A%A8%E6%BC%AB&srcid=28310&rt=%E7%9B%B8%E5%85%B3%E8%AF%8D%E6%B1%87&recid=21102&euri=bd60485c57b3441789535b465001639c'

    let commonIconOpt = {
      color: '#666',
      btnPadding: '.2rem',
      fontSize: '.22rem'
    }
    let {showReplyBox} = this.state
    return (
      <section className={styles.replyItem}>
        <main className={styles.replyMain}>
          <header className={styles.replyItemHeader}>
            <p className={styles.publisherInfo}>
              <IconBtn type="avatar" avatarSize={28} avatarURL={avatar} color="#333" iconBtnText={username} btnPadding={0}  />
              <time>{publishTime}</time>
            </p>
            {
              rootComment &&
              <p className="commentNumber">#&nbsp;{rootComment}</p>
            }
          </header>
          <p className={styles.commentContent}>{content}</p>
          <footer className={styles.replyItemFooter}>
            <div className={styles.iconBtns}>
              <IconBtn
                iconClassName={styles.agreeIcon}
                iconBtnText={`${agree}人赞同`} {...commonIconOpt} />
              <IconBtn
                iconClassName={styles.replyIcon}
                onClick={this.toggleCommentBox}
                iconBtnText="回复" {...commonIconOpt} />
              {
                rootComment &&
                <IconBtn
                iconClassName={collapseReplies ? styles.collapseIcon : styles.spreadIcon}
                iconBtnText={`${collapseReplies ? '展开' : '收起' }评论(共${10}条)`}
                onClick={this.toggleReplies}
                {...commonIconOpt} />
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
            <CommentBox textareaRef={this.replyBox} />
          </div>
        </div>
      </section>
    )
  }
}

ReplyItem.propTypes = {
  rootComment: PropTypes.number,
  replyDetails: PropTypes.shape({
    publisher: PropTypes.shape({
      username: PropTypes.string,
      avatar: PropTypes.string,
    }),
    content: PropTypes.string,
    publishTime: PropTypes.string,
    agree: PropTypes.number,
    agreed: PropTypes.bool
  })
}

export default ReplyItem
