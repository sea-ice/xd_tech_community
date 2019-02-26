import * as React from "react";
import mapValues from "lodash.mapvalues";

export default function(Tag, stylesAttr) {
  const NodeComponent = ({ attributes, children, node }) => {
    return (
      <Tag
        {...attributes}
        data-slate-type={Tag}
        style={mapValues(stylesAttr, val => val && val(node))}
      >
        {children}
      </Tag>
    );
  };

  NodeComponent.displayName = `${Tag}-node`;

  return NodeComponent;
}
