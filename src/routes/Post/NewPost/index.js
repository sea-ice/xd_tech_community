import React, { Component } from 'react';
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router'
import { Spin } from 'antd'

import { checkLogin } from 'utils'

import styles from './index.scss'
import config from 'config/constants'
import PublishPost from 'components/common/FixedHeader'

@connect(state => ({
  loginUserId: state.user.userId,
  validDraftId: state.postCURD.validDraftId
}))
@withRouter
@checkLogin({
  // 先验证用户是否登录，再验证用户是否用权限编辑当前的帖子
  *checkLoginFinish(userInfo, { put }, props) {
    let { match: { params }, validDraftId } = props
    // validDraftId可能取值：null、false、合法的id整数值
    if (userInfo && userInfo.userId) {
      if (validDraftId !== Number(params.id)) {
        yield put({
          type: 'postCURD/checkDraftExists',
          payload: {
            draftId: Number(params.id),
            authorId: userInfo.userId
          }
        })
      }
    } else {
      // 用户未登录跳转到草稿编辑页面则直接重定向到404
      yield put({
        type: 'postCURD/setState',
        payload: { validDraftId: false }
      })
    }
  }
})
class NewPost extends Component {
  constructor(props) {
    super(props)
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    let { dispatch } = nextProps
    if (nextProps.validDraftId === false) {
      dispatch(routerRedux.push('/404'))
    }
  }
  render() {
    let {
      validDraftId,
      match: { params }
    } = this.props
    return (
      validDraftId !== Number(params.id) ? (
        <div className={styles.spinWrapper}>
          <Spin tip="加载中..." />
        </div>
      ) : (
        <PublishPost loadDraft={true} />
      )
    )
  }
}

NewPost.propTypes = {
};

export default NewPost;
