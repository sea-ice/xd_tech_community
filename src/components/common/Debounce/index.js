import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux, withRouter } from 'dva/router'

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
    let { dispatch, actionType, extraPayload, userId, active, update } = this.props
    if (this.disabled) return
    this.disabled = true
    dispatch({
      type: actionType,
      payload: {
        state: !active,
        userId,
        ...extraPayload,
        successCallback: () => {
          update(!active)
          this.disabled = false
        },
        failCallback: () => {
          this.disabled = false
        }
      }
    })
  }
  render() {
    let { userId, dispatch, btn, active, number, normalText = '%n人喜欢', activeText, activeStyle } = this.props
    let btnProps = active ? activeStyle : {}
    activeText = activeText || normalText
    let text = active ? activeText : normalText
    let iconBtnText = (number === undefined) ? text : text.replace(/%n/g, number)

    let { location: { pathname } } = this.props

    return !!userId ? (
      React.cloneElement(btn, {
        onClick: this.changeState,
        iconBtnText,
        ...btnProps
      })
    ) : (
        <Confirm
          triggerModalBtn={
            React.cloneElement(btn, {
              iconBtnText
            })
          }
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
  active: PropTypes.bool,
  number: PropTypes.number,
  normalText: PropTypes.string,
  activeText: PropTypes.string,
  activeStyle: PropTypes.object,
  actionType: PropTypes.string,
  extraPayload: PropTypes.object,
  userId: PropTypes.number
};

export default Debounce;
