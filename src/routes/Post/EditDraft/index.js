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
  newPostFlag: state.postCURD.newPostFlag,
  validDraftId: state.postCURD.validDraftId
}))
@withRouter
@checkLogin({
  // 先验证用户是否登录，再验证用户是否用权限编辑当前的帖子
  *checkLoginFinish(userInfo, { put }, props) {
    let { match: { params }, newPostFlag, validDraftId } = props

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
class EditDraft extends Component {
  constructor(props) {
    super(props)
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    let {
      dispatch, match: { params }
    } = nextProps
    if (nextProps.validDraftId === false) {
      dispatch(routerRedux.push('/404'))
    } else if (
      nextProps.validDraftId === config.statusCodes.SERVER_ERROR
    ) {
      dispatch(routerRedux.push('/500'))
    }
  }
  componentDidMount() {
    let { newPostFlag } = this.props
    if (newPostFlag) {
      this.setState({
        title: '',
        content: ''
      })
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

EditDraft.propTypes = {
};

export default EditDraft;
