import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import {Modal, Button} from 'antd'

class Confirm extends Component {
  state = {
    show: false,
    loading: false
  };

  constructor (props) {
    super(props)
    let {triggerModalBtn} = props
    this.triggerModalBtnClickHandler = this.triggerModalBtnClickHandler.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)

    this.triggerModalBtn = this.bindClickHandler(triggerModalBtn)
  }

  bindClickHandler (c) {
    return React.cloneElement(c, {
      onClick: this.triggerModalBtnClickHandler
    })
  }

  triggerModalBtnClickHandler () {
    this.setState({show: true})
  }

  handleOk () {
    this.setState({loading: true})
  }

  handleCancel () {
    this.setState({show: false})
  }

  render () {
    let {
      modalTitle,
      children,
      singleBtn,
      confirmBtnText = '确定',
      cancelBtnText = '取消'
    } = this.props
    let {show, loading} = this.state

    let footer = [
      <Button key="confirm" type="primary" loading={loading} onClick={this.handleOk}>
        {confirmBtnText}
      </Button>
    ]
    if (!singleBtn) footer.unshift(
      <Button key="back" onClick={this.handleCancel}>{cancelBtnText}</Button>
    )
    return (
      <div className="confirm">
        {this.triggerModalBtn}
        <Modal
          visible={show}
          title={modalTitle}
          onCancel={this.handleCancel}
          footer={footer}
        >
          {children}
        </Modal>
      </div>
    );
  }
}

Confirm.propTypes = {
  triggerModalBtn: PropTypes.element,
  modalTitle: PropTypes.string,
  singleBtn: PropTypes.bool,
  confirmBtnText: PropTypes.string,
  cancelBtnText: PropTypes.string
};

export default connect()(Confirm);
