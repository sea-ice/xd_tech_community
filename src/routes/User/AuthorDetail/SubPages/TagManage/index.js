import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Button, message } from 'antd'

import styles from './index.scss'
import { hasSameElements } from 'utils'
import LabelSelector from 'components/common/LabelSelector'

class TagManage extends Component {
  constructor (props) {
    super(props)
    this.getSelectedTags = this.getSelectedTags.bind(this)
    this.removeTag = this.removeTag.bind(this)
    this.saveSelectedTags = this.saveSelectedTags.bind(this)
    this.resetSelectedTags = this.resetSelectedTags.bind(this)
    this.state = {
      selectedTags: props.label
    }
  }
  getSelectedTags(tags) {
    this.setState({
      selectedTags: tags
    })
  }
  removeTag(e) {
    let { selectedTags } = this.state
    let tagIdx = selectedTags.indexOf(e.target.innerText)
    selectedTags = selectedTags.slice()
    selectedTags.splice(tagIdx, 1)
    this.setState({ selectedTags })
  }
  saveSelectedTags() {
    let { dispatch, authorInfo } = this.props
    let { selectedTags } = this.state
    dispatch({
      type: 'author/saveAuthorInfo',
      payload: {
        authorInfo: Object.assign(authorInfo, {
          label: selectedTags.join(',')
        }),
        successCallback: () => {
          message.success('修改成功')
        }
      }
    })
  }
  resetSelectedTags() {
    let { label } = this.props
    this.setState({ selectedTags: label })
  }
  render() {
    let { label } = this.props
    let { selectedTags } = this.state
    let noUpdate = hasSameElements(selectedTags, label)

    return (
      <div className={styles.listWithHeader}>
        <header className={styles.header}>
          <h4>我的标签({label.length})</h4>
        </header>
        <main className={styles.main}>
          <div className={styles.tagsWrapper}>
            <header>
              {!selectedTags.length ? (
                <p className={styles.tips} style={{color: '#ccc'}}>请选择你感兴趣的标签</p>
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
              {noUpdate ? null : (
                <div className={styles.btnWrapper}>
                  <div className={styles.btn}>
                    <Button block type="primary" onClick={this.saveSelectedTags}>保存</Button>
                  </div>
                  <div className={styles.btn}>
                    <Button block onClick={this.resetSelectedTags}>取消</Button>
                  </div>
                </div>
              )}
            </header>
            <main>
              <LabelSelector selectedTags={selectedTags} notifySelectedTags={this.getSelectedTags} />
            </main>
          </div>
        </main>
      </div>
    )
  }
}

TagManage.propTypes = {
  guest: PropTypes.bool
};

export default connect(state => ({
  label: state.author.authorInfo.label.split(','),
  authorInfo: state.author.authorInfo
}))(TagManage);
