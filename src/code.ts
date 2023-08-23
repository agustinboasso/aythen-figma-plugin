// import { settings } from "./dist/settings";
import { fnNativeAttributes } from './components/CssProperties';
import {processImages, getImageFills} from './components/ImagesProperties'



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

const childComponents = await Promise.all(node.children.map(async (childNode) => {
  const childComponent = await createComponent(childNode);
  return childComponent;
}));
tree.children = childComponents;
}
//console.log(tree);

return tree;
};



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

      const response = treeComponent;
      
      //console.log("Esta es la respuesta del arbol:",response)

      figma.ui.postMessage({ type: "json-data", data: response });
      //console.log(response);
      

      //figma.ui.postMessage({ type: "clipboard", data: response });

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

