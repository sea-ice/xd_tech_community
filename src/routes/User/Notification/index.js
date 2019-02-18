import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Tabs, Icon, Pagination, Spin } from 'antd'

import styles from './index.scss'
import config from 'config/constants'
import FixedHeader from 'components/common/FixedHeader'
import Confirm from 'components/common/Confirm'
import IconBtn from 'components/common/IconBtn'
import PrivateMsgItem from './PrivateMsgItem'
import FilledContentMsgItem from './FilledContentMsgItem'
import { checkLogin, privateMsgItemStandardProps } from 'utils'

@connect(state => ({
  loginUserId: state.user.userId,
  privateMsgs: state.msgs.privateMsgs,
  userMsgs: state.msgs.userMsgs,
  sysMsgs: state.msgs.sysMsgs
}))
@checkLogin({
  // 用户如果未登录，则跳转到404页面
  *checkLoginFinish(userInfo, { put }, props) {
    if (!userInfo) {
      yield put(routerRedux.push('/404'))
    } else {
      let { userId } = userInfo
      yield put({
        type: 'firstScreenRender/notifyMsgPage',
        payload: { userId }
      })
    }
  }
})
class Notification extends Component {
  state = {
    activeTabKey: 'privateMsgs'
  }
  constructor(props) {
    super(props)
    this.onTabsChange = this.onTabsChange.bind(this)
    this.checkAllNotify = this.checkAllNotify.bind(this)
    this.onMsgPageChange = this.onMsgPageChange.bind(this)
  }
  onTabsChange(activeTabKey) {
    let { dispatch, loginUserId } = this.props
    this.setState({ activeTabKey })
    dispatch({
      type: `${activeTabKey}/getPageData`,
      payload: {
        userId: loginUserId,
        page: 1,
        number: 10
      }
    })
  }
  checkAllNotify() {
    let { dispatch, loginUserId } = this.props
    dispatch({
      type: `${this.state.activeTabKey}/setAllMsgRead`,
      payload: { userId: loginUserId }
    })
  }
  // UNSAFE_componentWillMount() {
  //   let { dispatch } = this.props
  //   dispatch({
  //     type: 'privateMsgs/setState',
  //     payload: { loading: true }
  //   })
  // }
  onMsgPageChange(msgType, page) {
    let { dispatch, loginUserId } = this.props
    console.log(`page: ${page}`)
    dispatch({
      type: `${msgType}/getPageData`,
      payload: {
        userId: loginUserId,
        page,
        number: 10
      }
    })
  }
  render() {
    let { privateMsgs, userMsgs, sysMsgs } = this.props
    let checkIconOpt = {
      lineHeight: '45px',
      btnPadding: 0,
      onClick: this.checkAllNotify
    }
    let iconStyle = { fontSize: 60, color: '#999' }

    let { activeTabKey } = this.state
    let unreadNum = activeTabKey === 'privateMsgs' ?
      privateMsgs.unreadNum :
      activeTabKey === 'userMsgs' ?
        userMsgs.unreadNum : sysMsgs.unreadNum

    return (
      <div className={styles.scrollContainer}>
        <FixedHeader />
        <main className="app-main">
          <Row gutter={20}>
            <Col span={18} offset={3}>
              <div className={styles.tabWrapper}>
                <Tabs tabBarExtraContent={
                  !!unreadNum ? (
                    <Confirm
                      triggerModalBtn={
                        <IconBtn
                          iconClassName={styles.checkIcon}
                          bgImage={`${config.SUBDIRECTORY_PREFIX}/assets/check.svg`}
                          iconBtnText={`全部标为已读(未读:${unreadNum}条)`}
                          {...checkIconOpt} />
                      }
                      modalTitle="提示"
                      children={<p>确定要将所有的未读私信都设置为已读吗？</p>}
                      handleOk={this.checkAllNotify}
                    />
                  ) : null
                } onChange={this.onTabsChange}>
                  <Tabs.TabPane tab={`私信(${privateMsgs.total})`} key="privateMsgs">
                    <div className={styles.msgList}>
                      {
                        (({ loading, error, total, msgs, currentPage }) => (
                          loading ? <div className={styles.spinWrapper}><Spin tip="加载中..." /></div> : (
                            error ? (
                              <div className={styles.iconWrapper}>
                                <Icon type="frown" style={iconStyle} />
                                <p>加载失败，请稍后再试！</p>
                              </div>
                            ) : (
                                !total ? (
                                  <div className={styles.iconWrapper}>
                                    <Icon type="inbox" style={iconStyle} />
                                    <p>还没有任何私信来往</p>
                                  </div>
                                ) : (
                                    <React.Fragment>
                                      {msgs.map(item => (
                                        <PrivateMsgItem
                                          key={item.id}
                                          {...privateMsgItemStandardProps(item)}
                                          updateCurrentPage={() => this.onMsgPageChange('privateMsgs', currentPage)}
                                        />))}
                                      {
                                        total > 10 ? (
                                          <div className={styles.paginatorWrapper}>
                                            <Pagination total={total} defaultCurrent={currentPage}
                                              onChange={page => this.onMsgPageChange('privateMsgs', page)} />
                                          </div>
                                        ) : null
                                      }
                                    </React.Fragment>
                                  )
                              )
                          )
                        ))(privateMsgs)
                      }
                    </div>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={`用户消息(${userMsgs.total})`} key="userMsgs">
                    <div className={styles.msgList}>
                      {
                        (({ loading, error, total, msgs, currentPage }) => (
                          loading ? <div className={styles.spinWrapper}><Spin tip="加载中..." /></div> : (
                            error ? (
                              <div className={styles.iconWrapper}>
                                <Icon type="frown" style={iconStyle} />
                                <p>加载失败，请稍后再试！</p>
                              </div>
                            ) : (
                                !total ? (
                                  <div className={styles.iconWrapper}>
                                    <Icon type="inbox" style={iconStyle} />
                                    <p>还没有收到用户消息</p>
                                  </div>
                                ) : (
                                    <React.Fragment>
                                      {msgs.map(item => (
                                        <FilledContentMsgItem
                                          key={item.object.notificationId}
                                          msgType='userMsgs'
                                          {...item }
                                          updateCurrentPage={() => this.onMsgPageChange('userMsgs', currentPage)}
                                        />))}
                                      {
                                        total > 10 ? (
                                          <div className={styles.paginatorWrapper}>
                                            <Pagination total={total} defaultCurrent={currentPage}
                                              onChange={page => this.onMsgPageChange('userMsgs', page)} />
                                          </div>
                                        ) : null
                                      }
                                    </React.Fragment>
                                  )
                              )
                          )
                        ))(userMsgs)
                      }
                    </div>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={`系统消息(${sysMsgs.total})`} key="sysMsgs">
                    <div className={styles.msgList}>
                      {
                        (({ loading, error, total, msgs, currentPage }) => (
                          loading ? <div className={styles.spinWrapper}><Spin tip="加载中..." /></div> : (
                            error ? (
                              <div className={styles.iconWrapper}>
                                <Icon type="frown" style={iconStyle} />
                                <p>加载失败，请稍后再试！</p>
                              </div>
                            ) : (
                                !total ? (
                                  <div className={styles.iconWrapper}>
                                    <Icon type="inbox" style={iconStyle} />
                                    <p>还没有收到系统消息</p>
                                  </div>
                                ) : (
                                    <React.Fragment>
                                      {msgs.map(item => (
                                        <FilledContentMsgItem
                                          key={item.id}
                                          msgType='sysMsgs'
                                          {...item }
                                          updateCurrentPage={() => this.onMsgPageChange('sysMsgs', currentPage)}
                                        />))}
                                      {
                                        total > 10 ? (
                                          <div className={styles.paginatorWrapper}>
                                            <Pagination total={total} defaultCurrent={currentPage}
                                              onChange={page => this.onMsgPageChange('sysMsgs', page)} />
                                          </div>
                                        ) : null
                                      }
                                    </React.Fragment>
                                  )
                              )
                          )
                        ))(sysMsgs)
                      }
                    </div>
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </Col>
          </Row>
        </main>
      </div>
    );
  }
}

Notification.propTypes = {
};

export default Notification;
