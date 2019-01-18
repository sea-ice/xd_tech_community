import * as React from "react";
import { Table } from "antd";

const hotKeyColumns = [
  {
    title: "操作",
    dataIndex: "action"
  },
  {
    title: "快捷键",
    dataIndex: "hotKey"
  }
];

const formattingColumns = [
  {
    title: "操作",
    dataIndex: "action",
    width: 100
  },
  {
    title: "Markdown语法",
    dataIndex: "formattingKey"
  }
];

const cmdHotKeyData = [
  {
    key: "copy",
    action: "复制文本",
    hotKey: (
      <span>
        <kbd>Ctrl</kbd> + <kbd>c</kbd>
      </span>
    )
  },
  {
    key: "cut",
    action: "剪切",
    hotKey: (
      <span>
        <kbd>Ctrl</kbd> + <kbd>x</kbd>
      </span>
    )
  },
  {
    key: "paste",
    action: "粘贴",
    hotKey: (
      <span>
        <kbd>Ctrl</kbd> + <kbd>v</kbd>
      </span>
    )
  },
  {
    key: "undo",
    action: "撤销上一次操作",
    hotKey: (
      <span>
        <kbd>Ctrl</kbd> + <kbd>z</kbd>
      </span>
    )
  },
  {
    key: "bold",
    action: "粗体",
    hotKey: (
      <span>
        <kbd>Ctrl</kbd> + <kbd>b</kbd>
      </span>
    )
  },
  {
    key: "italic",
    action: "斜体",
    hotKey: (
      <span>
        <kbd>Ctrl</kbd> + <kbd>i</kbd>
      </span>
    )
  },
  {
    key: "underline",
    action: "下划线",
    hotKey: (
      <span>
        <kbd>Ctrl</kbd> + <kbd>u</kbd>
      </span>
    )
  },
  {
    key: "exitCode",
    action: "退出代码编辑",
    hotKey: (
      <span>
        在代码块中使用 <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
      </span>
    )
  }
];

const optHotKeyData = [
  {
    key: "strikethrough",
    action: "删除线",
    hotKey: (
      <span>
        <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>d</kbd>
      </span>
    )
  },
  {
    key: "boldItalic",
    action: "粗斜体",
    hotKey: (
      <span>
        <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>b</kbd>
      </span>
    )
  },
  {
    key: "header1",
    action: "标题1",
    hotKey: (
      <span>
        <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>1</kbd>
      </span>
    )
  },
  {
    key: "header2",
    action: "标题2",
    hotKey: (
      <span>
        <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>2</kbd>
      </span>
    )
  },
  {
    key: "header3",
    action: "标题3",
    hotKey: (
      <span>
        <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>3</kbd>
      </span>
    )
  },
  {
    key: "blockquote",
    action: "文本引用",
    hotKey: (
      <span>
        <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>q</kbd>
      </span>
    )
  }
];

const formattingData = [
  {
    key: "blockquote",
    action: "文本引用",
    formattingKey: "“>”后加空格"
  },
  {
    key: "codeblock-inline",
    action: "内联代码块",
    formattingKey: "四个空格"
  },
  {
    key: "codeblock",
    action: "代码块",
    formattingKey: "'```' or '```'后面再加你想使用的编程语言，最后再加一个空格(注意前三个字符是反引号，在键盘左上角数字1的左边)"
  },
  {
    key: "header",
    action: "标题1~6",
    formattingKey: "分别使用1~6个#，后面再加一个空格"
  },
  {
    key: "hr",
    action: "分隔线",
    formattingKey: "'***'加空格 or '---'加空格"
  },
  {
    key: "ul",
    action: "无序列表",
    formattingKey: "'*'加空格 or '+'加空格 or '-'加空格"
  },
  {
    key: "ol",
    action: "有序列表",
    formattingKey: "数字加'.'再加空格，比如'1. '"
  }
];

const formattingInlineData = [
  {
    key: "strikethrough",
    action: "删除线",
    formattingKey: "~要删除的文字~然后空格"
  },
  {
    key: "bold",
    action: "粗体",
    formattingKey: "__要加粗的文字__然后空格 or **要加粗的文字**然后空格"
  },
  {
    key: "italic",
    action: "斜体",
    formattingKey: "_要加斜体的文字_然后空格 or *要加斜体的文字*然后空格"
  },
  {
    key: "boldItalic",
    action: "Bold + Italic",
    formattingKey:
      "___要加粗斜体的文字___然后空格 or ***要加粗斜体的文字***然后空格"
  },
  {
    key: "link",
    action: "插入超链接",
    formattingKey: '[超链接文本](链接的地址 "鼠标移到超链接上显示的文字")最后加空格，比如输入：[源来](http://www.yuanlai.com/ "源来")。注意链接地址与显示文本之间有空格'
  },
  {
    key: "image",
    action: "插入图片",
    formattingKey: '![文本](http://example.com "Optional title")然后空格，比如输入：![示例图片](https://www.baidu.com/img/xinshouye_7c5789a51e2bfd441c7fe165691b31a1.png)'
  }
];

export default class HelpMenu extends React.Component {
  render() {
    return (
      <div>
        <h3>快捷键</h3>
        <h4>Ctrl快捷键:</h4>
        <Table
          columns={hotKeyColumns}
          dataSource={cmdHotKeyData}
          size="large"
          pagination={false}
        />
        <h4 style={{ marginTop: "10px" }}>Ctrl+Alt快捷键:</h4>
        <Table
          columns={hotKeyColumns}
          dataSource={optHotKeyData}
          size="large"
          pagination={false}
        />
        <h4 style={{ marginTop: "10px" }}>新建一个段落</h4>
        <Table
          columns={formattingColumns}
          dataSource={formattingData}
          size="small"
          pagination={false}
        />
        <h4 style={{ marginTop: "10px" }}>行内格式化</h4>
        <Table
          columns={formattingColumns}
          dataSource={formattingInlineData}
          size="small"
          pagination={false}
        />
      </div>
    );
  }
}