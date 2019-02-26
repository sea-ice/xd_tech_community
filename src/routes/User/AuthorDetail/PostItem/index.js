import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { routerRedux, withRouter } from 'dva/router'
import { Icon, Popover, message } from 'antd'

import styles from './index.scss'
import config from 'config/constants'
import Confirm from 'components/common/Confirm'
import IconBtn from "components/common/IconBtn";
import { getPostExcerpt, timeRelativeToNow } from 'utils'

@withRouter
class PostItem extends Component {
  constructor (props) {
    super(props)
    this.editDraft = this.editDraft.bind(this)
    this.turnToPostDetails = this.turnToPostDetails.bind(this)
    this.deletePost = this.deletePost.bind(this)
  }
  turnToPostDetails() {
    let { dispatch, articleId, isDraft } = this.props
    if (isDraft) {
      this.editDraft()
    } else {
      dispatch(routerRedux.push(`/post/${articleId}`))
    }
  }
  editDraft() {
    let { dispatch, articleId, location: { pathname, search } } = this.props
    dispatch(routerRedux.push(`/edit/${articleId}`))
    dispatch({
      type: 'postCURD/saveEditDraftReturnPage',
      payload: { returnPath: pathname + search }
    })
  }
  deletePost() {
    let { dispatch, articleId, loginUserId, isDraft } = this.props
    let hideLoading = message.loading('加载中...')
    dispatch({
      type: 'postCURD/delete',
      payload: {
        userId: loginUserId,
        postId: articleId,
        isDraft,
        successCallback: () => {
          hideLoading()
          message.success('删除成功！')
          this.props.updateCurrentPage()
        },
        failCallback() {
          hideLoading()
          message.error('删除失败，请稍后再试！')
        }
      }
    })
  }
  render () {
    let { isDraft, guest, type, title, content, time, approvalNum, scanNum, commentNum } = this.props

    let commonIconOpt = {
      type: 'icon',
      iconSize: '.24rem',
      fontSize: '.2rem',
      btnPadding: '.2rem',
      color: '#666'
    }
    return (
      <div className={styles.postItem}>
        <header className={styles.header}>
          <div className={styles.title}>
            <h4 onClick={this.turnToPostDetails}>
              {isDraft ? `[${type === config.postType.SHARE ? '分享' : '求助'}]` : ''}
              <span style={{marginLeft: title ? 0 : '10px'}}>{title || '无标题'}</span>
            </h4>
            {isDraft ? (
              <i className={styles.editIcon} onClick={this.editDraft}><Icon type="edit" /></i>
            ) : null}
          </div>
          {
            guest ? null : (
              <Popover content={
                <ul className={styles.popoverBtns}>
                  <li>
                    <Confirm
                      triggerModalBtn={<a href="javascript:void(0);" className={styles.deleteBtn}>删除</a>}
                      modalTitle="提示"
                      handleOk={this.deletePost}
                    >
                      <p>确定删除该帖子吗？</p>
                    </Confirm>
                  </li>
                </ul>
              } placement="bottomRight">
                <i
                  className={styles.more}
                  style={{ backgroundImage: `url(${config.SUBDIRECTORY_PREFIX}/assets/ellipsis.svg)` }}
                ></i>
              </Popover>
            )
          }
        </header>
        <footer className={styles.footer}>
          <time>{!!time && `发表于${timeRelativeToNow(time)}`}</time>
          {
            isDraft ?
              <p className={styles.wordCount}>共&nbsp;{getPostExcerpt(content || '').length}&nbsp;字</p>
            :
            <div className={styles.iconBtnWrapper}>
              <IconBtn iconType="eye" iconBtnText={`${scanNum}人看过`} {...commonIconOpt} />
              <IconBtn iconType="heart" iconBtnText={`${approvalNum}人喜欢`} {...commonIconOpt} />
              <IconBtn iconType="message" iconBtnText={`${commentNum}人评论`} {...commonIconOpt} />
            </div>
          }
        </footer>
      </div>
    );
  }
}

PostItem.propTypes = {
  guest: PropTypes.bool,
  isDraft: PropTypes.bool
};

export default connect(state => ({
  loginUserId: state.user.userId
}))(PostItem);
