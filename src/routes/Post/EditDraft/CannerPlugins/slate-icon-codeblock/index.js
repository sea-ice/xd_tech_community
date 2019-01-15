// @flow
import * as React from "react";
import { Data } from "slate";
import { Popover, Button, Form, Select } from "antd";
import ToolbarIcon from "@canner/slate-icon-shared";
import PluginEditCode from "slate-edit-code";
import { CODE, CODE_LINE, PARAGRAPH } from "@canner/slate-constant/lib/blocks";
import {
  codeBlockNode,
  codeLineNode
} from "@canner/slate-editor-renderer/lib/codeBlockNode";
import { languages } from "prismjs/components.json";
const Option = Select.Option;

export const CodeBlockPlugin = opt => {
  const options = Object.assign(
    {
      codeType: CODE,
      codeLineType: CODE_LINE,
      getSyntax: node => node.data.get("syntax")
    },
    opt
  );

  return {
    renderNode: props => {
      if (props.node.type === options.codeType) {
        return codeBlockNode(options)(props);
      } else if (props.node.type === options.codeLineType) {
        return codeLineNode()(props);
      }
    }
  };
};
const FormItem = Form.Item;

@Form.create()
export default (class CodeBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false
    };
    this.typeName = this.props.type || CODE;
    this.codePlugin = PluginEditCode({
      onlyIn: node => node.type === this.typeName
    });
  }

  static defaultProps = {
    syntaxKey: "syntax"
  };

  onClick = (e) => {
    let { change, onChange } = this.props;
    let haveCodeBlock = this.codePlugin.utils.isInCodeBlock(change.value);
    e.preventDefault();

    if (haveCodeBlock) {
      onChange(this.codePlugin.changes.unwrapCodeBlock(change, PARAGRAPH));
    } else {
      // open popup
      this.setState({
        showModal: true
      });
    }
  };

  handleClickChange = (visible) => {
    if (!visible) this.handleCancel();
  };

  handleCancel = () => {
    this.props.form.resetFields();
    this.setState({
      showModal: false
    });
  };

  handleSelected = (lang) => {
    const { onChange, change, syntaxKey } = this.props;
    let newChange = change;

    if (lang) {
      newChange = change.setBlocks({
        data: { [syntaxKey]: lang }
      });
    }

    onChange(this.codePlugin.changes.wrapCodeBlock(newChange));
    this.handleCancel();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { change, icon, ...rest } = this.props;
    const { showModal } = this.state;
    const onClick = e => this.onClick(e);

    const content = (
      <div style={{ minWidth: "200px" }}>
        <Form horizontal="true">
          <FormItem label="选择编程语言" hasFeedback>
            <Select
              onSelect={this.handleSelected}
              placeholder="请选择编程语言（可选）"
            >
              {Object.keys(languages)
                .filter(lang => {
                  return languages[lang].title;
                })
                .map(lang => {
                  return (
                    <Option value={lang} key={lang}>
                      {languages[lang].title}
                    </Option>
                  );
                })}
            </Select>
          </FormItem>
        </Form>
      </div>
    );

    return (
      <div style={{ display: "inline-block" }}>
        <Popover
          visible={showModal}
          title="插入代码块"
          placement="bottom"
          content={content}
          trigger="click"
          onVisibleChange={this.handleClickChange}
        >
          <ToolbarIcon
            type={this.typeName}
            icon={icon || "CodeBlock"}
            onClick={onClick}
            isActive={this.codePlugin.utils.isInCodeBlock(change.value)}
            {...rest}
          />
        </Popover>
      </div>
    );
  }
});
