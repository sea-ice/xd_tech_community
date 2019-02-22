import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Input, message } from 'antd'

import styles from './index.scss'
import Confirm from 'components/common/Confirm'
import ConfirmIfNotMeet from 'components/common/ConfirmIfNotMeet'

@connect(state => ({
  userId: state.user.userId
}))
class PrivateMsgBtn extends Component {
  state = {
    msg: ''
  };
  constructor(props) {
    super(props)
    this.onMsgChange = this.onMsgChange.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }
  sendMessage() {
    return new Promise((resolve, reject) => {
      let { msg } = this.state
      if (!msg.trim()) {
        message.error('请输入私信内容！')
        return reject()
      }
      let { dispatch, userId, receiverId } = this.props
      dispatch({
        type: 'privateMsgs/send',
        payload: {
          userId, receiverId,
          content: msg,
          successCallback() {
            message.success('私信发送成功！')
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
  onMsgChange(e) {
    this.setState({ msg: e.target.value })
  }
  render() {
    let { userId, btn } = this.props
    let { msg } = this.state
    return (
      !!userId ? (
        <Confirm
          triggerModalBtn={ btn }
          modalTitle="私信"
          confirmBtnText="发送"
          handleOk={this.sendMessage}
        >
          <p>有什么想对我说的，欢迎给我留言！</p>
          <Input.TextArea placeholder="请输入私信内容" value={msg} onChange={this.onMsgChange}></Input.TextArea>
        </Confirm>
      ) : (
        <ConfirmIfNotMeet condition={false} btn={ btn } />
      )
    );
  }
}

PrivateMsgBtn.propTypes = {
  btn: PropTypes.element,
  receiverId: PropTypes.number
};

export default PrivateMsgBtn;
