import { FloorPropTypes, IAreaData } from "Layout/Layout/Areas/types/areasTypes";
import { IMInMax, toolType } from "types/types";
import { shapeCenter } from "./shapeCenter";

export  const findMinMaxCoordinates = (areas:IAreaData[], floor:FloorPropTypes):IMInMax | null =>{
    if (areas.length === 0) {
      return null;
    }
    
    const {x,height,width,y,type:areaType,d} = areas[0].properties
    let smallestX = x;
    let smallestY = y;
    let biggestX = x + width;
    let biggestY = y + height;
    if(areaType === toolType.pen){
      const { minX, minY, maxX, maxY } = shapeCenter(d!);
      smallestX = minX
      smallestY = minY
      biggestX = maxX
      biggestY = maxY
    }
    if(floor){
      const {x, y,width,height,type} = floor
      let floorMinX = x;
      let floorMinY = y;
      let floorMaxX = x + width;
      let floorMaxY = y + height;
      if(type === toolType.pen){
      const { minX, minY, maxX, maxY } = shapeCenter(floor.d!);
      floorMinX = minX
      floorMinY = minY
      floorMaxX = maxX
      floorMaxY = maxY
      // console.log(floorMinX, floorMinY, floorMaxX, floorMaxY);
      
      }
      for (const area of areas) {
        if(area.properties.type === toolType.pen){
          const { minX, minY, maxX, maxY } = shapeCenter(area.properties.d!);
          smallestX = Math.min(smallestX, minX, floorMinX);
          smallestY = Math.min(smallestY, minY, floorMinY);
          biggestX = Math.max(biggestX, maxX, floorMaxX);
          biggestY = Math.max(biggestY, maxY, floorMaxY);
        }
        smallestX = Math.min(smallestX, area.properties.x, floorMinX);
        smallestY = Math.min(smallestY, area.properties.y, floorMinY);
        biggestX = Math.max(biggestX, area.properties.x + area.properties.width, floorMaxX);
        biggestY = Math.max(biggestY, area.properties.y + area.properties.height, floorMaxY);
      }
    }else{
      for (const area of areas) {
        if(area.properties.type === toolType.pen){
          const { minX, minY, maxX, maxY } = shapeCenter(area.properties.d!);
          smallestX = Math.min(smallestX, minX);
          smallestY = Math.min(smallestY, minY);
          biggestX = Math.max(biggestX, maxX);
          biggestY = Math.max(biggestY, maxY);
        }
        smallestX = Math.min(smallestX, area.properties.x);
        smallestY = Math.min(smallestY, area.properties.y);
        biggestX = Math.max(biggestX, area.properties.x + area.properties.width);
        biggestY = Math.max(biggestY, area.properties.y + area.properties.height);
      }
    }
    return {
      smallestX,
      smallestY,
      biggestX,
      biggestY,
    };
  }