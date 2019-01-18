import React, { Component } from "react";
import styled from "styled-components";
import CONFIG from "./config";
import { Tabs, Row, Col } from "antd";
const TabPane = Tabs.TabPane;

const DefaultImage = styled.div`
  background-image: url(${props => props.url});
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  margin: 0 auto;
  height: 200px;
  width: 100%;
  cursor: pointer;
`;

export default class Gallery extends Component {

  static defaultProps = {
    galleryConfig: CONFIG
  };

  handleClick = (data) => {
    this.props.onChange([data.url]);
  }

  generateContent = (gallery) => {
    const that = this;
    let tabs = [];
    gallery.forEach((item, key) => {
      tabs.push(
        <TabPane key={key} tab={item.name}>
          {that.generateGallery(item.gallery)}
        </TabPane>
      );
    });

    return tabs;
  }

  generateGallery = (gallery) => {
    return (
      <Row>
        {gallery.map((datum, i) => {
          return (
            <Col
              style={{ padding: "5px" }}
              span={8}
              key={i}
              onClick={() => this.handleClick(datum)}
            >
              <DefaultImage url={datum.url} />
            </Col>
          );
        })}
      </Row>
    );
  }

  render() {
    const { galleryConfig } = this.props;

    return (
      <Tabs tabPosition="top">
        {this.generateContent(galleryConfig)}
      </Tabs>
    );
  }
}
