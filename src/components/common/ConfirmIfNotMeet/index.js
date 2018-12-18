import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { routerRedux, withRouter } from 'dva/router'

import config from 'config/constants'
import Confirm from '../Confirm'

@connect()
@withRouter
class ConfirmIfNotMeet extends Component {
  render() {
    let { dispatch, condition, btn, callbackWhenMeet, ...confirmOptions } = this.props
    let { location: { pathname } } = this.props
    // 默认选项
    confirmOptions = Object.assign({
      modalTitle: '提示',
      confirmBtnText: '去登录',
      children: <p>完成后续操作需要登录，是否继续？</p>,
      handleOk: () => {
        dispatch({
          type: 'user/setLoginSuccessPage',
          payload: { page: pathname }
        })
        dispatch(routerRedux.push(`/login`))
      }
    }, confirmOptions)
    return (
      condition ? React.cloneElement(btn, {
        onClick: callbackWhenMeet
      }) : (
        <Confirm
          triggerModalBtn={btn}
          {...confirmOptions}
        />
      )
    );
  }
}

ConfirmIfNotMeet.propTypes = {
  condition: PropTypes.bool,
  btn: PropTypes.element,
  callbackWhenMeet: PropTypes.func
};

export default ConfirmIfNotMeet;
