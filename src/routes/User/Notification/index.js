import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Row, Col, Tabs } from 'antd'

import styles from './index.scss'
import config from 'config/constants'
import FixedHeader from 'components/common/FixedHeader'
import IconBtn from 'components/common/IconBtn'
import { checkLogin } from 'utils'

@connect(state => ({
  notifies: state.notify.notifies
}))
@checkLogin({
  // 用户如果未登录，则跳转到404页面
  *checkLoginFinish(userInfo, { put }, props) {
    // if (!userInfo) {
    //   yield put(routerRedux.push('/404'))
    // } else {
    //   let { userId } = userInfo
    //   yield put({
    //     type: 'notify/notifyMsgPage',
    //     payload: { userId: 115 }
    //   })
    // }
  }
})
class Notification extends Component {
  constructor(props) {
    super(props)
    this.checkAllNotify = this.checkAllNotify.bind(this)
  }
  checkAllNotify() {

  }
  render() {
    let checkIconOpt = {
      lineHeight: '45px',
      onClick: this.checkAllNotify
    }
    return (
      <React.Fragment>
        <FixedHeader />
        <main className="app-main">
          <Row gutter={20}>
            <Col span={18} offset={3}>
              <div className={styles.tabWrapper}>
                <Tabs tabBarExtraContent={
                  <IconBtn
                    iconClassName={styles.checkIcon}
                    bgImage={`${config.SUBDIRECTORY_PREFIX}/assets/check.svg`}
                    iconBtnText="全部标为已读"
                    {...checkIconOpt} />
                }>
                  <Tabs.TabPane tab="私信" key="private">

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
      </React.Fragment>
    );
  }
}

Notification.propTypes = {
};

export default Notification;
