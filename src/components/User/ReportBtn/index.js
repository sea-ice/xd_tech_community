import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { message } from 'antd'

import styles from './index.scss'
import Confirm from 'components/common/Confirm'
import ConfirmIfNotMeet from 'components/common/ConfirmIfNotMeet'
import ReportUserForm from 'components/User/ReportUserForm'

class ReportBtn extends Component {
  constructor(props) {
    super(props)
    this.submitReport = this.submitReport.bind(this)
  }
  submitReport() {
    return new Promise((resolve, reject) => {
      let reason = this.reportForm.getReportReason()
      if (reason === null) {
        message.error('请选择举报原因！')
        return reject()
      }
      let { dispatch, objectId, objectType, userId } = this.props
      dispatch({
        type: 'userBehaviors/reportUser',
        payload: {
          objectId, objectType,
          reason, userId,
          successCallback() {
            message.success('举报成功！')
            resolve(true)
          },
          failCallback() {
            message.success('操作失败，请稍后再试！')
            reject()
          }
        }
      })
    })
  }
  render() {
    let { userId } = this.props
    return (
      !!userId ? (
        <Confirm
          triggerModalBtn={
            <a href="javascript:void(0);"
              className={styles.reportBtn}>举报该用户</a>
          }
          modalTitle="请认真填写举报信息"
          confirmBtnText="提交"
          handleOk={this.submitReport}
        >
          <ReportUserForm onRef={form => this.reportForm = form} />
        </Confirm>
      ) : (
        <ConfirmIfNotMeet
          condition={false}
          btn={
            <a href="javascript:void(0);"
              className={styles.reportBtn}>举报该用户</a>
        } />
      )
    );
  }
}

ReportBtn.propTypes = {
  objectType: PropTypes.number,
  objectId: PropTypes.number,
  userId: PropTypes.number,
};

export default connect()(ReportBtn);
