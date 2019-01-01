import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Row, Col, Drawer, Form, Select, Checkbox, Input } from 'antd'

import styles from './index.scss'
import LabelSelector from 'components/common/LabelSelector'

const SHARE_POST_TYPE = '0'
const APPEAL_POST_TYPE = '1'

@connect(state => ({
  editPost: state.postCURD.editPost
}))
@Form.create({
  onFieldsChange(props, fields) {
    let fieldName = Object.keys(fields)[0]
    let { dispatch } = props
    dispatch({
      type: 'postCURD/setInfo',
      payload: {
        key: 'editPost',
        newInfo: {
          [fieldName]: fields[fieldName].value
        }
      }
    })
  }
})
class PublishDrawer extends Component {
  constructor(props) {
    super(props)
    this.removeTag = this.removeTag.bind(this)
    this.getSelectedTags = this.getSelectedTags.bind(this)
    this.onClose = this.onClose.bind(this)
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
  onClose() {
    this.props.onClose() // 更新父组件控制当前面板的state
  }
  render() {
    let { visible, form: { getFieldDecorator }, editPost } = this.props
    let { type, selectedTags, setShareCoins, setAppealCoins } = editPost
    return (
      <Drawer width={720} visible={visible} title="基本设置" onClose={this.onClose}>
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
                      <Select.Option value={SHARE_POST_TYPE}>分享帖</Select.Option>
                      <Select.Option value={APPEAL_POST_TYPE}>求助帖</Select.Option>
                    </Select>
                  )
                }
              </Col>
            </Row>
          </Form.Item>
          <Form.Item>
            <h4 className={styles.selectTagTitle}>标签</h4>
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
          <Form.Item>
            <h4>设置金币</h4>
            {
              type === SHARE_POST_TYPE ? getFieldDecorator('setShareCoins', {
                initialValue: setShareCoins
              })(
                <Checkbox>我要散金币</Checkbox>
              ) : getFieldDecorator('setAppealCoins', {
                initialValue: setAppealCoins
              })(
                <Checkbox>我要悬赏</Checkbox>
              )
            }
            {(setShareCoins || setAppealCoins) ? (
              <div className="coinSetting">
                <p>{setAppealCoins ? (
                  <React.Fragment>
                    评论被采纳的用户可获得{
                      getFieldDecorator('coinsForAcceptedUser', {
                        initialValue: 0
                      })(
                        <Input type="number" />
                        )
                    }金币，其他
                </React.Fragment>
                ) : null}参与评论的用户可获得{
                    getFieldDecorator('coinsPerJointUser', {
                      initialValue: 0
                    })(
                      <Input type="number" />
                      )
                  }金币，共奖励{
                    getFieldDecorator('jointUsers', {
                      initialValue: 0
                    })(
                      <Input type="number" />
                      )
                  }人</p>
                <p>你当前的金币数量为，共需要支付枚金币</p>
              </div>
            ) : null}
          </Form.Item>
        </Form>
      </Drawer>
    );
  }
}

PublishDrawer.propTypes = {
};

export default PublishDrawer;
