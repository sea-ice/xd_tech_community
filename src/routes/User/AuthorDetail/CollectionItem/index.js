import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';

import config from 'config/constants'
import CollectionPostItem from 'AuthorDetail/CollectionPostItem'

class CollectionItem extends Component {
  render() {
    let { type, object, favoriteId, ...other } = this.props
    return (
      type === config.objectType.POST ? <CollectionPostItem {...object} {...other} /> : null
    );
  }
}

CollectionItem.propTypes = {
  type: PropTypes.number,
  object: PropTypes.object,
  favoriteId: PropTypes.number
};

export default connect()(CollectionItem);
