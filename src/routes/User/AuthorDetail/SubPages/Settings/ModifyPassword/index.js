import React, { Component } from 'react';
import { connect } from 'dva'
import { Breadcrumb, Steps, Icon } from 'antd'

import styles from './index.scss'
import CheckOldPassword from './CheckOldPassword'
import ModifyPasswordForm from './ModifyPasswordForm'
import ModifyPasswordDone from './ModifyPasswordDone'

class ForgetPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      registerStep: 1,
    }
    this.turnToNextPage = this.turnToNextPage.bind(this)
  }
  turnToNextPage() {
    let { registerStep } = this.state
    this.setState({ registerStep: registerStep + 1 })
  }
  render() {
    let { loginUserId } = this.props
    let { registerStep } = this.state
    let showPage
    switch (registerStep) {
      case 1:
        showPage = <CheckOldPassword onComplete={this.turnToNextPage} />
        break
      case 2:
        showPage = <ModifyPasswordForm onComplete={this.turnToNextPage} />
        break
      case 3:
        showPage = <ModifyPasswordDone />
        break
      default:
        break
    }
    return (
      <div>
        <header className={styles.breadCrumbWrapper}>
          <p>当前位置：</p>
          <Breadcrumb>
            <Breadcrumb.Item ><a href={`/author/${loginUserId}?tab=settings`}>设置</a></Breadcrumb.Item>
            <Breadcrumb.Item>修改登录密码</Breadcrumb.Item>
          </Breadcrumb>
        </header>
        <div className={styles.registerWrapper}>
          <div className={styles.stepsWrapper}>
            <Steps>
              <Steps.Step status={registerStep !== 1 ? 'finish' : 'process'} title="验证" icon={<Icon type="mobile" />} />
              <Steps.Step status={(registerStep >= 2) ? (registerStep === 2) ? 'process' : 'finish' : 'wait'} title="修改密码" icon={<Icon type="lock" />} />
              <Steps.Step status={(registerStep >= 3) ? (registerStep === 3) ? 'process' : 'finish' : 'wait'} title="完成" icon={<Icon type="smile-o" />} />
            </Steps>
          </div>
          <main className={styles.registerMain}>
            {showPage}
          </main>
        </div>
      </div>

    );
  }
}

ForgetPassword.propTypes = {
};

export default connect(state => ({
  loginUserId: state.user.userId,
}))(ForgetPassword);

