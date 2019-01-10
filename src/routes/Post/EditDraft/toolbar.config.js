import { AlignCenter, AlignLeft, AlignRight } from "@canner/slate-icon-align";
import Blockquote from "@canner/slate-icon-blockquote";
import Table from "@canner/slate-icon-table";
import CodeBlock from "@canner/slate-icon-codeblock";
import { Header1, Header2, Header3, Header4 } from "@canner/slate-icon-header";
import Hr from "@canner/slate-icon-hr";
import { Indent, Outdent } from "@canner/slate-icon-indent";
import Link from "@canner/slate-icon-link";
import { OlList, UlList } from "@canner/slate-icon-list";
import Undo from "@canner/slate-icon-undo";
import Redo from "@canner/slate-icon-redo";


export default [
  { type: Undo, title: "撤销" },
  { type: Redo, title: "重做" },
  "seperator",
  { type: Header1, title: "标题1" },
  { type: Header2, title: "标题2" },
  { type: Header3, title: "标题3" },
  { type: Header4, title: "标题4" },
  { type: Blockquote, title: "引用" },
  { type: Hr, title: "分隔线" },
  "seperator",
  { type: AlignLeft, title: "左对齐" },
  { type: AlignCenter, title: "水平居中" },
  { type: AlignRight, title: "右对齐" },
  { type: Indent, title: "增加缩进" },
  { type: Outdent, title: "减少缩进" },
  "seperator",
  { type: OlList, title: "有序列表" },
  { type: UlList, title: "无序列表" },
  "seperator",
  { type: Link, title: "超链接" },
  { type: "image", title: "图片" },
  { type: CodeBlock, title: "代码块" },
  { type: Table, title: "表格" },
  "seperator",
  { type: "help", title: "Help" }
]