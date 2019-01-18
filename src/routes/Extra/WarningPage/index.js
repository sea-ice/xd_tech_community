import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'

import styles from './index.scss'
import IconBtn from 'components/common/IconBtn'

class WarningPage extends Component {
  constructor(props) {
    super(props)
    this.turnToHomePage = this.turnToHomePage.bind(this)
  }
  turnToHomePage() {
    let { dispatch } = this.props
    dispatch(routerRedux.push('/'))
  }
  render() {
    return (
      <div className={styles.fixed}>
        <img src="/assets/404.jpg" alt="" />
        <footer className={styles.footer}>
          <IconBtn
            type="icon"
            iconType="home"
            iconSize={24}
            fontSize={18}
            btnPadding='.2rem'
            iconBtnText="返回首页"
            onClick={this.turnToHomePage}
          />
        </footer>
        <img
          src="/assets/logo.png" alt=""
          className={styles.logo}
          onClick={this.turnToHomePage}
        />
      </div>
    );
  }
}

WarningPage.propTypes = {
};

export default connect()(WarningPage);
