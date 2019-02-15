// @flow
import React from "react";
import mapValues from "lodash.mapvalues";
import { markAttrs } from "@canner/slate-icon-shared";

export default function(Tag, markType, stylesAttr = markAttrs) {
  return {
    deserialize(el, next) {
      if (markType && el.tagName && el.tagName.toLowerCase() === Tag) {
        let data = {};

        if (el.style.backgroundColor) {
          data.color = el.style.backgroundColor;
        }

        if (el.style.color) {
          data.color = el.style.color;
        }

        if (el.style.fontSize) {
          data.fontSize = el.style.fontSize;
        }

        if (el.style.letterSpacing) {
          data.letterSpacing = el.style.letterSpacing;
        }

        return {
          object: "mark",
          type: markType,
          data,
          nodes: next(el.childNodes)
        };
      }
    },
    serialize(obj, children) {

      if (obj.object == "mark" && obj.type === markType) {
        let styles = mapValues(stylesAttr, val => val && val(obj))
        if (markType === 'FONTBGCOLOR') {
          // Object.assign(styles, styles.)
        }
        if (markType === 'FONTCOLOR') {
          console.log('fontColor')
          console.log(mapValues(stylesAttr, val => val && val(obj)).color)
        }
        return (
          <Tag style={mapValues(stylesAttr, val => val && val(obj))}>
            {children}
          </Tag>
        );
      }
    }
  };
}
