// @flow
import React, { Component } from "react";
import { Input, Row, Col, Button, Icon, Alert } from "antd";
import {FormattedMessage} from 'react-intl';
import ImageLoader from "react-loading-image";
import styled from "styled-components";

const PreviewImg = styled.div`
  background-image: url(${props => props.src});
  width: 100%;
  height: 300px;
  background-size: contain;
  background-repeat: no-repeat;
`;

export default class UrlImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
      confirmDisabled: true
    };
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.confirmDisable = this.confirmDisable.bind(this);
  }

  onChange(e) {
    this.setState({
      confirmDisabled: true,
      url: e.target.value
    });
  }

  confirmDisable(disable) {
    this.setState({
      confirmDisabled: disable
    });
  }

  onClick() {
    const { url } = this.state;
    const {closeEditPopup, onChange} = this.props;

    if (url) {
      onChange([url]);
      this.setState({
        url: null,
        confirmDisabled: true
      });

      // close popup
      if (closeEditPopup) {
        closeEditPopup();
      }
    }
  }

  render() {
    const { url, confirmDisabled } = this.state;
    return (
      <Row>
        <Col>
          <FormattedMessage id="imgupload.url.title"/>
          <Input onChange={this.onChange} value={url}/>
          <Button
            style={{ margin: "10px 0" }}
            type="primary"
            disabled={confirmDisabled}
            onClick={this.onClick}
          >
            <FormattedMessage id="imgupload.btn.confirm"/>
          </Button>
          {url &&
            confirmDisabled && (
              <ImageLoader
                src={url}
                onLoad={() => this.confirmDisable(false)}
                error={() => (
                  <Alert
                    message={<FormattedMessage id="imgupload.url.error"/>}
                    type="error"
                  />
                )}
                loading={() => {
                  return (
                    <div>
                      <Icon type="loading" style={{ fontSize: 24 }} spin />
                    </div>
                  );
                }}
                image={props => <PreviewImg {...props} />}
              />
            )}
          {url && !confirmDisabled && <PreviewImg src={url} />}
        </Col>
      </Row>
    );
  }
}
