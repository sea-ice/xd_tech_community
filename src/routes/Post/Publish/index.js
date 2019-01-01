import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Row, Col, Badge, Icon, Button, Dropdown, Menu, Popover } from 'antd'
import { CompactPicker } from 'react-color'

import styles from './index.scss'
import 'react-quill/dist/quill.snow.css'
// import QuillEditor from 'components/common/QuillEditor'
import SlateEditor from 'components/common/SlateEditor'
// import SlateEditor from 'components/common/SlateEditor/richTextExample'
import PublishDrawer from './PublishDrawer'

class Publish extends Component {
  state = {
    showPostSettings: false
  }
  constructor(props) {
    super(props)
    this.toggleSettings = this.toggleSettings.bind(this)
  }
  toggleSettings() {
    let { showPostSettings } = this.state
    this.setState({ showPostSettings: !showPostSettings })
  }
  render() {
    let { showPostSettings } = this.state

    return (
      <div>
        <header className={styles.fixedHeader}>
          <a href="javascript:void(0);" className={styles.returnBtn}>返回</a>
          <p className={styles.draftSaveTips}>已保存至草稿箱</p>
          <div className={styles.settingWrapper} onClick={this.toggleSettings}>
            <Badge dot>
              <Icon type="setting" style={{fontSize: 24, color: '#999'}} />
            </Badge>
          </div>
          <div className={styles.publishBtn}>
            <Button type="primary">发表</Button>
          </div>
        </header>
        <SlateEditor />
        <PublishDrawer visible={showPostSettings} onClose={this.toggleSettings} />
      </div>
    );
  }
}

Publish.propTypes = {
};

export default connect()(Publish);
