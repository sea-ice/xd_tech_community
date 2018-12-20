import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Radio } from 'antd'

import styles from './index.scss'

class ReportUserForm extends Component {
  constructor (props) {
    super(props)
    this.onReasonChange = this.onReasonChange.bind(this)
    this.state = {
      reason: null
    }
  }
  componentDidMount() {
    this.props.onRef(this)
  }
  onReasonChange(e) {
    this.setState({ reason: e.target.value })
  }
  getReportReason () {
    return this.state.reason
  }
  render() {
    let { reason } = this.state
    let radioStyle = { display: 'block', lineHeight: '30px' }
    return (
      <form className="reportForm">
        <p><span className={styles.colorRed}>*</span>请选择举报缘由：</p>
        <Radio.Group onChange={this.onReasonChange} value={reason}>
          <Radio style={radioStyle} value={0}>小广告</Radio>
          <Radio style={radioStyle} value={1}>淫秽色情</Radio>
          <Radio style={radioStyle} value={2}>人身攻击</Radio>
          <Radio style={radioStyle} value={3}>虚假信息</Radio>
        </Radio.Group>
      </form>
    );
  }
}
// 此组件只对外提供举报用户的原因，和举报类型无关
ReportUserForm.propTypes = {
  onRef: PropTypes.func,
};

export default connect()(ReportUserForm);
