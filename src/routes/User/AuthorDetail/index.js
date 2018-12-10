import React, {Component} from 'react';
import { connect } from 'dva';

import {checkLogin} from 'utils'

import styles from './index.scss'
import FixedHeader from 'components/common/FixedHeader'
import OwnerView from './OwnerView'

@checkLogin
@connect()
class AuthorDetail extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    let {match: {params: {id}}} = this.props
    return (
      <div className="app-container">
        <FixedHeader />
        <main className="app-main">
          <OwnerView id={id} />
        </main>
      </div>
    );
  }
}

AuthorDetail.propTypes = {
};

export default AuthorDetail;
