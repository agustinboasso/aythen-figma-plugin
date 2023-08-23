// import { settings } from "./dist/settings";
import { fnNativeAttributes } from './components/CssProperties';
import {processImages, getImageFills} from './components/ImagesProperties'

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
  "image":[],
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
        //"cssProperties" :[], 
        "width": "1920",
        "active": true,
        "attribute":[], 
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



var createComponent =  async (node) => {
  const componentType = getComponentType(node.type);
  const hasChildren = node.type === 'GROUP' || node.type === 'FRAME';

  const componentName = node.name;

  const cssProperties = fnNativeAttributes(node);

  //tree.Property.style.desktop.attribute = { ...cssProperties }

  const imgProperties = await processImages(node);
  
  var tree = {
    ...templateComponent,
    tag: componentType,
    componentName: componentName,
    //cssProperties: cssProperties,
    image: imgProperties,
    Property: {
      style: {
        wide: {
          width: "1600",
          active: true,
          attribute: {}
        },
        laptop: {
          width: "1200",
          active: true,
          attribute: {}
        },
        mobile: {
          width: "479",
          active: true,
          attribute: {}
        },
        tablet: {
          width: "991",
          active: true,
          attribute: {}
        },
        desktop: {
          //cssProperties: cssProperties, 
          width: "1920",
          active: true,
          attribute:cssProperties,
        },
        mobileLandscape: {
          width: "767",
          active: true,
          attribute: {}
        }
      },
      grid: {
        h: "",
        w: "",
        x: "",
        y: ""
      },
      event: "",
      state: {},
      other: {}
    },
    hasChildren: hasChildren,
    children: []
  };
  
  
  
  if ((node.type === 'RECTANGLE' || node.type === 'TEXT') && node.fills) {
    tree.image = imgProperties;
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
const childComponents = await Promise.all(node.children.map(async (childNode) => {
  const childComponent = await createComponent(childNode);
  return childComponent;
}));
tree.children = childComponents;
}
console.log(tree);

return tree;
};
// const childComponents = await Promise.all(node.children.map(async (childNode: any) => {
//   const childComponent = await createComponent(childNode); // Llamada recursiva
//   return childComponent;
// }));
// tree.children = childComponents;
// }
// console.log(tree);
// return tree;
// }



figma.showUI(__html__, { themeColors: true, height: 300 });

figma.ui.onmessage = async (msg) => {


  if (msg.type === "figma-json") {
    try {
      const startTime = Date.now(); // Marca el inicio de la generación del JSON

      const selectedComponent = figma.currentPage.selection[0];
      //console.log(selectedComponent)

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

