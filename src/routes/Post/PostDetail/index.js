import React, { Component } from 'react'
import { connect } from 'dva';
import { routerRedux, withRouter } from 'dva/router'
import { Row, Col, Affix, Button, Popover, Tag, Avatar, Pagination, message } from 'antd'
import dayjs from 'dayjs'

import styles from './index.scss'
import articleStyles from  "./article.scss"
import config from 'config/constants'
// import colorfulTags from 'config/colorfulTags.json'
import { checkLogin, getIconBtnToggleProps, removeDuplicateTags } from 'utils'

import FixedHeader from 'components/common/FixedHeader'
import ConfirmIfNotMeet from 'components/common/ConfirmIfNotMeet'
import IconBtn from 'components/common/IconBtn'
import Debounce from 'components/common/Debounce'
import CollectionPanel from 'components/Post/CollectionPanel'
import CommentItem from 'components/Comment/CommentItem'
import CommentBox from 'components/Comment/CommentBox'
import ReportBtn from 'components/User/ReportBtn'
import PrivateMsgBtn from 'components/User/PrivateMsgBtn'
import UserFollowState from 'components/User/UserFollowState'

import "prismjs/themes/prism.css"

@connect(state => ({
  loginUserId: state.user.userId,
  postInfo: state.postDetails.postInfo,
  authorInfo: state.postDetails.authorInfo,
  comments: state.postDetails.comments,
  commentCurrentPage: state.postDetails.commentCurrentPage
}))
@checkLogin({
  *checkLoginFinish(userInfo, { put }, props) {
    let { match: { params: { id } }, postInfo } = props
    // console.log(`last post id: ${postInfo.articleId}`)
    yield put({
      type: 'firstScreenRender/postDetails',
      payload: {
        userInfo,
        id: Number(id),
        lastPostId: postInfo && postInfo.articleId
      }
    })
  }
})
@withRouter
class PostDetail extends Component {
  constructor (props) {
    super(props)
    this.starPost = this.starPost.bind(this)
    this.updateCollectedState = this.updateCollectedState.bind(this)
    this.saveSuccessCallback = this.saveSuccessCallback.bind(this) // 收藏成功的回调

    this.updateFollowAuthorState = this.updateFollowAuthorState.bind(this)

    this.sharePost = this.sharePost.bind(this)
    this.turnToLoginPage = this.turnToLoginPage.bind(this)
    this.turnToAuthorHomePage = this.turnToAuthorPage.bind(this)()
    this.showAuthorFollowed = this.turnToAuthorPage.bind(this, 'follow-me')()
    this.showCommentBox = this.showCommentBox.bind(this)
    this.publishComment = this.publishComment.bind(this)
    this.onCommentContentChange = this.onCommentContentChange.bind(this)
    this.onCommentPageChange = this.onCommentPageChange.bind(this)
    this.commentInput = React.createRef()
    this.state = { commentContent: '' }
  }

  componentDidMount() {
    this.scanStartTime = Date.now()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // let { postInfo } = this.props
    // if (postInfo && !postInfo.content && nextProps.postInfo.content) {
    //   // import('prismjs').then(() => {
    //   //   window.Prism.highlightAllUnder(document.getElementById('post-article'), true)
    //   // })
    // }
  }

  componentWillUnmount() {
    let { dispatch, loginUserId, postInfo } = this.props
    if (!loginUserId) return
    let { articleId } = postInfo
    dispatch({
      type: 'postDetails/addScanRecord',
      payload: {
        userId: loginUserId,
        postId: articleId,
        spentTime: Date.now() - this.scanStartTime
      }
    })
  }

  starPost() {
    let { dispatch, postInfo } = this.props
    let { liked, approvalNum } = postInfo
    let newApprovalNum = liked ? (approvalNum - 1) : (approvalNum + 1)

    dispatch({
      type: 'postDetails/setInfo',
      payload: {
        key: 'postInfo',
        newInfo: {
          liked: !liked,
          approvalNum: newApprovalNum
        }
      }
    })
    return getIconBtnToggleProps(newApprovalNum, !liked)
  }
  /* 收藏帖子相关 */
  updateCollectedState() {
    let { dispatch, postInfo } = this.props
    let { collected } = postInfo
    dispatch({
      type: 'postDetails/setInfo',
      payload: {
        key: 'postInfo',
        newInfo: { collected: !collected }
      }
    })
  }
  saveSuccessCallback(resolve) {
    let { dispatch } = this.props
    return () => {
      message.success('保存成功！')
      // 收藏成功之后需要将帖子详情中的收藏状态更新
      dispatch({
        type: 'postDetails/setInfo',
        payload: {
          key: 'postInfo',
          newInfo: {
            collected: true
          }
        }
      })
      resolve(true) // 隐藏对话框
    }
  }
  saveFailCallback(reject) {
    return () => {
      message.error('保存失败！')
      reject()
    }
  }

