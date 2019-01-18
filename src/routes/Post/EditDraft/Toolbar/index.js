import * as React from "react";
import { Icon, Modal } from "antd";
import styled from "styled-components";
import { Container } from "./components/item";
import FullScreenIcon from "./components/fullScreen";

import Image from "../CannerPlugins/slate-icon-image";
import HelpMenu from "../CannerPlugins/slate-editor-help";

const IconContainer = styled.div`
  display: inline-block;
  background: transparent;
  color: #222;
  cursor: pointer;
  -webkit-transition: background 0.2s ease 0s;
  border-bottom: 0.5px solid #ebebeb;
  ${props =>
    !props.noHover &&
    `
    &:hover {
      background: #ebebeb;
    }
  `};
`;

const Seperator = styled.div`
  height: 35px;
  width: 1px;
  margin: 2px 0;
  background: #ebebeb;
  display: inline-block;
  vertical-align: top;
`;

export default class Toolbar extends React.Component {
  state = {
    showMenu: false
  };

  changeVisibleMenu = (visible) => {
    this.setState({ showMenu: visible });
  };

  render() {
    const {
      value,
      onChange,
      goFull,
      isFull,
      serviceConfig,
      galleryConfig,
      menuToolbarOption
    } = this.props;
    const { showMenu } = this.state;

    return (
      <Container>
        {menuToolbarOption.map((option, i) => {
          let Type =
            typeof option === "string" ? option : option.type || option;
          let title = option.title;

          if (Type === "seperator") return <Seperator key={i} />;
          if (Type === "fullScreen") {
            return (
              <IconContainer key={i} title={title}>
                <FullScreenIcon
                  className="__canner-editor_topToolbarItem"
                  goFull={goFull}
                  isFull={isFull}
                />
              </IconContainer>
            );
          }

          if (Type === "help") {
            return (
              <IconContainer
                noHover
                style={{ height: "37px" }}
                key={i}
                title={title}
              >
                <Icon
                  type="question-circle"
                  theme="outlined"
                  className="__canner-editor_topToolbarItem"
                  onClick={() => this.changeVisibleMenu(true)}
                />
                <Modal
                  visible={showMenu}
                  style={{ width: "800px" }}
                  footer={null}
                  onCancel={() => this.changeVisibleMenu(false)}
                  title="命令清单"
                >
                  <HelpMenu />
                </Modal>
              </IconContainer>
            );
          }

          // special plugin
          if (Type === "image") {
            Type = Image;
          }

          return (
            <IconContainer key={i} title={title}>
              <Type
                change={value.change()}
                onChange={onChange}
                className="__canner-editor_topToolbarItem"
                disableClassName="__canner-editor_topToolbarItemDisabled"
                strokeClassName="qlStroke"
                serviceConfig={Type === Image && serviceConfig}
                galleryConfig={Type === Image && galleryConfig}
                strokeMitterClassName="qlStrokeMitter"
                fillClassName="qlFill"
                evenClassName="qlEven"
                colorLabelClassName="qlColorLabel"
                thinClassName="qlThin"
                activeStrokeMitterClassName="qlStrokeMitterActive"
                activeClassName="__canner-editor_topToolbarItem __canner-editor_topToolbarItemActive"
                activeStrokeClassName="qlStrokeActive"
                activeFillClassName="qlFillActive"
                activeThinClassName="qlThinActive"
                activeEvenClassName="qlEvenActive"
              />
            </IconContainer>
          );
        })}
      </Container>
    );
  }
}