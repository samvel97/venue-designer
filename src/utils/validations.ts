import { type FloorPropTypes, type IAreaData } from "@/Layout/Layout/Areas/types/areasTypes";
import { shapeCenter } from "./shapeCenter";
import { type IMInMax, toolType } from "@/types/types";
import { findMinMaxCoordinates } from "./areasMinMaxCoords";
import { ValidationEnum } from "@/enums/validation.enum";
import { ShapeType } from "@/Layout/Layout/Areas/constants/areasConstants";

const validationOutsideSeats = (selectedArea: IAreaData, pointX: number, pointY: number) => {
  let isValidPosition = false;

  if (selectedArea.properties.type === toolType.pen) {
    const { rotate, d } = selectedArea.properties;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const path = new Path2D(d);
    if (!ctx) return;
    if (rotate) {
      const { centerX: cX, centerY: cY } = shapeCenter(d as string);
      const rotationMatch = `rotate(${rotate}, ${cX}, ${cY})`.match(/rotate\(([\d.-]+),\s*([\d.-]+),\s*([\d.-]+)\)/);
      if (rotationMatch) {
        const [, angle, centerX, centerY] = rotationMatch.map(Number);
        const radians = (angle * Math.PI) / 180;
        const translatedX = pointX - centerX;
        const translatedY = pointY - centerY;
        const rotatedX = translatedX * Math.cos(-radians) - translatedY * Math.sin(-radians);
        const rotatedY = translatedX * Math.sin(-radians) + translatedY * Math.cos(-radians);

        isValidPosition = ctx.isPointInPath(path, rotatedX + centerX, rotatedY + centerY);
      }
    } else {
      isValidPosition = ctx.isPointInPath(path, pointX, pointY);
    }
  } else if (selectedArea.properties.type === toolType.rectangle) {
    const {
      height: areaH,
      width: areaW,
      x,
      y,
      cornerBottomLeft,
      cornerBottomRight,
      cornerTopLeft,
      cornerTopRight,
      rotate,
    } = selectedArea.properties;
    const topLeft = cornerTopLeft ?? 0;
    const topRight = cornerTopRight ?? 0;
    const bottomLeft = cornerBottomLeft ?? 0;
    const bottomRight = cornerBottomRight ?? 0;

    const shapeD = `
          M ${x + topLeft || 0} ${y}
          L ${x + areaW - (topRight || 0)} ${y}
          A ${topRight || 0} ${topRight || 0}, 0, 0, 1, ${x + areaW} ${y + (topRight || 0)}
          L ${x + areaW} ${y + areaH - (bottomRight || 0)}
          A ${bottomRight || 0} ${bottomRight || 0}, 0, 0, 1, ${x + areaW - (bottomRight || 0)} ${y + areaH}
          L ${x + (bottomLeft || 0)} ${y + areaH}
          A ${bottomLeft || 0} ${bottomLeft || 0}, 0, 0, 1, ${x} ${y + areaH - (bottomLeft || 0)}
          L ${x} ${y + (topLeft || 0)}
          A ${topLeft || 0} ${topLeft || 0}, 0, 0, 1, ${x + (topLeft || 0)} ${y}
          Z
        `;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const path = new Path2D(shapeD);
    if (!ctx) return;
    if (rotate) {
      const myCenterX = x + areaW / 2;
      const myCenterY = y + areaH / 2;
      const rotationMatch = `rotate(${rotate}, ${myCenterX}, ${myCenterY})`.match(
        /rotate\(([\d.-]+),\s*([\d.-]+),\s*([\d.-]+)\)/,
      );
      if (rotationMatch) {
        const [, angle, centerX, centerY] = rotationMatch.map(Number);
        const radians = (angle * Math.PI) / 180;
        const translatedX = pointX - centerX;
        const translatedY = pointY - centerY;
        const rotatedX = translatedX * Math.cos(-radians) - translatedY * Math.sin(-radians);
        const rotatedY = translatedX * Math.sin(-radians) + translatedY * Math.cos(-radians);
        isValidPosition = ctx.isPointInPath(path, rotatedX + centerX, rotatedY + centerY);
      }
    } else {
      isValidPosition = ctx.isPointInPath(path, pointX, pointY);
    }
  } else if (selectedArea.properties.type === toolType.ellipse) {
    const { height: areaH, width: areaW, x, y, rotate } = selectedArea.properties;
    const cx = x + areaW / 2;
    const cy = y + areaH / 2;
    const rx = areaW / 2;
    const ry = areaH / 2;

    const radians = (rotate * Math.PI) / 180;
    const cosTheta = Math.cos(radians);
    const sinTheta = Math.sin(radians);

    const translatedX = pointX - cx;
    const translatedY = pointY - cy;

    const rotatedX = translatedX * cosTheta + translatedY * sinTheta;
    const rotatedY = -translatedX * sinTheta + translatedY * cosTheta;

    const insideEllipse = (rotatedX * rotatedX) / (rx * rx) + (rotatedY * rotatedY) / (ry * ry) <= 1;

    isValidPosition = insideEllipse;
  }

  return isValidPosition;
};

