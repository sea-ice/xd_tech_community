import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import {Row, Col} from 'antd'

import styles from './index.scss'
import FixedHeader from 'components/common/FixedHeader'

class PostDetail extends Component {
  constructor (props) {
    super(props)
  }
  render () {

    return (
      <div>
        <FixedHeader />
        <main className="app-main">
          <Row gutter={20}>
            <Col span={18}>

            </Col>
            <Col span={6}>

            </Col>
          </Row>
        </main>
      </div>
    );
  }
}

PostDetail.propTypes = {
};

export default connect()(PostDetail);
