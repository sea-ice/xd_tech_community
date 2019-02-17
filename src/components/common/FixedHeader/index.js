import React, {Component} from 'react'
import { Input, Badge, Icon, Avatar, message } from 'antd'
import { connect } from 'dva'
import { routerRedux, withRouter } from 'dva/router'

import config from 'config/constants'
import IconBtn from 'components/common/IconBtn'
import styles from './index.css'
import ConfirmIfNotMeet from 'components/common/ConfirmIfNotMeet'
import { getSearchObj } from 'utils'

@connect(state => ({
  userId: state.user.userId,
  userToken: state.user.userToken,
  userInfo: state.user.userInfo,
  unreadTotalNum: state.msgs.totalUnreadNum,
  searchKeyword: state.searchPost.searchKeyword
}))
@withRouter
class FixedHeader extends Component {
  constructor (props) {
    super(props)
    this.turnToIndexPage = this.turnToIndexPage.bind(this)
    this.onInputKeywordChange = this.onInputKeywordChange.bind(this)
    this.handleUserSearch = this.handleUserSearch.bind(this)
    this.turnToPublishPage = this.turnToPublishPage.bind(this)
    this.turnToNotifyPage = this.turnToNotifyPage.bind(this)
    this.turnToMyHomepage = this.turnToMyHomepage.bind(this)
    this.toRegister = this.toRegister.bind(this)
    this.toLogin = this.toLogin.bind(this)
    this.toLogout = this.toLogout.bind(this)

    let { location: { pathname } } = props

    this.state = {
      // 仅当当前页面为搜索页时才根据url中的search初始化inputKeyword
      inputKeyword: !!pathname.match(/\/search/) ?
        (this.getSearchKeyword() || '') : ''
    }
    console.log(`get keyword in constructor: ${this.state.searchKeyword}`)
  }
  turnToIndexPage () {
    let { dispatch } = this.props
    dispatch(routerRedux.push(`/`))
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    let { dispatch, userId } = nextProps

    console.log('fixed header receive props')
    console.log(userId)
    // 刷新未读消息数量
    if (!!userId) {
      dispatch({
        type: 'msgs/getUnreadNumber',
        payload: {
          userId
        }
      })
    }
  }
  getSearchKeyword() {
    let { dispatch, location } = this.props
    let { q } = getSearchObj(location)
    if (!q || !q.trim()) {
      dispatch(routerRedux.push('/404'))
      return
    }

    q = window.decodeURIComponent(q.trim())
    this.setSearchPageState({ searchKeyword: q })
    return q
  }
  setSearchPageState(newState) {
    let { dispatch } = this.props
    dispatch({
      type: 'searchPost/setState',
      payload: newState
    })
  }
  onInputKeywordChange(e) {
    this.setState({ inputKeyword: e.target.value })
  }
  handleUserSearch(value) {
    let newKeyword = value.trim()
    if (!newKeyword) return message.error('搜索关键字不能为空！')

    let { dispatch, location: { pathname }, searchKeyword } = this.props

    let dispatchSearchAction = false
    if (!!pathname.match(/\/search/)) {
      if (searchKeyword !== newKeyword) {
        // 在搜索页面输入新的关键词搜索
        // 通过componentWillReceiveProps更新SearchPage组件，并更新URL中的search
        dispatchSearchAction = true
      }
    } else {
      // 从其他页面跳转到搜索页，此时会挂载SearchPage
      dispatchSearchAction = true
    }
    if (dispatchSearchAction) {
      dispatch({
        type: 'searchPost/setState',
        payload: { searchKeyword: newKeyword }
      })
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
    let { dispatch, location: { pathname, search } } = this.props
    if (!!pathname.match(/\/login/)) return

    dispatch({
      type: 'user/setLoginSuccessPage',
      payload: { page: pathname + search }
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
    let { userId, userToken, userInfo, unreadTotalNum } = this.props
    let { inputKeyword } = this.state
    let userLogined = !!(userId && userToken && userInfo)
    let iconBtnProps = { theme: "twoTone", type: 'icon', iconSize: 24, }
    return (
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1
            className={styles.logo}
            style={{ content: `url(${config.SUBDIRECTORY_PREFIX}/assets/logo.png)` }}
            onClick={this.turnToIndexPage}>源来，西电人的技术社区</h1>
          <main className={styles.headerMain}>
            <div className={styles.searchInputWrapper}>
              <div className={styles.searchInput}>
                <Search
                  placeholder="发现更多有趣的"
                  value={inputKeyword}
                  onChange={this.onInputKeywordChange}
                  onSearch={value => this.handleUserSearch(value)}
                  enterButton
                />
              </div>
            </div>


            <div className={styles.publishBtn}>
              <ConfirmIfNotMeet
                condition={!!userId}
                callbackWhenMeet={this.turnToPublishPage}
                btn={<IconBtn iconType="form" iconBtnText="发帖" {...iconBtnProps} />}
              />
            </div>
            {/* <div className={styles.appLink}>
              <IconBtn
                iconClassName={styles.flyIcon}
                bgImage={`${config.SUBDIRECTORY_PREFIX}/assets/fly.svg`}
                iconBtnText="APP" color="#999" fontSize="18px"
              />
            </div> */}
            {
              !!userId ? (
                <div className={styles.msgNotify}>
                  <a
                    href="javascript:void(0);"
                    className={styles.iconBtn}
                    onClick={this.turnToNotifyPage}
                  >
                    <Badge count={unreadTotalNum}>
                      <Icon type='bell' style={{fontSize: 24}} />
                    </Badge>
                    <span className={styles.iconBtnText}>消息中心</span>
                  </a>
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
