import React, {Component} from 'react'
import { Row, Col, Steps, Icon } from 'antd'

import styles from './index.scss'
import FixedHeader from 'components/common/FixedHeader'
import CheckPhone from './CheckPhone'
import RegisterForm from './RegisterForm'
import RegisterDone from './RegisterDone'

class UserRegisterPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      registerStep: 1,
    }
    this.turnToNextPage = this.turnToNextPage.bind(this)
  }
  turnToNextPage () {
    let { registerStep } = this.state
    this.setState({ registerStep: registerStep + 1 })
  }
  render () {
    let { registerStep } = this.state
    let showPage
    switch (registerStep) {
      case 1:
        showPage = <CheckPhone onComplete={this.turnToNextPage} />
        break
      case 2:
        showPage = <RegisterForm onComplete={this.turnToNextPage} />
        break
      case 3:
        showPage = <RegisterDone />
        break
      default:
        break
    }
    return (
      <div className={styles.scrollContainer}>
        <FixedHeader />
        <main className="app-main">
          <Row type="flex" justify="center">
            <Col span={16}>
              <div className={styles.registerWrapper}>
                <header className={styles.header}>
                  <h4>新用户注册</h4>
                </header>
                <div className={styles.stepsWrapper}>
                  <Steps>
                    <Steps.Step status={registerStep !== 1 ? 'finish' : 'process'} title="手机号验证" icon={<Icon type="mobile" />} />
                    <Steps.Step status={(registerStep >= 2) ? (registerStep === 2) ? 'process' : 'finish' : 'wait'} title="填写密码" icon={<Icon type="lock" />} />
                    <Steps.Step status={(registerStep >= 3) ? (registerStep === 3) ? 'process' : 'finish' : 'wait'} title="完成" icon={<Icon type="smile-o" />} />
                  </Steps>
                </div>
                <main className={styles.registerMain}>
                  {showPage}
                </main>
              </div>
            </Col>
          </Row>
        </main>
      </div>
    );
  }
}

UserRegisterPage.propTypes = {
};

export default UserRegisterPage
