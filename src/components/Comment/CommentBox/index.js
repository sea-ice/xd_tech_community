import React, {Component} from 'react';
import { connect } from 'dva';
import {Input, Button} from 'antd'

import styles from './index.scss'

class CommentBox extends Component {
  constructor (props) {
    super(props)
  }
  render() {
    let { textareaRef } = this.props

    return (
      <div className="commentBox">
        <Input.TextArea ref={textareaRef} autosize={{ minRows: 4, maxRows: 6 }} />
        <div className={styles.publishBtn}>
          <Button type="primary">发表</Button>
        </div>
      </div>
    );
  }
}

CommentBox.propTypes = {
};

export default connect()(CommentBox);
