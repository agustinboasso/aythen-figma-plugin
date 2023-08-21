import { log } from "console";

export function getBackgroundColor(fills) {
    if (fills && fills.length > 0) {
      const fill = fills[0];
      if (fill && fill.type === 'SOLID') {
        return fill.color;
      }
    }
    return null;
  }
  
  export function getTextColor(node) {
    if (node.type === 'TEXT' && node.fills.length > 0) {
      const textFill = node.fills[0];
      if (textFill.type === 'SOLID' && textFill.color) {
        return textFill.color;
      }
    }
    return null;
  }


  export async function processImages(layer) {
    try {
      const images = getImageFills(layer);
      const imageNodes = images.map((image) => image.node);
  
      const promises = images.map(async (image) => {
        try {
          if (image?.intArr) {
            const processedImage = {
              imageHash: await figma.createImage(image.intArr).hash,
              width: image.width,
              height: image.height,
              fillStyleId: image.fillStyleId,
              scaleMode: image.scaleMode,
              imageType: image.imageType,
              src: image.src,
              absoluteTransform: image.absoluteTransform,
              fills: image.fills,
              // Agrega aquí todas las demás propiedades relevantes del nodo de imagen
            };
            delete image.intArr;
  
            // Actualiza el objeto image con el nodo de imagen procesado
            image.node = processedImage;
          }
        } catch (error) {
          console.error('Error processing image:', error);
        }
      });
  
      await Promise.all(promises); // Esperar a que se resuelvan todas las promesas
  
      return imageNodes; // Devolver los nodos de imagen una vez que se hayan procesado
    } catch (error) {
      console.error('Error processing images:', error);
      return [];
    }
  }
  
  function getImageFills(layer) {
    const images =
      Array.isArray(layer.fills) &&
      layer.fills.filter((item) => item.type === 'IMAGE');
  
    // Para cada imagen, crea un objeto que incluya el nodo de imagen y todas las propiedades
    return images.map((image) => ({
      node: image,
      fillStyleId: image.fillStyleId,
      scaleMode: image.scaleMode,
      width: image.width,
      height: image.height,
      imageType: image.imageType,
      src: image.src,
      absoluteTransform: image.absoluteTransform,
      fills: image.fills,
      // Agrega aquí todas las demás propiedades relevantes del nodo de imagen
    }));
  }