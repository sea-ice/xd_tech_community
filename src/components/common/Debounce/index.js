import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux, withRouter } from 'dva/router'
import { message } from 'antd'

import styles from './index.scss'
import config from 'config/constants'
import Confirm from '../Confirm'

@connect()
@withRouter
class Debounce extends Component {
  constructor(props) {
    super(props)
    this.changeState = this.changeState.bind(this)
    this.disabled = false
  }
  changeState() {
    let { dispatch, actionType, extraPayload, userId, update } = this.props
    if (this.disabled) return
    this.disabled = true
    let hideLoading = message.loading('加载中', 0)
    dispatch({
      type: actionType,
      payload: {
        userId,
        ...extraPayload,
        successCallback: () => {
          update()
          this.disabled = false
          hideLoading()
          message.success('操作成功！')
        },
        failCallback: () => {
          this.disabled = false
          hideLoading()
          message.error('请稍后再试！')
        }
      }
    })
  }
  render() {
    let { userId, dispatch, btn, btnProps, location: { pathname } } = this.props

    return !!userId ? (
      React.cloneElement(btn, {
        onClick: this.changeState,
        ...btnProps
      })
    ) : (
        <Confirm
          triggerModalBtn={React.cloneElement(btn, btnProps)}
          modalTitle="提示"
          confirmBtnText="去登录"
          children={<p>完成后续操作需要登录，是否继续？</p>}
          handleOk={() => {
            dispatch({
              type: 'user/setLoginSuccessPage',
              payload: { page: pathname }
            })
            dispatch(routerRedux.push(`/login`))
          }}
        />
    )
  }
}

Debounce.propTypes = {
  btn: PropTypes.element,
  btnProps: PropTypes.object,
  actionType: PropTypes.string,
  extraPayload: PropTypes.object,
  userId: PropTypes.number,
  update: PropTypes.func
};

export default Debounce;
