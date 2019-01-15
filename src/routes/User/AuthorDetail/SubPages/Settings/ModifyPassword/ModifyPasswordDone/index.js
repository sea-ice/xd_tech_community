import React, {Component} from 'react';
import { Button } from 'antd'
import { connect } from 'dva';
import { routerRedux } from 'dva/router'

import config from 'config/constants'
import styles from './index.scss'

class ModifyPasswordDone extends Component {
  constructor (props) {
    super(props)
    this.backToHomepage = this.backToHomepage.bind(this)
  }

  backToHomepage () {
    let { dispatch, loginUserId } = this.props
    dispatch(routerRedux.push(`/author/${loginUserId}`))
  }

  render () {

    return (
      <main className={styles.wrapper}>
        <img src={`${config.SUBDIRECTORY_PREFIX}/assets/yay.jpg`} alt=""/>
        <h2>密码修改成功!</h2>
        <Button type="primary" onClick={this.backToHomepage}>返回个人主页</Button>
      </main>
    );
  }
}

ModifyPasswordDone.propTypes = {
};

export default connect(state => ({
  loginUserId: state.user.userId
}))(ModifyPasswordDone);
