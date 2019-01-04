import React, {Component} from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router'
import { Spin } from 'antd'

import {checkLogin} from 'utils'

import styles from './index.scss'
import FixedHeader from 'components/common/FixedHeader'
import OwnerView from './OwnerView'
import GuestView from './GuestView'

@connect(state => ({
  validAuthorId: state.author.validAuthorId,
  loginUserId: state.user.userId,
}))
@withRouter
@checkLogin({
  // 先验证用户是否登录，再验证跳转的用户主页是否存在
  *checkLoginFinish(userInfo, { put }, props) {
    let { match: { params }, loginUserId, validAuthorId } = props
    let authorId = Number(params.id)
    if (validAuthorId === authorId) return

    yield put({
      type: 'author/checkAuthorExists',
      payload: {
        authorId,
        loginUserId
      }
    })
  }
})
class AuthorDetail extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    let {
      dispatch, match: { params }, history,
      validAuthorId, loginUserId } = nextProps
    if (nextProps.validAuthorId === false) {
      return dispatch(routerRedux.push('/404'))
    }
    if (
      history.action === 'PUSH' &&
      Number(params.id) !== validAuthorId
    ) {
      // 在当前用户主页跳到另外一个用户主页时需要检查新的用户id是否存在
      dispatch({
        type: 'author/checkAuthorExists',
        payload: {
          authorId: Number(params.id),
          validAuthorId,
          loginUserId
        }
      })
    }
  }
  render () {
    let {
      loginUserId,
      validAuthorId,
      match: { params }
    } = this.props

    return (
      (validAuthorId !== Number(params.id)) ? (
        <div className={styles.spinWrapper}>
          <Spin tip="加载中..." />
        </div>
      ) : (
        <div>
          <FixedHeader />
          <main className="app-main">
            {
              loginUserId === validAuthorId ? (
                <OwnerView authorId={validAuthorId} />
              ) : (
                <GuestView authorId={validAuthorId} />
              )
            }
          </main>
        </div>
      )
    );
  }
}

AuthorDetail.propTypes = {
};

export default AuthorDetail;
