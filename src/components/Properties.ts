import { getBackgroundColor, getTextColor } from './PropertiesHandlers';


export const fnNativeAttributes = (node) => {
    const allPropertyNames = [
        "id",
        "width",
        "height",
        "currentPage",
        "cancel",
        "origin",
        "onmessage",
        "center",
        "zoom",
        "fontName",
        "name",
        "visible",
        "locked",
        "constraints",
        "relativeTransform",
        "x",
        "y",
        "rotation",
        "constrainProportions",
        "layoutAlign",
        "layoutGrow",
        "opacity",
        "blendMode",
        "isMask",
        "effects",
        "effectStyleId",
        "expanded",
        "backgrounds",
        "backgroundStyleId",
        "fills",
        "strokes",
        "strokeWeight",
        "strokeMiterLimit",
        "strokeAlign",
        "strokeCap",
        "strokeJoin",
        "dashPattern",
        "fillStyleId",
        "strokeStyleId",
        "cornerRadius",
        "cornerSmoothing",
        "topLeftRadius",
        "topRightRadius",
        "bottomLeftRadius",
        "bottomRightRadius",
        "exportSettings",
        "overflowDirection",
        "numberOfFixedChildren",
        "description",
        "layoutMode",
        "primaryAxisSizingMode",
        "counterAxisSizingMode",
        "primaryAxisAlignItems",
        "counterAxisAlignItems",
        "paddingLeft",
        "paddingRight",
        "paddingTop",
        "paddingBottom",
        "itemSpacing",
        "layoutGrids",
        "gridStyleId",
        "clipsContent",
        "guides",
        "guides",
        "selection",
        "selectedTextRange",
        "backgrounds",
        "arcData",
        "pointCount",
        "pointCount",
        "innerRadius",
        "vectorNetwork",
        "vectorPaths",
        "handleMirroring",
        "textAlignHorizontal",
        "textAlignVertical",
        "textAutoResize",
        "paragraphIndent",
        "paragraphSpacing",
        "autoRename",
        "textStyleId",
        "fontSize",
        "fontName",
        "textCase",
        "textDecoration",
        "letterSpacing",
        "lineHeight",
        "characters",
        "mainComponent",
        "scaleFactor",
        "booleanOperation",
        "expanded",
        "name",
        "type",
        "paints",
        "type",
        "fontSize",
        "textDecoration",
        "fontName",
        "letterSpacing",
        "lineHeight",
        "paragraphIndent",
        "paragraphSpacing",
        "textCase",
        "type",
        "effects",
        "type",
        "layoutGrids",
        "absoluteRenderBounds",
    ];
  
    const data = {};
  
    for (const propertyName of allPropertyNames) {
      if (propertyName in node) {
        if (propertyName === "fills") {
          data["backgroundColor"] = getBackgroundColor(node[propertyName]);
          data["color"] = getTextColor(node);
        } else {
          data[propertyName] = node[propertyName];
        }
      }
    }
  
    return data;
  };
  
  
  
  
  
  
  
  