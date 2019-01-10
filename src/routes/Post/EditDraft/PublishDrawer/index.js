import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Row, Col, Drawer, Form, Select, Checkbox, Input, Badge, Icon } from 'antd'

import styles from './index.scss'
import config from 'config/constants'
import LabelSelector from 'components/common/LabelSelector'

// const SHARE_POST_TYPE = '0'
// const APPEAL_POST_TYPE = '1'

@connect(state => ({
  editPost: state.postCURD.editPost
}))
@Form.create({
  onFieldsChange(props, fields) {
    let fieldName = Object.keys(fields)[0]
    let { dispatch } = props
    let newInfo = { [fieldName]: fields[fieldName].value }

    if (fieldName === 'type') {
      newInfo.setShareCoins = false
      newInfo.setAppealCoins = false
      newInfo.coinsForAcceptedUser = 0
      newInfo.coinsPerJointUser = 0
      newInfo.jointUsers = 0
    } else if (
      (fieldName === 'coinsForAcceptedUser') ||
      (fieldName === 'coinsPerJointUser') ||
      (fieldName === 'jointUsers')
    ) {
      newInfo[fieldName] = Number(newInfo[fieldName])
    }
    dispatch({
      type: 'postCURD/setInfo',
      payload: {
        key: 'editPost',
        newInfo
      }
    })
  }
})
class PublishDrawer extends Component {
  state = {
    visible: false,
    checkValid: false
  }
  constructor(props) {
    super(props)
    this.toggleSettings = this.toggleSettings.bind(this)
    // this.onPostTypeChange = this.onPostTypeChange.bind(this)
    this.removeTag = this.removeTag.bind(this)
    this.getSelectedTags = this.getSelectedTags.bind(this)
  }
  componentDidMount() {
    this.props.onRef(this)
    this.setState({ checkValid: this.validatePostInfo() })
  }
  toggleSettings() {
    let { visible } = this.state
    this.setState({ visible: !visible })
    if (visible) {
      this.setState({ checkValid: this.validatePostInfo() })
    }
  }
  removeTag(e) {
    let { selectedTags } = this.state
    let tagIdx = selectedTags.indexOf(e.target.innerText)
    selectedTags = selectedTags.slice()
    selectedTags.splice(tagIdx, 1)
    this.updateEditPost({ selectedTags })
  }
  getSelectedTags(tags) {
    this.updateEditPost({ selectedTags: tags })
  }