export const validateAreasAndNames = (areas: IAreaData[]) => {
  const validation = {
    name: { name: ValidationEnum.AREA_NAMES, isValidate: true, message: "" },
    area: {
      name: ValidationEnum.AREA_RESERVATION,
      isValidate: true,
      message: "",
    },
    outsideSeats: {
      name: ValidationEnum.OUTSIDE_SEATS,
      isValidate: true,
      message: "",
    },
  };

  for (let i = 0; i < areas.length; i++) {
    const area = areas[i];
    const values = Object.values(area.title);
    if (validation.name.isValidate) {
      for (let j = 0; j < values.length; j++) {
        const name = values[j];
        if (name === "") {
          validation.name.isValidate = false;
          validation.name.message = ValidationEnum.AREA_NAMES;
          break;
        }
      }
    }
    const areaTypes = [ShapeType.WITHOUT_SEATS, ShapeType.WITH_SEATS];
    if (!area.ticketsCount && !area.rows.length && areaTypes.includes(area.areaType)) {
      validation.area.isValidate = false;
      validation.area.message = ValidationEnum.AREA_RESERVATION;
    }

    if (area.rows.length) {
      for (let i = 0; i < area.rows.length; i++) {
        const seats = area.rows[i].seats;
        if (!validation.outsideSeats.isValidate) break;
        for (let j = 0; j < seats.length; j++) {
          const validate = validationOutsideSeats(area, seats[j].properties.x, seats[j].properties.y);

          validation.outsideSeats.isValidate = validate ?? true;

          if (!validate) {
            validation.outsideSeats.message = ValidationEnum.OUTSIDE_SEATS;
            break;
          }
        }
      }
    }
  }
  return validation;
};

const validateFloor = (floorProps: FloorPropTypes) => {
  let validateFloor = false;
  let validationMessage = "";

  if (!floorProps) {
    validateFloor = true;
    validationMessage = ValidationEnum.FLOOR_EXISTING;
  }
  return {
    name: ValidationEnum.FLOOR_EXISTING,
    isValidate: !validateFloor,
    message: validationMessage,
  };
};

export const validateAreasInsideFloor = (areas: IAreaData[], floorProps: FloorPropTypes) => {
  const validateIsInsideFloor = {
    name: ValidationEnum.OUTSIDE_AREAS,
    isValidate: true,
    message: "",
  };
  const validateAreasExisting = {
    name: ValidationEnum.AREA_EXISTING,
    isValidate: true,
    message: "",
  };

  if (!areas.length) {
    validateAreasExisting.isValidate = false;
    validateAreasExisting.message = ValidationEnum.AREA_EXISTING;
  }
  const isValidateFloor = validateFloor(floorProps);

  if (isValidateFloor.isValidate && floorProps && areas.length) {
    const { biggestX, biggestY, smallestX, smallestY } = findMinMaxCoordinates(areas, null) as IMInMax;
    if (
      smallestX < floorProps.x ||
      biggestX > floorProps.x + floorProps.width ||
      smallestY < floorProps.y ||
      biggestY > floorProps.y + floorProps.height
    ) {
      validateIsInsideFloor.isValidate = false;
      validateIsInsideFloor.message = ValidationEnum.OUTSIDE_AREAS;
    }
  }
  const validations = {
    validateIsInsideFloor,
    isValidateFloor,
    validateAreasExisting,
  };
  return validations;
};
