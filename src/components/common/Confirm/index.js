import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import {Modal, Button} from 'antd'

class Confirm extends Component {
  constructor (props) {
    super(props)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.triggerModalBtnClickHandler = this.triggerModalBtnClickHandler.bind(this)

    this.state = {
      show: false,
      loading: false
    }
  }

  triggerModalBtnClickHandler () {
    let { beforeShowModal } = this.props
    beforeShowModal = beforeShowModal || (() => Promise.resolve())
    let res = beforeShowModal()

    if (res && res.then) {
      res.then(res => {
        this.setState({ show: true })
      })
    } else {
      this.setState({ show: true })
    }
  }

  handleOk() {
    let { handleOk, doneCallback } = this.props
    handleOk = handleOk || (() => Promise.resolve())
    // doneCallback = doneCallback || (() => Promise.resolve(true))
    this.setState({ loading: true })
    let res = handleOk()
    if (res && res.then) {
      res.then(close => {
        // doneCallback(res).then(hideConfirm => {
        //   if (hideConfirm) this.setState({ show: false })
        // })
        if (close) {
          this.setState({ show: false })
        }
      }).finally(() => {
        this.setState({ loading: false })
      })
    } else {
      this.setState({ loading: false, show: false })
    }
  }

  handleCancel () {
    this.setState({ show: false })
  }

  render () {
    let {
      modalTitle,
      children,
      singleBtn,
      confirmBtnText = '确定',
      cancelBtnText = '取消',
      triggerModalBtn
    } = this.props
    let { show, loading } = this.state
    console.log(`show`)
    console.log(show)

    let footer = [
      <Button key="confirm" type="primary" loading={loading} onClick={this.handleOk}>
        {loading ? '加载中' : confirmBtnText}
      </Button>
    ]
    if (!singleBtn) footer.unshift(
      <Button key="back" onClick={this.handleCancel}>{cancelBtnText}</Button>
    )
    return (
      <React.Fragment>
        {React.cloneElement(triggerModalBtn, {
          onClick: this.triggerModalBtnClickHandler
        })}
        <Modal
          visible={show}
          title={modalTitle}
          onCancel={this.handleCancel}
          footer={footer}
        >
          {children}
        </Modal>
      </React.Fragment>
    );
  }
}

Confirm.propTypes = {
  triggerModalBtn: PropTypes.element,
  beforeShowModal: PropTypes.func,
  modalTitle: PropTypes.string,
  singleBtn: PropTypes.bool,
  confirmBtnText: PropTypes.string,
  cancelBtnText: PropTypes.string,
  handleOk: PropTypes.func, // 点击确认回调，需要返回一个Promise对象
  // doneCallback: PropTypes.func // 处理完成后回调，同样需要返回一个Promise对象
};

export default connect()(Confirm);
