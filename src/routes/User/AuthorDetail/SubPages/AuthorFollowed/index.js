import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';

import styles from './index.scss'

class AuthorPosts extends Component {
  constructor (props) {
    super(props)
  }
  render () {

    return (
      <div></div>
    );
  }
}

AuthorPosts.propTypes = {
  guest: PropTypes.bool
};

export default connect()(AuthorPosts);
