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
import { checkLogin, privateMsgItemStandardProps } from 'utils'

@connect(state => ({
  loginUserId: state.user.userId,
  privateMsgs: state.privateMsg
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
    activeTabKey: 'private'
  }
  constructor(props) {
    super(props)
    this.onTabsChange = this.onTabsChange.bind(this)
    this.checkAllNotify = this.checkAllNotify.bind(this)
    this.onMsgPageChange = this.onMsgPageChange.bind(this)
  }
  onTabsChange(activeTabKey) {
    this.setState({ activeTabKey })
  }
  checkAllNotify() {
    let { dispatch, loginUserId } = this.props
    dispatch({
      type: 'privateMsg/setAllMsgRead',
      payload: { userId: loginUserId }
    })
  }
  UNSAFE_componentWillMount() {
    let { dispatch } = this.props
    dispatch({
      type: 'privateMsg/setState',
      payload: { loading: true }
    })
  }
  onMsgPageChange(page) {
    let { dispatch, loginUserId } = this.props
    dispatch({
      type: 'privateMsg/getPageData',
      payload: {
        userId: loginUserId,
        page,
        number: 10
      }
    })
  }
  render() {
    let { privateMsgs } = this.props
    let checkIconOpt = {
      lineHeight: '45px',
      btnPadding: 0,
      onClick: this.checkAllNotify
    }
    let iconStyle = { fontSize: 60, color: '#999' }

    let { activeTabKey } = this.state
    let unReadNum = activeTabKey === 'private' ? privateMsgs.unReadNum : 0
    return (
      <div>
        <FixedHeader />
        <main className="app-main">
          <Row gutter={20}>
            <Col span={18} offset={3}>
              <div className={styles.tabWrapper}>
                <Tabs tabBarExtraContent={
                  !!unReadNum ? (
                    <Confirm
                      triggerModalBtn={
                        <IconBtn
                          iconClassName={styles.checkIcon}
                          bgImage={`${config.SUBDIRECTORY_PREFIX}/assets/check.svg`}
                          iconBtnText={`全部标为已读(未读:${unReadNum})`}
                          {...checkIconOpt} />
                      }
                      modalTitle="提示"
                      children={<p>确定要将所有的未读私信都设置为已读吗？</p>}
                      handleOk={this.checkAllNotify}
                    />
                  ) : null
                } onChange={this.onTabsChange}>
                  <Tabs.TabPane tab="私信" key="private">
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
                                          updateCurrentPage={() => this.onMsgPageChange(currentPage)}
                                        />))}
                                      {
                                        total > 10 ? (
                                          <div className={styles.paginatorWrapper}>
                                            <Pagination total={total} defaultCurrent={currentPage}
                                              onChange={this.onMsgPageChange} />
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
                  <Tabs.TabPane tab="用户消息" key="user">

                  </Tabs.TabPane>
                  <Tabs.TabPane tab="系统消息" key="sys">

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
