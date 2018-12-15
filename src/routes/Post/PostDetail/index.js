import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux, withRouter } from 'dva/router'
import {Row, Col, Affix, Button, Popover, Tag, Avatar} from 'antd'
import dayjs from 'dayjs'

import styles from './index.scss'
import colorfulTags from 'config/colorfulTags.json'
import {checkLogin} from 'utils'

import FixedHeader from 'components/common/FixedHeader'
import Confirm from 'components/common/Confirm'
import ConfirmIfNotMeet from 'components/common/ConfirmIfNotMeet'
import ReportUserForm from 'components/User/ReportUserForm'
import IconBtn from 'components/common/IconBtn'
import Debounce from 'components/common/Debounce'
import CollectionPanel from 'components/Post/CollectionPanel'
import CommentItem from 'components/Comment/CommentItem'
import CommentBox from 'components/Comment/CommentBox'


@connect(state => ({
  loginUserId: state.user.userId,
  postInfo: state.postDetails.postInfo,
  authorInfo: state.postDetails.authorInfo,
  comments: state.postDetails.comments
}))
@checkLogin({
  *checkLoginFinish(userInfo, { put }, props) {
    console.log('......')
    console.log(props)
    let { match: { params: { id } }, postInfo } = props
    console.log(`last post id: ${postInfo.articleId}`)
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
  state = {
    tags: ['JavaScript', 'HTML']
  };

  constructor (props) {
    super(props)
    let {match} = props
    console.log(match)
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
    this.starPost = this.starPost.bind(this)
    this.updateCollectedState = this.updateCollectedState.bind(this)
    this.updateFollowAuthorState = this.updateFollowAuthorState.bind(this)

    this.sharePost = this.sharePost.bind(this)
    this.turnToLoginPage = this.turnToLoginPage.bind(this)
    this.turnToAuthorHomePage = this.turnToAuthorPage.bind(this)()
    this.showAuthorFollowed = this.turnToAuthorPage.bind(this, 'follow-me')()
    this.showCommentBox = this.showCommentBox.bind(this)
    this.commentBox = React.createRef()
  }

  starPost(like) {
    let {dispatch, postInfo} = this.props
    let { approvalNum } = postInfo
    dispatch({
      type: 'postDetails/setInfo',
      payload: {
        key: 'postInfo',
        newInfo: {
          liked: like,
          approvalNum: like ? (approvalNum + 1) : (approvalNum - 1)
        }
      }
    })
  }
  updateCollectedState(state) {
    let { dispatch } = this.props
    dispatch({
      type: 'postDetails/setInfo',
      payload: {
        key: 'postInfo',
        newInfo: { collected: state }
      }
    })
  }
  sharePost() {

  }
  updateFollowAuthorState(state) {
    let { dispatch } = this.props
    dispatch({
      type: 'postDetails/setInfo',
      payload: {
        key: 'authorInfo',
        newInfo: { hasFollowed: state }
      }
    })
  }
  turnToLoginPage() {
    let { dispatch, location: { pathname } } = this.props
    dispatch({
      type: 'user/setLoginSuccessPage',
      payload: { page: pathname }
    })
    dispatch(routerRedux.push('/login'))
  }
  showCommentBox() {
    this.commentBox.current.focus()
  }
  turnToAuthorPage(tab) {
    return () => {
      let { dispatch, postInfo } = this.props
      let { userId } = postInfo
      dispatch(routerRedux.push(`/author/${userId}${tab ? `?tab=${tab}` : ''}`))
    }
  }
  render () {
    // let {title, like = 0, tags, view = 225, signature = "素胚勾勒出青花笔锋浓转淡，瓶身描绘的牡丹一如你初妆，冉冉檀香透过窗心事我了然，宣纸上走笔至此搁一半，釉色渲染仕女图韵味被私藏"} = this.state
    let {loginUserId, postInfo, authorInfo, comments} = this.props
    let { articleId, title, content, avator, label = '', nickName, time, userId, approvalNum, commentNum, scanNum, liked, collected } = postInfo
    let { hasFollowed } = authorInfo
    comments = []
    // console.log(`liked=${liked}`)
    let commonFooterIconOpt = {
      type: 'icon',
      iconSize: '.24rem',
      fontSize: '.2rem',
      btnPadding: '.2rem',
      color: '#666'
    }
    let commonOtherInfoIconOpt = Object.assign(commonFooterIconOpt, {iconSize: '.26rem', fontSize: '.24rem'})
    let authorIconOpt = Object.assign(commonFooterIconOpt, {fontSize: '.24rem'})
    let documentEleFontSize = document.documentElement.clientWidth * 50 / 1000
    return (
      <div className="app-container">
        <FixedHeader />
        <main className="app-main">
          <Row gutter={20}>
            <Col span={16}>
              <main className={styles.postDetailMain}>
                <section className={styles.postContentSection}>
                  <header className={styles.postTitleWrapper}>
                    <h2 className="postTitle">{title}</h2>
                    <Popover content={this.reportAuthorTemplate} placement="bottomRight">
                      <i className={styles.more}></i>
                    </Popover>
                  </header>
                  <article className={styles.postContent}>
                    <p>{content}</p>
                  </article>
                  <footer className={styles.postInfoFooter}>
                    <Debounce
                      active={liked}
                      number={approvalNum}
                      activeStyle={{ iconTheme: 'filled', iconColor: '#db2d43' }}
                      actionType="userBehaviors/approval"
                      extraPayload={{type: 0, objectId: articleId}}
                      userId={loginUserId}
                      update={this.starPost}
                      btn={
                        <IconBtn iconType="heart" {...commonFooterIconOpt} />
                      }
                    />
                    {
                      collected ? (
                        <Debounce
                          active={true}
                          normalText="收藏"
                          activeText="已收藏"
                          activeStyle={{ iconTheme: 'filled', iconColor: 'gold' }}
                          actionType="userBehaviors/collectPost"
                          extraPayload={{ cancel: true, postId: articleId }}
                          userId={loginUserId}
                          update={this.updateCollectedState}
                          btn={
                            <IconBtn iconType="star" {...commonFooterIconOpt} />
                          }
                        />
                      ) : (
                          !!loginUserId ? (
                            <CollectionPanel userId={loginUserId} postId={articleId} btn={
                              <IconBtn iconType="star" iconBtnText="收藏" {...commonFooterIconOpt} />
                            } />
                          ) : (
                            <ConfirmIfNotMeet
                              condition={ false }
                              btn={ <IconBtn iconType="star" iconBtnText="收藏" {...commonFooterIconOpt} />} />
                        )
                      )
                    }
                    <ConfirmIfNotMeet
                      condition={!!loginUserId}
                      callbackWhenMeet={this.sharePost}
                      btn={<IconBtn iconType="share-alt" iconBtnText="分享" {...commonFooterIconOpt} />} />
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
                      comments.length > 5 ? (
                        !!loginUserId ? (
                          comments.map((item, i) => (
                            <CommentItem key={i} number={i} />
                          ))
                        ) : (
                          <div className={styles.notLoggedInComments}>
                            {comments.slice(0, 5).map((item, i) => (
                              <CommentItem key={i} number={i} />))}
                            <p className={styles.loginToComment}>
                              <a href="javascript:void(0)" onClick={this.turnToLoginPage}>登录之后查看所有评论</a>
                            </p>
                          </div>
                        )
                      ) : (
                        comments.length ? (
                          comments.map((item, i) => (
                            <CommentItem key={i} number={i} />
                          ))
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
                      )
                    }
                  </main>
                  <footer className={styles.commentBoxWrapper}>
                    <CommentBox textareaRef={this.commentBox} />
                  </footer>
                </section>
              </main>
            </Col>
            <Col span={8}>
              <Affix offsetTop={1.8 * documentEleFontSize}>
                <div className={styles.postOtherInfo}>
                  <ul className={styles.postTags}>
                    {
                      label.split(',').map(tag => <li key={tag}>
                        <Tag
                          // color={colorfulTags.find(ct => ct === tag).color}
                          color="gold"
                        >{tag}</Tag>
                      </li>)
                    }
                  </ul>
                  <div className={styles.postOtherInfoIcon}>
                    <IconBtn iconType="clock-circle" iconBtnText={
                      dayjs(Number(time)).format('YYYY年MM月DD日 HH:mm')
                    } {...commonOtherInfoIconOpt} />
                  </div>
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
                          <Debounce
                            active={hasFollowed}
                            activeStyle={{ type: 'user-delete', color: 'gold' }}
                            normalText="关注"
                            activeText="取消关注"
                            actionType="userBehaviors/followAuthor"
                            extraPayload={{ authorId: userId }}
                            userId={loginUserId}
                            update={this.followAuthor}
                            btn={
                              <IconBtn iconType="plus" {...authorIconOpt} />
                            }
                          />
                          <ConfirmIfNotMeet
                            condition={!!loginUserId}
                            callbackWhenMeet={this.sendMessage}
                            btn={
                              <IconBtn iconType="message" iconBtnText="私信" {...authorIconOpt} />
                            } />
                        </div>
                      ) : null
                    }
                  </header>
                  <main className={styles.authorInfoMain}>
                    <div
                      className={styles.avatarWrapper}
                      onClick={this.turnToAuthorHomePage}
                    >
                      <Avatar src={avator} size="large" />
                    </div>
                    <div className={styles.authorInfo}>
                      <p onClick={this.turnToAuthorHomePage}><strong>{nickName}</strong></p>
                      <span onClick={this.showAuthorFollowed}>关注Ta的人：1102</span>
                    </div>
                  </main>
                  <div className={styles.signature}>
                    <strong>签名：</strong>
                    {/* {signature} */}
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
