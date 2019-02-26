import React, { Component } from 'react'

import styles from './index.scss'
import config from 'config/constants'

class Page500 extends Component {
  render() {
    return (
      <div className={styles.fixed}>
        <img src={`${config.SUBDIRECTORY_PREFIX}/assets/500.jpg`} alt="" />
      </div>
    );
  }
}

Page500.propTypes = {
};

export default Page500
