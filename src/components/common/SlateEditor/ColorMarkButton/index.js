import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'dva';
import { Icon } from 'antd'
import { CompactPicker } from 'react-color'

import styles from './index.scss'

class ColorMarkButton extends Component {
  constructor(props) {
    super(props)
    this.formatTextUseColor = this.formatTextUseColor.bind(this)
    this.toggleColorPanel = this.toggleColorPanel.bind(this)
    this.onChangeComplete = this.onChangeComplete.bind(this)
    this.state = {
      show: false,
      color: props.color || '#000000'
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    let { color } = nextProps
    if (color !== this.state.color) {
      this.setState({ color })
    }
  }
  formatTextUseColor(e) {
    e.preventDefault()
    let { show, color } = this.state
    if (show) this.setState({ show: false })
    this.props.onColour(color)
  }
  toggleColorPanel(e) {
    e.preventDefault()
    let { show } = this.state
    this.setState(
      { show: !show },
      () => this.props.onPanelToggle(!show))
  }
  onChangeComplete(color) {
    color = color.hex
    this.props.onColorChange(color)
    this.setState({
      show: false,
      color,
    })
  }
  render() {
    let { iconType } = this.props
    let { show, color } = this.state
    return (
      <div className={styles.toolIcon}>
        <div>
          <span className={styles.colorIcon} onClick={this.formatTextUseColor}>
            {iconType === 'font-colors' ? (
              <svg viewBox="0 0 1024 1024" width="14" height="14">
                <path d="M0 896h1024v128H0z" fill={color}></path>
                <path d="M813.4 737.1L591.3 120.2C579.8 87.4 548.6 64 512 64s-67.7 23.4-79.2 56.1c-0.1 0-74 204.8-221.7 614.3-2.2 7-4.1 14.3-4.1 22.1 0 29.5 24 53.5 53.5 53.5 26 0 44.5-21.1 52.5-43.2l64-189.1h268.1l63.8 188.7c8.5 25.8 26.9 44.6 53.6 44.6 30.1 0 54.5-24.4 54.5-54.5 0-6.8-1.3-13.4-3.6-19.4zM404.7 489.9l104.8-308.8h2.9l104.8 308.8H404.7z" fill="#595959"></path>
              </svg>
            ) : (
              <svg viewBox="0 0 1024 1024" width="14" height="14">
                <path d="M0 896h1024v128H0z" fill={color}></path>
                <path d="M828.7 358.9c8.9-15.3 3.7-34.9-11.5-43.8-273.9-159.5-410.9-239.3-411-239.3-30.6-17.7-69.8-7.2-87.4 23.4l-33 57.1-110.2-63.7c-23-13.3-52.3-5.4-65.6 17.6-13.3 23-5.4 52.3 17.6 65.6l110.3 63.7L75 521.6c-17.7 30.6-7.2 69.8 23.4 87.4l327.5 189c30.6 17.7 69.7 7.2 87.4-23.4l210.9-364.4 89.4-38c6.3-2.6 11.6-7.3 15.1-13.3z m-154.8-5.5L582.1 512H163.6l213.6-369.9L712 337.2l-38.1 16.2zM832.5 448S725 591.3 725 661.3C725 717 773.1 768 832.5 768S940 717 940 661.3c0-70-107.5-213.3-107.5-213.3z" fill="#595959"></path>
              </svg>
            )}
          </span>
          <span className={styles.arrowIcon} onClick={this.toggleColorPanel}>
            <Icon type="caret-down" style={{ fontSize: 12 }} />
          </span>
        </div>
        {show ? (
          <div className={styles.colorPanel}>
            <CompactPicker
              onChangeComplete={this.onChangeComplete}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

ColorMarkButton.propTypes = {
  color: PropTypes.string,
  iconType: PropTypes.string,
  onPanelToggle: PropTypes.func,
  onColorChange: PropTypes.func
};

export default connect()(ColorMarkButton);
