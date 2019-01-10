import React, { Component } from 'react';
import { connect } from 'dva';

import styles from './index.scss'

class Page500 extends Component {
  render() {
    return (
      <div className={styles.fixed}>
        <img src="/assets/500.jpg" alt="" />
      </div>
    );
  }
}

Page500.propTypes = {
};

export default connect()(Page500);
