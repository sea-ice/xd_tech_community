import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router'

import { Row, Col, Badge, Icon, Button, Spin, message } from 'antd'
import Html from 'slate-html-serializer'
import { DEFAULT_RULES as rules } from '@canner/slate-editor-html/lib'
import CannerEditor from 'canner-slate-editor'
import { isKeyHotkey } from 'is-hotkey'
import secret from 'config/secret'
/* canner-slate-editor antd styles */
import 'antd/lib/popover/style/index.css'
import 'antd/lib/tabs/style/index.css'
import 'antd/lib/upload/style/index.css'
import 'antd/lib/icon/style/index.css'
import 'antd/lib/tooltip/style/index.css'
import 'antd/lib/input-number/style/index.css'
import 'antd/lib/table/style/index.css'
import 'antd/lib/modal/style/index.css'
import 'antd/lib/alert/style/index.css'

import menuToolbarOption from './toolbar.config'

import styles from './index.scss'
import PublishDrawer from './PublishDrawer'
import { checkLogin } from 'utils'


const HTMLSerializer = new Html({ rules })
const isSaveKey = isKeyHotkey('mod+s')

@connect(state => ({
  editPost: state.postCURD.editPost,
  userId: state.user.userId,
  draftSaveState: state.postCURD.draftSaveState,
  newPostFlag: state.postCURD.newPostFlag,
  validDraftId: state.postCURD.validDraftId
}))
// @withRouter
// @checkLogin({
//   // 先验证用户是否登录，再验证用户是否用权限编辑当前的帖子
//   *checkLoginFinish(userInfo, { put }, props) {
//     let { match: { params }, newPostFlag } = props
//     if (newPostFlag) {
//       // 如果是新建帖子，就不需要检查草稿是否存在
//       // newPostFlag为true只可能由fixedHeader中的发帖按钮触发
//       yield put({
//         type: 'postCURD/setState',
//         payload: { newPostFlag: false }
//       })
//       return
//     }
//     if (userInfo && userInfo.userId) {
//       // 即使已有的validDraftId和当前要访问的草稿id一致，也需要检查草稿是否存在
//       // 因为用户可能在此期间删除了草稿
//       yield put({
//         type: 'postCURD/checkDraftExists',
//         payload: {
//           draftId: Number(params.id),
//           authorId: userInfo.userId
//         }
//       })
//     } else {
//       // 用户未登录跳转到草稿编辑页面则直接重定向到404
//       yield put({
//         type: 'postCURD/setState',
//         payload: { validDraftId: false }
//       })
//     }
//   }
// })
class EditDraft extends Component {
  state = {
    initialized: false,
    value: HTMLSerializer.deserialize(''),
    title: ''
  }
  constructor(props) {
    super(props)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onContentChange = this.onContentChange.bind(this)
    this.onPublish = this.onPublish.bind(this)
  }
  UNSAFE_componentWillMount() {
    let { dispatch, newPostFlag } = this.props
    // 进入当前页面先将validDraftId置为null，并初始化postCURD相关的状态
    if (!newPostFlag) {
      dispatch({
        type: 'postCURD/setState',
        payload: {
          validDraftId: null,
          draftSaveState: 'initial'
        }
      })
    }
  }
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown)
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
  }
  onKeyDown(e) {
    console.log(isSaveKey(e))
    if (isSaveKey(e)) {
      this.saveContent()
      e.preventDefault()
    }
  }

  onTitleChange(e) {
    this.setState({ title: e.target.value })
  }
  saveContent() {
    let { draftSaveState } = this.props
    if (draftSaveState === 'saving') return

    let { value, title, savedHTML } = this.state
    let newHTML = HTMLSerializer.serialize(value)
    if (savedHTML === newHTML) return

    let { dispatch, editPost, userId } = this.props
    dispatch({
      type: 'postCURD/saveDraft',
      payload: {
        ...editPost,
        userId: 115,
        title,
        content: newHTML
      }
    })
  }
  onContentChange({ value }) {
    this.setState({ value })
  }
  onPublish() {
    let { value, title } = this.state
    let content = HTMLSerializer.serialize(value)
    console.log(HTMLSerializer.serialize(value))
    let { dispatch, editPost, userId } = this.props
    dispatch({
      type: 'postCURD/publish',
      payload: {
        ...editPost,
        userId: 115,
        title,
        content,
        successCallback() {
          message.success('发表成功！')
          dispatch(routerRedux.push(`/author/${userId}?tab=my-post`))
        }
      }
    })
  }
  render() {
    let { value } = this.state
    let { draftSaveState } = this.props

    return (
      <div>
        <header className={styles.fixedHeader}>
          <section className={styles.leftSide}>
            <a href="javascript:void(0);" className={styles.returnBtn}>返回</a>
            {
              (function () {
                const iconCommonProps = { theme: "filled" }
                if (draftSaveState === 'initial') {
                  return null
                } else if (draftSaveState === 'unsaved') {
                  return (
                    <p className={styles.draftSaveTips}>
                      <Icon type="exclamation-circle" style={{ color: '#ffe58f' }} {...iconCommonProps} />
                      <span>有未保存的内容</span>
                    </p>)
                } else if (draftSaveState === 'saving') {
                  return (
                    <p className={styles.draftSaveTips}>
                      <Icon type="loading" />
                      <span>正在保存...</span>
                    </p>
                  )
                } else if (draftSaveState === 'success') {
                  return (
                    <p className={styles.draftSaveTips}>
                      <Icon type="check-circle" style={{ color: '#52c41a' }} {...iconCommonProps} />
                      <span>已保存至草稿箱</span>
                    </p>)
                } else if (draftSaveState === 'error') {
                  return (
                    <p className={styles.draftSaveTips}>
                      <Icon type="close-circle" style={{ color: '#ffa39e' }} {...iconCommonProps} />
                      <span>保存失败</span>
                    </p>)
                }
              }())
            }
          </section>

          <section className={styles.rightSide}>
            <PublishDrawer />
            <div className={styles.publishBtn}>
              <Button type="primary" onClick={this.onPublish}>发表</Button>
            </div>
          </section>

        </header>
        <main className={styles.main}>
          <Row>
            <Col span={18} offset={3}>
              <div className={styles.editorWrapper}>
                <div className={styles.titleInputWrapper}>
                  <input type="text" placeholder="请输入标题..." onChange={this.onTitleChange} />
                </div>
                <article className={styles.mainContentWrapper}>
                  {/* <CannerEditor menuToolbarOption={menuToolbarOption} value={value} onChange={this.onContentChange} /> */}
                  <CannerEditor menuToolbarOption={menuToolbarOption} galleryConfig={null} serviceConfig={{
                    name: 'postUploadImg',
                    action: secret.POST_IMAGE_UPLOAD_API
                  }} value={value} onChange={this.onContentChange} />
                </article>
              </div>
            </Col>
          </Row>
        </main>
      </div>
    )
  }
}

EditDraft.propTypes = {
};

export default EditDraft;
