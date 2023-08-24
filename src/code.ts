// import { settings } from "./dist/settings";
import { fnNativeAttributes } from './components/CssProperties';
import {processImages} from './components/ImagesProperties'

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


var createComponent =  async (node) => {
  
  const componentType = getComponentType(node.type);
  const hasChildren = node.type === 'GROUP' || node.type === 'FRAME';
  const componentName = node.name;
  const cssProperties = fnNativeAttributes(node);



  const imgProperties = await processImages(node);
  
  var tree = {
    ...templateComponent,
    tag: componentType,
    componentName: componentName,
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
    const childComponents = await Promise.all(
      node.children.map(async (childNode) => {
        const childComponent = await createComponent(childNode);
        return childComponent;
      })
    );

    const chunkSize = 1000000; 
    const childChunks = [];

    for (let i = 0; i < childComponents.length; i += chunkSize) {
      const chunk = childComponents.slice(i, i + chunkSize);
      childChunks.push(chunk);
    }   
    for (const chunk of childChunks) {
      tree.children.push(...chunk);
      await new Promise((resolve) => setTimeout(resolve, 0)); 
    }
  }

  return tree;
};

figma.showUI(__html__, { themeColors: true, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "figma-json") {
    try {
      const selectedComponent = figma.currentPage.selection[0];
      const jsonTree = await createComponent(selectedComponent);
      const jsonText = JSON.stringify(jsonTree, null, 2);
      figma.ui.postMessage({ type: "json-data", data: jsonText });
    } catch (error) {
      console.error('Error al generar el JSON:', error);
    }
  }
}

 
