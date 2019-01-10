import React, {Component} from 'react'
import { Input, Badge, Icon, Avatar, message } from 'antd'
import { connect } from 'dva'
import { routerRedux, withRouter } from 'dva/router'

import config from 'config/constants'
import IconBtn from 'components/common/IconBtn'
import styles from './index.css'
import ConfirmIfNotMeet from 'components/common/ConfirmIfNotMeet'

@connect(state => ({
  userId: state.user.userId,
  userToken: state.user.userToken,
  userInfo: state.user.userInfo,
  unreadTotalNum: state.notify.unreadTotalNum,
  searchKeyword: state.searchPost.searchKeyword
}))
@withRouter
class FixedHeader extends Component {
  constructor (props) {
    super(props)
    this.turnToIndexPage = this.turnToIndexPage.bind(this)
    this.handleUserSearch = this.handleUserSearch.bind(this)
    this.turnToPublishPage = this.turnToPublishPage.bind(this)
    this.turnToNotifyPage = this.turnToNotifyPage.bind(this)
    this.turnToMyHomepage = this.turnToMyHomepage.bind(this)
    this.toRegister = this.toRegister.bind(this)
    this.toLogin = this.toLogin.bind(this)
    this.toLogout = this.toLogout.bind(this)
  }
  turnToIndexPage () {
    let { dispatch } = this.props
    // dispatch(routerRedux.push(`/author/115?tab=my-post`))
    dispatch(routerRedux.push(`/`))
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    let { dispatch, userId } = nextProps
    if (userId && this.props.userId !== userId) {
      dispatch({
        type: 'notify/getNumber',
        payload: {
          userId
        }
      })
    }
  }

  handleUserSearch(value) {
    let newKeyword = value.trim()
    if (!newKeyword) return message.error('搜索关键字不能为空！')

    let { dispatch, location: { pathname }, searchKeyword } = this.props
    if (!!pathname.match(/\/search/)) {
      if (searchKeyword !== newKeyword) {
        dispatch({
          type: 'searchPost/setState',
          payload: { searchKeyword: newKeyword }
        })
      }
    } else {
      dispatch(routerRedux.push({
        pathname: `/search`,
        search: `?q=${window.encodeURIComponent(value.trim())}`
      }))
    }
  }
  turnToPublishPage() {
    let { dispatch, userId, location: { pathname } } = this.props
    let hideLoading = message.loading('加载中...', 0)
    dispatch({
      type: 'postCURD/newDraft',
      payload: {
        userId,
        pathname,
        successCallback(draftId) {
          hideLoading()
          dispatch(routerRedux.push(`/edit/${draftId}`))
        },
        failCallback() {
          hideLoading()
          message.error('新建帖子失败，请稍后再试！')
        }
      }
    })
  }
  toRegister () {
    let { dispatch } = this.props
    dispatch(routerRedux.push(`/register`))
  }
  toLogin () {
    let { dispatch, location: { pathname } } = this.props
    if (!!pathname.match(/\/login/)) return

    dispatch({
      type: 'user/setLoginSuccessPage',
      payload: { page: pathname }
    })
    dispatch(routerRedux.push(`/login`))
  }
  turnToNotifyPage() {
    let { dispatch } = this.props
    dispatch(routerRedux.push(`/notify`))
  }
  toLogout () {
    let {dispatch, userId} = this.props
    dispatch({
      type: 'user/logout',
      payload: {
        userId,
        successCallback () {
          message.success('退出成功！')
        },
        failCallback (msg) {
          message.error(msg)
        }
      }
    })
  }
  turnToMyHomepage() {
    let { userId, dispatch } = this.props
    dispatch(routerRedux.push(`/author/${userId}`))
  }
  render () {
    let Search = Input.Search
    let { userId, userToken, userInfo, unreadTotalNum, searchKeyword } = this.props
    let userLogined = !!(userId && userToken && userInfo)
    return (
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1
            className={styles.logo}
            style={{ content: `url(${config.SUBDIRECTORY_PREFIX}/assets/logo.jpg)` }}
            onClick={this.turnToIndexPage}>源来，西电人的技术社区</h1>
          <main className={styles.headerMain}>
            <Search
              placeholder="发现更多有趣的"
              defaultValue={searchKeyword}
              onSearch={value => this.handleUserSearch(value)}
              enterButton
            />

            <div className={styles.publishBtn}>
              <ConfirmIfNotMeet
                condition={!!userId}
                callbackWhenMeet={this.turnToPublishPage}
                btn={<IconBtn
                      iconType="form" iconBtnText="发帖" type='icon'
                      iconSize={24} fontSize={18} btnPadding='.2rem' color='#666' />
                }
              />
            </div>
            <div className={styles.appLink}>
              <IconBtn
                iconClassName={styles.flyIcon}
                bgImage={`${config.SUBDIRECTORY_PREFIX}/assets/fly.svg`}
                iconBtnText="APP" color="#999" fontSize="18px"
              />
            </div>
            {
              !!userId ? (
                <div className={styles.msgNotify}>
                  <Badge count={unreadTotalNum}>
                    <a
                      href="javascript:void(0);"
                      className={styles.msgNotifyIcon}
                      onClick={this.turnToNotifyPage}
                    >
                      <Icon
                        type="notification" theme="twoTone"
                        style={{ fontSize: '28px', padding: '.05rem' }} />
                    </a>
                  </Badge>
                </div>
              ) : null
            }
            <div className={styles.loginUserInfo}>
              {/* <Avatar src='../../../assets/yay.jpg' /> */}
              {
                userLogined ? (
                  <React.Fragment>
                    <span className={styles.avatarWrapper}><Avatar src={userInfo.avator} onClick={this.turnToMyHomepage} /></span>
                    <span className={styles.nickName} onClick={this.turnToMyHomepage}>{userInfo.nickName}</span>
                    <a href="javascript:void(0);" className={styles.logout} onClick={this.toLogout}>退出</a>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <a href="javascript:void(0);" className={styles.register} onClick={this.toRegister}>注册</a>
                    <a href="javascript:void(0);" className={styles.login} onClick={this.toLogin}>登录</a>
                  </React.Fragment>
                )
              }
            </div>
          </main>
        </div>
      </header>
    )
  }
}

export default FixedHeader
