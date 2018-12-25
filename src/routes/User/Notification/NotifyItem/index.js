import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Row, Col } from 'antd'

import styles from './index.scss'

class PostDetail extends Component {
  constructor(props) {
    super(props)
  }
  render() {

    return (
      <div>

      </div>
    );
  }
}

PostDetail.propTypes = {
};

export default connect()(PostDetail);