  sharePost() {

  }
  updateFollowAuthorState(newFollowState) {
    let { dispatch } = this.props
    dispatch({
      type: 'postDetails/setInfo',
      payload: {
        key: 'authorInfo',
        newInfo: {
          relationship: newFollowState
        }
      }
    })
  }
  turnToLoginPage() {
    let { dispatch, location: { pathname } } = this.props
    dispatch({
      type: 'user/setLoginSuccessPage',
      payload: { page: pathname }
    })
    dispatch(routerRedux.push(`/login`))
  }
  showCommentBox() {
    this.commentInput.current.focus()
  }
  turnToAuthorPage(tab) {
    return () => {
      let { dispatch, postInfo } = this.props
      let { userId } = postInfo
      dispatch(routerRedux.push(
        `/author/${userId}${
          tab ? `?tab=${tab}` : ''
        }`))
    }
  }
  onCommentContentChange(e) {
    this.setState({ commentContent: e.target.value })
  }
  publishComment(content) {
    let { dispatch, loginUserId, postInfo } = this.props
    let { articleId } = postInfo

    dispatch({
      type: 'comment/publishComment',
      payload: {
        objectId: articleId,
        userId: loginUserId,
        content,
        reply: false,
        successCallback: () => {
          message.success('评论成功!')
          this.setState({ commentContent: '' })
        }
      }
    })
  }
  onCommentPageChange(page) {
    let { dispatch, loginUserId, postInfo, commentCurrentPage, comments } = this.props
    if (commentCurrentPage === page) return
    let { articleId } = postInfo

    dispatch({
      type: 'postDetails/getComments',
      payload: {
        postId: articleId,
        page,
        number: 10,
        loadedNumber: comments.length,
        loginUserId
      }
    })
  }
  render () {
    let { loginUserId, postInfo, authorInfo, comments, commentCurrentPage } = this.props
    let { articleId, title, content, avator, label = '', nickName, time, userId, approvalNum = 0, commentNum, scanNum = 0, liked, collected } = postInfo
    let { relationship, fans = 0, introduction } = authorInfo
    let { commentContent } = this.state
    let commentStart = (commentCurrentPage - 1) * 10
    comments = comments.slice(commentStart, commentStart + 10)

    // console.log(`liked=${liked}`)
    let commonFooterIconOpt = {
      type: 'icon',
      iconSize: 24,
      fontSize: 18,
      btnPadding: '.2rem',
      color: '#666'
    }
    let commonOtherInfoIconOpt = Object.assign({}, commonFooterIconOpt, { iconSize: 20 })
    return (
      <div className={styles.scrollContainer}>
        <FixedHeader />
        <main className="app-main">
          <Row gutter={20}>
            <Col span={16}>
              <main className={styles.postDetailMain}>
                <section className={styles.postContentSection}>
                  <header className={styles.postTitleWrapper}>
                    <h2 className="postTitle">{title}</h2>
                    <Popover content={
                      <ul className={styles.popoverBtns}>
                        <li>
                          <ReportBtn objectType={0} objectId={articleId} />
                        </li>
                      </ul>
                    } placement="bottomRight">
                      <i
                        className={styles.more}
                        style={{ backgroundImage: `url(${config.SUBDIRECTORY_PREFIX}/assets/ellipsis.svg)` }}></i>
                    </Popover>
                  </header>
                  <article className={styles.postContent}>
                    <div className={articleStyles.article} id="post-article" dangerouslySetInnerHTML={{__html: content}}></div>
                  </article>
                  <footer className={styles.postInfoFooter}>
                    <Debounce
                      btnProps={getIconBtnToggleProps(approvalNum, liked)}
                      actionType="userBehaviors/approval"
                      extraPayload={{ type: 0, objectId: articleId, like: !liked }}
                      userId={loginUserId}
                      update={this.starPost}
                      btn={<IconBtn iconType="heart" {...commonFooterIconOpt} />}
                    />
                    {
                      collected ? (
                        <Debounce
                          btnProps={getIconBtnToggleProps(null, collected, '收藏', 'gold')}
                          actionType="userBehaviors/collectPost"
                          extraPayload={{
                            cancel: true, postId: articleId, page: 'postDetails'
                          }}
                          userId={loginUserId}
                          update={this.updateCollectedState}
                          btn={
                            <IconBtn iconType="star" {...commonFooterIconOpt} />
                          }
                        />
                      ) : (
                        !!loginUserId ? (
                          <CollectionPanel
                            userId={loginUserId} postId={articleId} btn={
                              <IconBtn iconType="star" iconBtnText="收藏" {...commonFooterIconOpt} />
                            }
                            saveSuccessCallback={this.saveSuccessCallback}
                            saveFailCallback={this.saveFailCallback}
                          />
                        ) : (
                          <ConfirmIfNotMeet
                            condition={ false }
                            btn={ <IconBtn iconType="star" iconBtnText="收藏" {...commonFooterIconOpt} />} />
                        )
                      )
                    }
                    {/* <ConfirmIfNotMeet
                      condition={!!loginUserId}
                      callbackWhenMeet={this.sharePost}
                      btn={<IconBtn iconType="share-alt" iconBtnText="分享" {...commonFooterIconOpt} />} /> */}
                  </footer>
                </section>
                <section className={styles.postCommentSection}>
                  <header className={styles.postCommentHeader}>
                    <h3 className={styles.commentTitle}>评论({commentNum})</h3>
                    <Button icon="form" onClick={this.showCommentBox}>我要评论</Button>
                  </header>
                  <main>
                    {/* 评论数未超过5条正常显示 */}
                    {/* 未登录时只显示5条评论 */}
                    {
                      !!commentNum ? (
                        !!loginUserId ? (
                          <React.Fragment>
                            {
                              comments.map((item, i) => (
                                <CommentItem
                                  key={i}
                                  number={commentStart + i + 1}
                                  loginUserId={loginUserId}
                                  commentId={item.commentsv1Id} />
                              ))
                            }
                            {commentNum > 10 ? (
                              <div className={styles.paginatorWrapper}>
                                <Pagination
                                  defaultCurrent={1}
                                  total={commentNum}
                                  onChange={this.onCommentPageChange} />
                              </div>
                            ): null}
                          </React.Fragment>
                        ) : (
                          <div className={commentNum > 5 ? styles.notLoggedInComments : ''}>
                            {comments.slice(0, 5).map((item, i) => (
                              <CommentItem
                                key={i}
                                number={i + 1}
                                loginUserId={loginUserId}
                                commentId={item.commentsv1Id} />))}
                            {commentNum > 5 ? (
                              <p className={styles.loginToComment}>
                                <a href="javascript:void(0)"
                                    onClick={this.turnToLoginPage}>登录之后查看全部评论</a>
                              </p>
                            ) : null}
                          </div>
                        )
                      ) : (
                        <div className={styles.noComment}>
                          <IconBtn
                            type="icon"
                            iconType="inbox"
                            iconBtnStyle={{ justifyContent: 'center', cursor: 'auto' }}
                            iconSize={36}
                            color="#999"
                            fontSize={18}
                            iconBtnText="暂无评论"
                          />
                        </div>
                      )
                    }
                  </main>
                  <footer className={styles.commentBoxWrapper}>
                    <CommentBox
                      textareaRef={this.commentInput}
                      content={commentContent}
                      loginUserId={loginUserId}
                      onContentChange={this.onCommentContentChange}
                      publishCallback={this.publishComment}
                    />
                  </footer>
                </section>
              </main>
            </Col>
            <Col span={8}>
              <Affix offsetTop={0}>
                <div className={styles.postOtherInfo}>
                  {
                    !!label ? (
                      <ul className={styles.postTags}>
                        {
                          removeDuplicateTags(label).map(tag => (
                            <li key={tag}>
                              <Tag
                                // color={colorfulTags.find(ct => ct === tag).color}
                                color="gold"
                              >{tag}</Tag>
                            </li>
                          ))
                        }
                      </ul>
                    ) : null
                  }

                  {!!time ? (
                    <div className={styles.postOtherInfoIcon}>
                      <IconBtn iconType="clock-circle" iconBtnText={
                        dayjs(Number(time)).format('YYYY年MM月DD日 HH:mm')
                      } {...commonOtherInfoIconOpt} />
                    </div>
                  ) : null}
                  <div className={styles.postOtherInfoIcon}>
                    <IconBtn iconType="eye" iconBtnText={`${scanNum}人看过`} {...commonOtherInfoIconOpt} />
                  </div>
                </div>
                <section className={styles.authorInfoSection}>
                  <header className={styles.authorInfoHeader}>
                    <h3>关于作者</h3>
                    {
                      (!loginUserId || userId && (loginUserId !== userId)) ? (
                        <div className={styles.contactAuthorBtns}>
                          <div className={styles.btn}>
                            {!!relationship ? (
                              <UserFollowState
                                authorId={userId}
                                followState={relationship}
                                updateSuccessCallback={this.updateFollowAuthorState}
                              />
                            ) : null}
                          </div>
                          <div className={styles.btn}>
                            <PrivateMsgBtn
                              receiverId={userId}
                              btn={<Button icon="message">私信</Button>}
                            />
                          </div>
                        </div>
                      ) : null
                    }
                  </header>
                  <main className={styles.authorInfoMain}>
                    <div
                      className={styles.avatarWrapper}
                      onClick={this.turnToAuthorHomePage}
                    >
                      <Avatar src={avator} size={40} />
                    </div>
                    <div className={styles.authorInfo}>
                      <p onClick={this.turnToAuthorHomePage}><strong>{nickName}</strong></p>
                      <span onClick={this.showAuthorFollowed}>关注Ta的人：{fans}</span>
                    </div>
                  </main>
                  <div className={styles.signature}>
                    <strong>个人介绍：</strong>
                    {introduction ? <span>{introduction}</span> : <i>暂无说明</i>}
                  </div>
                </section>
              </Affix>
            </Col>
          </Row>
        </main>
      </div>
    );
  }
}

PostDetail.propTypes = {
};

export default PostDetail;
