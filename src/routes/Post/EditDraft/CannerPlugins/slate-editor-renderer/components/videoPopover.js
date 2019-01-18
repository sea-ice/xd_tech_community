// @flow
import * as React from "react";
import videoParser from "js-video-url-parser";
import { Popover, Form, Button, Input } from "antd";

const FormItem = Form.Item;

@Form.create()
export default (class VideoModal extends React.Component {
  checkSource(rule, value, callback) {
    try {
      const videoObj = videoParser.parse(value);

      if (
        (videoObj && videoObj.provider === "youtube") ||
        videoObj.provider === "dailymotion" ||
        videoObj.provider === "vimeo" ||
        videoObj.provider === "youku"
      ) {
        callback();
        return;
      }

      return callback("URL not support");
    } catch (e) {
      return callback("URL not support");
    }
  }

  handleClickChange = (visible) => {
    if (!visible) this.handleCancel();
  };

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.hidePopover();
  };

  handleOk = (e) => {
    e.preventDefault();
    const {
      onChange,
      change,
      hidePopover,
      form,
      initialValue,
      node,
      width,
      height,
      youtubeType,
      dailymotionType,
      youkuType,
      vimeoType,
      idKey
    } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        const href = values.href;
        if (href) {
          const videoObj = videoParser.parse(href);
          let slateObj = {};

          if (videoObj && videoObj.provider === "youtube") {
            slateObj = {
              type: youtubeType,
              isVoid: true,
              data: { [idKey]: videoObj.id }
            };
          } else if (videoObj && videoObj.provider === "dailymotion") {
            slateObj = {
              type: dailymotionType,
              isVoid: true,
              data: { [idKey]: videoObj.id }
            };
          } else if (videoObj && videoObj.provider === "vimeo") {
            slateObj = {
              type: youkuType,
              isVoid: true,
              data: { [idKey]: videoObj.id }
            };
          } else if (videoObj && videoObj.provider === "youku") {
            slateObj = {
              type: vimeoType,
              isVoid: true,
              data: { [idKey]: videoObj.id }
            };
          }

          if (slateObj && slateObj.data) {
            if (typeof slateObj.data === "object" && width) {
              slateObj.data.width = width;
            }

            if (typeof slateObj.data === "object" && height) {
              slateObj.data.height = height;
            }
          }

          if (initialValue) {
            // update link
            const newChange = change
              .removeNodeByKey(node.key)
              .insertInline(slateObj);

            onChange(newChange);
          } else {
            onChange(
              change
                .insertInline(slateObj)
                .collapseToStartOfNextText()
                .focus()
            );
          }
          form.resetFields();
        }

        hidePopover();
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { isEditing, initialValue, children } = this.props;
    const content = (
      <Form horizontal="true" onClick={e => e.preventDefault()}>
        <FormItem
          label="Enter video URL (support Vimeo, Youtube, Dailymotion, Youku):"
          hasFeedback
        >
          {getFieldDecorator("href", {
            rules: [
              {
                type: "url",
                message: "The input is not valid url!"
              },
              {
                required: true,
                message: "Please input your url"
              },
              {
                validator: this.checkSource
              }
            ],
            initialValue: initialValue
          })(<Input onClick={e => e.preventDefault()} />)}
        </FormItem>
        <Button key="back" type="ghost" onClick={this.handleCancel}>
          Cancel
        </Button>{" "}
        <Button key="submit" type="primary" onClick={this.handleOk}>
          Ok
        </Button>
      </Form>
    );
    return (
      <Popover
        placement="bottom"
        visible={isEditing}
        title="Add Video"
        trigger="click"
        content={content}
        onVisibleChange={this.handleClickChange}
      >
        {children}
      </Popover>
    );
  }
});
