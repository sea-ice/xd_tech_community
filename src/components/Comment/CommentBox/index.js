import React, {Component} from 'react';
import { connect } from 'dva';
import {Input, Button} from 'antd'

import styles from './index.scss'

class CommentBox extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <div className="commentBox">
        <Input.TextArea autosize={{ minRows: 4, maxRows: 6 }} />
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
