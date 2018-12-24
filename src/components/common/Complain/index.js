//举报组件
import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import IconBtn from '../IconBtn'
import styles from './index.css'
export default class Complain extends Component{
	constructor (props) {
   		super(props);
  	}
  	render(){
  		return(
  			<div className={styles.complain}>
  				{/*<IconBtn iconClassName={styles.threePointIcon} color="#999" fontSize=".28rem" />*/}
  				<div className={styles.down}><IconBtn iconClassName={styles.complainIcon} color="#999" fontSize=".28rem" />
            <div className={styles.text}>举报</div></div>
  			</div>
  		)
  	}

}