  updateEditPost(newInfo) {
    let { dispatch } = this.props
    dispatch({
      type: 'postCURD/setInfo',
      payload: {
        key: 'editPost',
        newInfo
      }
    })
  }
  validatePostInfo() {
    let { form } = this.props
    form.validateFields()
    let validateErr = form.getFieldsError()
    console.log(validateErr)
    let hasValidateErr = Object.keys(validateErr).some(key => !!validateErr[key])
    if (hasValidateErr) return false

    return !!this.props.editPost.selectedTags.length
  }
  render() {
    let { form: { getFieldDecorator }, editPost } = this.props
    let { type, selectedTags, setShareCoins, setAppealCoins,
      coinsForAcceptedUser, coinsPerJointUser, jointUsers } = editPost
    let { visible, checkValid } = this.state

    let badgeSymbol = checkValid ? {
      count: < Icon type="check-circle" theme="filled" style={{ color: '#52c41a' }} />
    } : { dot: true }
    let setCoins = setShareCoins || setAppealCoins
    return (
      <React.Fragment>
        <div className={styles.settingWrapper} onClick={this.toggleSettings}>
          <Badge {...badgeSymbol}>
            <Icon type="setting" style={{ fontSize: 24, color: '#999' }} />
          </Badge>
        </div>
        <Drawer width={720} visible={visible} title="基本设置" onClose={this.toggleSettings}>
          <Form>
            <Form.Item className={styles.field}>
              <Row>
                <Col span={4}><label>帖子类型</label></Col>
                <Col span={8}>
                  {
                    getFieldDecorator('type', {
                      initialValue: type
                    })(
                      <Select size="large" placeholder="请选择帖子类型">
                        <Select.Option value={config.postType.SHARE}>分享帖</Select.Option>
                        <Select.Option value={config.postType.APPEAL}>求助帖</Select.Option>
                      </Select>
                      )
                  }
                </Col>
              </Row>
            </Form.Item>
            {/* 可以考虑设置摘要 */}
            <Form.Item>
              <h4 className={styles.selectTagTitle}>
                <span className={styles.colorRed}>*</span>标签
              </h4>
              <main className={styles.selectTagMain}>
                <div className={styles.tagsWrapper}>
                  <header>
                    {!selectedTags.length ? (
                      <p className={styles.tips} style={{ color: '#ccc' }}>请选择标签</p>
                    ) : (
                        <ul className={styles.categoryTagsList}>
                          <li className={styles.listItem}><p className={styles.tips}>已选标签：</p></li>
                          {
                            selectedTags.map(tag => (
                              <li
                                key={tag}
                                className={styles.categoryTagActive}
                              >
                                <a href="javascript:void(0);" onClick={this.removeTag}>{tag}</a>
                              </li>
                            ))
                          }
                        </ul>
                      )}
                  </header>
                  <main>
                    <LabelSelector selectedTags={selectedTags} notifySelectedTags={this.getSelectedTags} />
                  </main>
                </div>
              </main>
            </Form.Item>
            <h4>设置金币</h4>
            <Form.Item>
              {
                type === config.postType.SHARE ?
                  getFieldDecorator('setShareCoins', {
                    initialValue: setShareCoins,
                    valuePropName: 'checked'
                  })(<Checkbox>我要散金币</Checkbox>) :
                  getFieldDecorator('setAppealCoins', {
                    initialValue: setAppealCoins,
                    valuePropName: 'checked'
                  })(<Checkbox>我要悬赏</Checkbox>)
              }
            </Form.Item>
            <div className={styles.coinSetting}>
              {setAppealCoins ? (
                <Form.Item>
                  评论被采纳的用户可获得{
                    <div className={styles.coinInput}>
                      {getFieldDecorator('coinsForAcceptedUser', {
                        initialValue: coinsForAcceptedUser,
                        rules: [
                          {
                            validator(rule, val, callback) {
                              if (!val.trim()) return callback('请填写金币数量！')
                              if ((Number(val) >= 0) && (window.parseInt(val) === Number(val))) {
                                callback()
                              } else {
                                callback('请填写大于等于0的整数！')
                              }
                            }
                          },
                        ]
                      })(
                        <Input type="number" />
                        )}
                    </div>
                  }金币
              </Form.Item>
              ) : null}
              {
                setCoins ? (
                  <div className={styles.plainCoins}>
                    <Form.Item>
                      {setAppealCoins ? '其他' : null}参与评论的用户可获得{
                        <div className={styles.coinInput}>
                          {getFieldDecorator('coinsPerJointUser', {
                            initialValue: coinsPerJointUser,
                            rules: [
                              {
                                validator(rule, val, callback) {
                                  if (!val.trim()) return callback('请填写金币数量！')

                                  if ((Number(val) >= 0) && (window.parseInt(val) === Number(val))) {
                                    callback()
                                  } else {
                                    callback('请填写大于等于0的整数！')
                                  }
                                }
                              },
                            ]
                          })(
                            <Input type="number" />
                            )}
                        </div>
                      }金币，
                    </Form.Item>
                    <Form.Item>
                      共奖励{
                        <div className={styles.coinInput}>
                          {getFieldDecorator('jointUsers', {
                            initialValue: jointUsers,
                            rules: [
                              {
                                validator(rule, val, callback) {
                                  if (!val.trim()) return callback('请填写金币数量！')

                                  if ((Number(val) >= 0) && (window.parseInt(val) === Number(val))) {
                                    callback()
                                  } else {
                                    callback('请填写大于等于0的整数！')
                                  }
                                }
                              },
                            ]
                          })(
                            <Input type="number" />
                            )}
                        </div>
                      }人

                    </Form.Item>
                  </div>

                ) : null
              }
            </div>

            {
              setCoins ? (
                <p>你当前的金币数量为，共需要支付{Number(coinsForAcceptedUser) + coinsPerJointUser * jointUsers}枚金币</p>
              ) : null
            }
          </Form>
        </Drawer>
      </React.Fragment>

    );
  }
}

PublishDrawer.propTypes = {
};

export default PublishDrawer;
