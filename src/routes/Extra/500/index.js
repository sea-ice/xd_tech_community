import React, { Component } from 'react'

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

export default Page500
