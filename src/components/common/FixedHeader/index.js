import React, {Component} from 'react'
import {Input, Badge, Icon, Avatar, message} from 'antd'
import {connect} from 'dva'
import {routerRedux, withRouter, Link} from 'dva/router'

import IconBtn from '../IconBtn'
import styles from './index.css'

@connect(state => ({
  userId: state.user.userId,
  userToken: state.user.userToken,
  userInfo: state.user.userInfo
}))
class FixedHeader extends Component {
  constructor (props) {
    super(props)
    this.handleUserSearch = this.handleUserSearch.bind(this)
    this.toRegister = this.toRegister.bind(this)
    this.toLogin = this.toLogin.bind(this)
    this.toLogout = this.toLogout.bind(this)
  }
  handleUserSearch () {

  }
  toRegister () {
    let {dispatch} = this.props
    dispatch(routerRedux.push('/register'))
  }
  toLogin () {
    let {dispatch} = this.props
    dispatch(routerRedux.push('/login'))
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
  render () {
    let Search = Input.Search
    let {userId, userToken, userInfo} = this.props
    let userLogined = !!(userId && userToken && userInfo)
    return (
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>源来，西电人的技术社区</h1>
          <main className={styles.headerMain}>
            <Search
              placeholder="发现更多有趣的"
              onSearch={this.handleUserSearch}
              enterButton />
            <Link to="/publish" className={styles.btnYl}>
              <i className="fa fa-bullhorn"></i>
              <span>发帖</span>
            </Link>
            <div className={styles.appLink}>
              <IconBtn iconClassName={styles.flyIcon} iconBtnText="APP" color="#999" fontSize=".28rem" />
            </div>
            <div className={styles.msgNotify}>
              <Badge count={4}>
                <a href="javascript:void(0);" className={styles.msgNotifyIcon}>
                  <Icon type="notification" theme="twoTone" style={{fontSize: '.4rem', padding: '.05rem'}} />
                </a>
              </Badge>
            </div>
            <div className={styles.loginUserInfo}>
              {/* <Avatar src='../../../assets/yay.jpg' /> */}
              {
                userLogined ? (
                  <React.Fragment>
                    <Avatar src={userInfo.avator} />
                    <span className={styles.nickName}>{userInfo.nickName}</span>
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
