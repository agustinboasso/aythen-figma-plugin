// import { settings } from "./dist/settings";
import { fnNativeAttributes } from './components/Properties';
import {processImages} from './components/PropertiesHandlers'

// var fnNativeAttributes = (node) => {
//   return true;
  // var data = {
  //     test: true
  //   //width: node.width,
  //   //height: node.height,
  // //   backgroundColor: node.fills[0].color
  // //   backgroundColor: getBackgroundColor(node.fills),
  // //   color: getTextColor(node.fills),
  // //   fontFamily: node.fontFamily,
  // //   fontSize: node.fontSize,
  // //   fontWeight: node.fontWeight,
  // //   textAlign: node.textAlign,
  // //   margin: node.margin,
  // //   padding: node.padding,
  // //   border: node.border,
  // //   display: node.layoutAlign,
  // //   top: node.layoutPositioning === 'TOP_LEFT' ? node.y : null,
  // //   right: node.layoutPositioning === 'TOP_RIGHT' ? node.x : null,
  // //   bottom: node.layoutPositioning === 'BOTTOM_LEFT' ? node.y : null,
  // //   left: node.layoutPositioning === 'BOTTOM_RIGHT' ? node.x : null,
  // //   float: node.layoutAlign,
  // //   clear: node.layoutGrow,
  // //   opacity: node.opacity,
  // //   transition: node.playbackSettings,
  // //   transform: node.relativeTransform,
  // //   boxShadow: node.effects,
  // //   textDecoration: node.textDecoration,
  // //   borderRadius: node.cornerRadius,
  // //   boxSizing: node.constraints,
  // //   overflow: node.layoutSizingHorizontal,
  // //   zIndex: node.zIndex
  // }

  // return data





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



// The Figma nodes are hard to inspect at a glance because almost all properties are non enumerable
// getters. This removes that wrapping for easier inspecting
// const cloneObject = (obj: any, valuesSet = new Set()) => {
//   if (!obj || typeof obj !== "object") {
//     return obj;
//   }

//   const newObj: any = Array.isArray(obj) ? [] : {};

//   for (const property of allPropertyNames) {
//     const value = obj[property];
//     if (value !== undefined && typeof value !== "symbol") {
//       newObj[property] = obj[property];
//     }
//   }

//   return newObj;
// };



var allowAttr = [
  ['width', ['0px', 'auto']],
  ['height', ['0px', 'auto']],
  ['backgroundColor', ['auto']]
]

var getComponentType = (type) => {
  if (type === 'RECTANGLE') {
    return 'div';
  } else if (type === 'TEXT') {
    return 'span';
  } else if (type === 'ELLIPSE' || type === 'STAR' || type === 'VECTOR' || type === 'LINE') {
    return 'svg';
  } else if (type === 'IMAGE') {
    return 'img';
  } else {
    return 'div';
  }
}


var templateComponent = {
  "tag": "span",
  "attributes": {},
  //"images":[],
  "nativeAttributes": {
    "value": "text",
    "innerHTML": "text"
  },
  "isShow": true,
  "isDeleted": false,
  "Property": {
    "style": {
      "wide": {
        "width": "1600",
        "active": true,
        "attribute": {}
      },
      "laptop": {
        "width": "1200",
        "active": true,
        "attribute": {}
      },
      "mobile": {
        "width": "479",
        "active": true,
        "attribute": {}
      },
      "tablet": {
        "width": "991",
        "active": true,
        "attribute": {}
      },
      "desktop": {
        "width": "1920",
        "active": true,
        "attribute": {
          "display": {
            "value": "inline",
            "active": true
          }
        }
      },
      "mobileLandscape": {
        "width": "767",
        "active": true,
        "attribute": {}
      }
    },
    "grid": {
      "h": "",
      "w": "",
      "x": "",
      "y": ""
    },
    "event": "",
    "state": {},
    "other": {}
  },
  "componentName": "" ,
};


var createComponent = async (node) => {
  const componentType = getComponentType(node.type);
  const hasChildren = node.type === 'GROUP' || node.type === 'FRAME';

  const componentName = node.name;

  const cssProperties = fnNativeAttributes(node);
  
  var tree = {
     ...templateComponent,
    tag: componentType,
    componentName: componentName,
    images: [],
    nativeAttributes: cssProperties,
    hasChildren: hasChildren,
    children: [],
    
  };
  
  
  if ((node.type === 'RECTANGLE' || node.type === 'TEXT') && node.fills) {
    const imageNodes = await processImages(node);
    //console.log(imageNodes);
    
    tree.images = imageNodes; 
  }

  if (hasChildren && !(componentType == 'svg')) {
    //console.log('n4: ', node.children.length);
//     const childComponents = node.children.map(childNode => {
//       return createComponent(childNode);
//     });
//     tree.children = childComponents;
//     console.log(tree);
//   }

  
//   return tree;
// }
node.children.forEach(childNode => {
  const childComponent = createComponent(childNode); // Llamada recursiva
  tree.children.push(childComponent); // Agregamos el hijo procesado al árbol
});
}
console.log(tree);
return tree;
}




figma.showUI(__html__, { themeColors: true, height: 300 });

figma.ui.onmessage = async (msg) => {


  if (msg.type === "figma-json") {
    try {
      const startTime = Date.now(); // Marca el inicio de la generación del JSON

      const selectedComponent = figma.currentPage.selection[0];
      const treeComponent = await createComponent(selectedComponent);

      const endTime = Date.now(); // Marca el final de la generación del JSON
      const jsonGenerationTime = endTime - startTime; // Calcula el tiempo de generación

      const response = JSON.stringify(treeComponent);

      figma.ui.postMessage({ type: "clipboard", data: response });

      // Envía el tiempo de generación del JSON al componente React
      figma.ui.postMessage({ type: "json-generation-time", time: jsonGenerationTime });
    } catch (error) {
      console.error('No se ha seleccionado ningun componente:', error);
    }
  }
    
    try {
      // const response = await fetch('http://localhost:4000/api/v1/component', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(jsonData) // Envía el JSON proporcionado
      // });

      // if (response.ok) {
      //   const responseData = await response.json();
      //   console.log('Respuesta del backend:', responseData);
      // } else {
      //   console.error('Error en la solicitud al backend:', response.status);
      // }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }

    
  }
  // console.log(jsonData);
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.


  //figma.closePlugin();

