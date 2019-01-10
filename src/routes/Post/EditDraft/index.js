import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { withRouter, routerRedux } from 'dva/router'

import { Row, Col, Badge, Icon, Button, Spin, message } from 'antd'
import Html from 'slate-html-serializer'
import { DEFAULT_RULES as rules } from '@canner/slate-editor-html/lib'
import CannerEditor from 'canner-slate-editor'
import { isKeyHotkey } from 'is-hotkey'
import secret from 'config/secret.config'
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
import { checkLogin, hasSameElements } from 'utils'

const HTMLSerializer = new Html({ rules })
const isSaveKey = isKeyHotkey('mod+s')

@connect(state => ({
  returnPage: state.postCURD.draftEditReturnPage,
  editPost: state.postCURD.editPost,
  userId: state.user.userId,
  draftSaveState: state.postCURD.draftSaveState,
  newPostFlag: state.postCURD.newPostFlag,
  validDraftId: state.postCURD.validDraftId
}))
@withRouter
@checkLogin({
  // 先验证用户是否登录，再验证用户是否用权限编辑当前的帖子
  *checkLoginFinish(userInfo, { put }, props) {
    let { match: { params }, newPostFlag } = props
    if (newPostFlag) {
      // 如果是新建帖子，就不需要检查草稿是否存在
      // newPostFlag为true只可能由fixedHeader中的发帖按钮触发
      yield put({
        type: 'postCURD/setState',
        payload: { newPostFlag: false }
      })
      return
    }
    if (userInfo && userInfo.userId) {
      // 即使已有的validDraftId和当前要访问的草稿id一致，也需要检查草稿是否存在
      // 因为用户可能在此期间删除了草稿
      yield put({
        type: 'postCURD/checkDraftExists',
        payload: {
          draftId: Number(params.id),
          authorId: userInfo.userId
        }
      })
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
  state = {
    initialized: false,
    publishState: ''
  }
  constructor(props) {
    super(props)
    this.backToLastPage = this.backToLastPage.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onContentChange = this.onContentChange.bind(this)
    this.onPublish = this.onPublish.bind(this)
  }
  UNSAFE_componentWillMount() {
    let { dispatch, newPostFlag } = this.props
    let initialState = { draftSaveState: 'initial' }
    // 进入当前页面先将validDraftId置为null，并初始化postCURD相关的状态
    if (!newPostFlag) {
      initialState.validDraftId = null
    }
    dispatch({
      type: 'postCURD/setState',
      payload: initialState
    })
  }
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown)
    let { newPostFlag, editPost } = this.props
    let { title, content } = editPost
    if (newPostFlag) {
      // 通过发帖按钮新建帖子直接初始化组件状态
      let value = HTMLSerializer.deserialize(content)
      this.setState({
        title,
        value,
        initialized: true,
        savedInfo: {
          ...editPost,
          content: HTMLSerializer.serialize(value)
          // 原来content为空，反序列化之后为'<p></p>'，需要再次序列化为HTML
        }
      })
    }
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
    if (this.unBlock) this.unBlock()
  }
  backToLastPage() {
    let { dispatch, returnPage } = this.props
    dispatch({
      type: 'postCURD/popEditDraftReturnPage',
      payload: {
        successCallback: () => {
          dispatch(routerRedux.push(returnPage))
        }
      }
    })
  }
  onKeyDown(e) {
    console.log(isSaveKey(e))
    if (isSaveKey(e)) {
      this.saveContent()
      e.preventDefault()
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    let { initialized } = this.state
    let {
      dispatch,
      validDraftId,
      match: { params },
      editPost
    } = nextProps;
    let { title, content } = editPost

    // 如果检查发现草稿id不存在则跳转到404页面
    if (nextProps.validDraftId === false) {
      return dispatch(routerRedux.push('/404'))
    } else if (
      !initialized &&
      (validDraftId === Number(params.id))
    ) {
      // 如果草稿存在，则初始化当前组件状态
      let value = HTMLSerializer.deserialize(content)
      this.setState({
        initialized: true,
        title,
        value,
        savedInfo: {
          ...editPost,
          content: HTMLSerializer.serialize(value)
        }
      })
    } else if (
      initialized &&
      this.isDraftInfoChanged(editPost)
    ) {
      this.setDraftUnsaved()
    }
  }
  setDraftUnsaved() {
    let { dispatch, draftSaveState, history } = this.props
    if (draftSaveState === 'unsaved') return

    dispatch({
      type: 'postCURD/setState',
      payload: {
        draftSaveState: 'unsaved'
      }
    })
    this.unBlock = history.block('确定要离开当前页吗？当前未保存的内容将会丢失！') // 对下次路由操作有效(无论下次是PUSH还是POP操作)
  }
  isDraftInfoChanged(newInfo) {
    let compareFields = ['selectedTags', 'type', 'setShareCoins', 'setAppealCoins', 'coinsForAcceptedUser', 'coinsPerJointUser', 'jointUsers']
    let { savedInfo } = this.state
    for (let field of compareFields) {
      if (field === 'selectedTags') {
        if (!hasSameElements(savedInfo[field], newInfo[field])) return true
      } else {
        if (savedInfo[field] !== newInfo[field]) return true
      }
    }
    return false
  }
  onTitleChange(e) {
    this.setState({ title: e.target.value })
    this.setDraftUnsaved()
  }
  saveContent() {
    let { draftSaveState } = this.props
    if (draftSaveState === 'saving') return

    let { value, title } = this.state
    let newHTML = HTMLSerializer.serialize(value)
    // if (savedHTML === newHTML) return

    let { dispatch, editPost, userId } = this.props
    dispatch({
      type: 'postCURD/saveDraft',
      payload: {
        ...editPost,
        userId,
        title,
        content: newHTML,
        successCallback: () => {
          this.setState({
            savedInfo: {
              ...editPost,
              title,
              content: newHTML
            }
          })
          if (this.unBlock) this.unBlock()
        }
      }
    })
  }
  onContentChange({ value }) {
    this.setState({ value })

    let newHTML = HTMLSerializer.serialize(value)
    let { savedInfo, initialized } = this.state
    if (initialized && (newHTML !== savedInfo.content)) {
      this.setDraftUnsaved()
    }
  }
  checkUploadImage(file) {
    let { type, size } = file
    if (!(type.match(/jpeg|png|gif|bmp|svg\+xml/))) {
      message.error('仅支持jpg、png、gif、bmp、svg等格式的图片')
      return false
    }

    if (size > 2 * 1024 * 1024) {
      message.error('图片大小不能超过2M，请重新选择！')
      return false
    }

    return true
  }
  onPublish() {
    let { value, title } = this.state
    let content = HTMLSerializer.serialize(value)

    if (!title.trim()) return message.error('标题不允许为空！')
    if (!content.trim()) return message.error('帖子内容不允许为空！')
    if (!this.postSettings.validatePostInfo()) return message.error('请在设置中选择帖子相关的标签！')

    this.setState({ publishState: 'loading' })
    let { dispatch, editPost, userId, draftSaveState } = this.props

    // 取消block对于后续同步调用的路由切换操作不起作用，因此在publish前先提前取消block
    if ((draftSaveState === 'unsaved') && this.unBlock) this.unBlock()

    dispatch({
      type: 'postCURD/publish',
      payload: {
        ...editPost,
        userId,
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
    let { title, value, initialized, publishState } = this.state
    let {
      draftSaveState, validDraftId,
      match: { params }
    } = this.props
    return (
      !initialized || (validDraftId !== Number(params.id)) ? (
        <div className={styles.spinWrapper}>
          <Spin tip="加载中..." />
        </div>
      ) : (
        <div>
          <header className={styles.fixedHeader}>
            <section className={styles.leftSide}>
              <a href="javascript:void(0);" className={styles.returnBtn} onClick={this.backToLastPage}>返回</a>
              {
                (function () {
                  const iconCommonProps = { theme: "filled" }
                  if (draftSaveState === 'initial') {
                    return null
                  } else if (draftSaveState === 'unsaved') {
                    return (
                      <p className={styles.draftSaveTips}>
                        <Icon type="exclamation-circle" style={{ color: '#ffe58f' }} {...iconCommonProps} />
                        <span>有未保存的内容(ctrl+s保存)</span>
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
              <PublishDrawer onRef={drawer => this.postSettings = drawer} />
              <div className={styles.publishBtn}>
                <Button type="primary" loading={publishState === 'loading'} onClick={this.onPublish}>发表</Button>
              </div>
            </section>

          </header>
          <main className={styles.main}>
            <Row>
              <Col span={18} offset={3}>
                <div className={styles.editorWrapper}>
                  <div className={styles.titleInputWrapper}>
                    <input type="text" placeholder="请输入标题..." value={title} onChange={this.onTitleChange} />
                  </div>
                  <div className={styles.mainContentWrapper}>
                    <CannerEditor
                      galleryConfig={null}
                      menuToolbarOption={menuToolbarOption}
                      serviceConfig={{
                        name: 'uploadImg',
                        action: secret.IMAGE_UPLOAD_API,
                        data: { type: 'postImage' },
                        beforeUpload: this.checkUploadImage
                      }} value={value} onChange={this.onContentChange} />
                  </div>
                </div>
              </Col>
            </Row>
          </main>
        </div>
      )
    )
  }
}

EditDraft.propTypes = {
};

export default EditDraft;
