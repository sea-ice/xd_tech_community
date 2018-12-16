import React, {Component} from 'react';
import { connect } from 'dva';
import { Input, Button, message } from 'antd'

import styles from './index.scss'
import ConfirmIfNotMeet from 'components/common/ConfirmIfNotMeet'

class CommentBox extends Component {
  constructor (props) {
    super(props)
    this.publish = this.publish.bind(this)
  }
  publish() {
    let { publishCallback, content } = this.props
    if (!content.trim()) {
      return message.error('评论内容不允许为空！')
    }
    publishCallback(content)
  }
  render() {
    let { textareaRef, loginUserId, content, onContentChange } = this.props

    return (
      <div className="commentBox">
        <Input.TextArea
          ref={textareaRef}
          value={content}
          onChange={onContentChange}
          autosize={{ minRows: 4, maxRows: 6 }} />
        <div className={styles.publishBtn}>
          <ConfirmIfNotMeet
            condition={!!loginUserId}
            callbackWhenMeet={this.publish}
            btn={
              <Button type="primary">发表</Button>
            }
          />
        </div>
      </div>
    );
  }
}

CommentBox.propTypes = {
};

export default connect()(CommentBox);
