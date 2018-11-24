import React, {Component} from 'react';
import { connect } from 'dva';
// import {Row, Col, Button, Popover, Icon} from 'antd'

import styles from './index.scss'

class ReportUserForm extends Component {
  constructor (props) {
    super(props)
    let {match} = props
    console.log(match)
  }
  getReportInfo () {
    // check
  }
  render () {
    return (
      <form className="reportForm">
        <h3>提交举报的缘由</h3>
      </form>
    );
  }
}

ReportUserForm.propTypes = {
};

export default connect()(ReportUserForm);
