import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Row, Col, Avatar, Button, message, Upload } from 'antd'

import styles from './index.scss'
import AuthorInfoList from './AuthorInfoList'
import AuthorInfoForm from './AuthorInfoForm'
import UserFollowState from 'components/User/UserFollowState'
import PrivateMsgBtn from 'components/User/PrivateMsgBtn'

import secret from 'config/secret.config'

@connect(state => ({
  loginUserId: state.user.userId,
  authorId: state.author.validAuthorId,
  authorInfo: state.author.authorInfo
}))
class AuthorBasicInfo extends Component {
  state = {
    personalInfoEditState: 'saved' // 有三种状态，分别是'edit', 'saving', 'saved'
  }
  static getDerivedStateFromProps(nextProps, state) {
    let { authorInfo } = nextProps
    if (!state.authorInfo && !!authorInfo.userId) {
      return { authorInfo }
    }
    return null
  }
  constructor (props) {
    super(props)
    this.editPersonalInfo = this.editPersonalInfo.bind(this)
    this.savePersonalInfo = this.savePersonalInfo.bind(this)
    this.cancelEditPersonalInfo = this.cancelEditPersonalInfo.bind(this)
    this.updateFollowAuthorState = this.updateFollowAuthorState.bind(this)
    this.onUploadStateChange = this.onUploadStateChange.bind(this)
  }

  componentDidMount() {
    let { dispatch, authorId } = this.props
    // 获取用户等级
    dispatch({
      type: 'author/getAuthorLevel',
      payload: {
        authorId
      }
    })
  }
  editPersonalInfo() {
    this.setState({ personalInfoEditState: 'edit' })
  }
  cancelEditPersonalInfo() {
    this.setState({ personalInfoEditState: 'saved' })
  }

  savePersonalInfo() {
    if (!this.authorInfoForm.checkValid()) return
    this.setState({ personalInfoEditState: 'saving' })
    let { dispatch } = this.props
    let { authorInfo } = this.state
    let fieldValues = this.authorInfoForm.getFieldValues()
    console.log(fieldValues)
    dispatch({
      type: 'author/saveAuthorInfo',
      payload: {
        authorInfo: Object.assign(authorInfo, fieldValues),
        successCallback: () => {
          message.success('修改成功')
          this.setState({ personalInfoEditState: 'saved' })
        },
        failCallback: () => {
          message.error('保存失败，请稍后再试！')
          this.setState({ personalInfoEditState: 'edit' })
        }
      }
    })
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
  onUploadStateChange(uploadState) {
    console.log(uploadState)
    let { file: { status } } = uploadState
    let { dispatch, authorInfo } = this.props

    if (status === 'done') {
      let { response } = uploadState.file
      if (response.status === 'done') {
        let avatarURL = response.data.link
        dispatch({
          type: 'author/saveAuthorInfo',
          payload: {
            authorInfo: Object.assign(authorInfo, { avator: avatarURL }),
            successCallback () {
              message.success('上传成功！')
              if (this.hideUploading) {
                this.hideUploading()
                this.hideUploading = null
              }
            }
          }
        })
      } else {
        if (this.hideUploading) {
          this.hideUploading()
          this.hideUploading = null
        }
        message.error('上传失败，请稍后再试！')
      }
    } else if (status === 'error') {
      message.error('上传失败，请稍后再试！')
      if (this.hideUploading) {
        this.hideUploading()
        this.hideUploading = null
      }
    } else if (status === 'uploading') {
      if (!this.hideUploading) this.hideUploading = message.loading('图片上传中...')
    }
  }
  updateFollowAuthorState(newFollowState) {
    let { dispatch } = this.props
    dispatch({
      type: 'author/setInfo',
      payload: {
        key: 'authorInfo',
        newInfo: {
          status: newFollowState
        }
      }
    })
  }
  render () {
    let { guest, loginUserId, authorId, authorInfo } = this.props
    let { avator, userLevel = 0, status, coin, fans, focus, solvedProblem } = authorInfo
    let { personalInfoEditState } = this.state
    let isSaved = personalInfoEditState === 'saved'
    return (
      <div className={styles.infoWrapper}>
        <Row gutter={15}>
          <Col span={6}>
            <div className={styles.avatarWrapper}>
              <Avatar src={avator || '/assets/yay.jpg'} shape="square" />
            </div>
            {
              (!loginUserId || authorId && (loginUserId !== authorId)) ? (
                <div className={styles.V_BtnWrapper}>
                  <div className={styles.btn}>
                    <UserFollowState
                      authorId={authorId}
                      followState={status}
                      customBtnProps={{ type: 'primary', block: true }}
                      updateSuccessCallback={this.updateFollowAuthorState}
                    />
                  </div>
                  <div className={styles.btn}>
                    <PrivateMsgBtn
                      receiverId={authorId}
                      btn={<Button icon="message" block>私信</Button>}
                    />
                  </div>
                </div>
              ) : null
            }
            {
              loginUserId === authorId ? (
                <div className={styles.V_BtnWrapper}>
                  <div className={styles.uploadBtn}>
                    <Upload
                      name='uploadImg'
                      action={secret.IMAGE_UPLOAD_API}
                      data={{ type: 'avatar' }}
                      showUploadList={false}
                      beforeUpload={this.checkUploadImage}
                      onChange={this.onUploadStateChange}
                    >
                      <Button icon="upload" block>
                        {avator ? '更换' : '上传'}头像
                      </Button>
                    </Upload>
                  </div>
                </div>
              ) : null
            }
          </Col>
          <Col span={18}>
            <section className={styles.section}>
              <div className={styles.titleWrapper}>
                <h3>个人信息</h3>
                {
                  guest ? null : (
                    isSaved ? (
                      <Button icon="edit" onClick={this.editPersonalInfo}>修改</Button>
                    ): (
                      personalInfoEditState === 'saving' ? (
                        <Button type="primary" loading>保存中</Button>
                      ): (
                        <div className={styles.H_BtnWrapper}>
                          <div className={styles.btn}>
                            <Button onClick={this.cancelEditPersonalInfo}>取消</Button>
                          </div>
                          <div className={styles.btn}>
                            <Button type="primary" icon="save"
                              onClick={this.savePersonalInfo}>保存</Button>
                          </div>
                        </div>
                      )
                    )
                  )
                }
              </div>
              {
                isSaved ? (
                  <AuthorInfoList {...authorInfo} />
                ) : (
                  <AuthorInfoForm
                    authorInfo={authorInfo}
                    onRef={form => this.authorInfoForm = form} />
                )
              }
            </section>
            <section className={styles.section}>
              <div className={styles.titleWrapper}>
                <h3>个人成就</h3>
              </div>
              <ul>
                <li>
                  <label>用户等级</label>
                  <p>{userLevel}</p>
                </li>
                <li>
                  <label>关注TA的人</label>
                  <p>{fans}</p>
                </li>
                <li>
                  <label>TA关注的人</label>
                  <p>{focus}</p>
                </li>
                <li>
                  <label>金币</label>
                  <p>{coin}</p>
                </li>
                <li>
                  <label>已回答</label>
                  <p>{solvedProblem}</p>
                </li>
              </ul>
            </section>
          </Col>
        </Row>
      </div>
    );
  }
}

AuthorBasicInfo.propTypes = {
  guest: PropTypes.bool
};

export default AuthorBasicInfo;
