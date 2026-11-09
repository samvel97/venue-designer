import { type FloorPropTypes, type IAreaData } from "@/Layout/Layout/Areas/types/areasTypes";
import { isPointInArea } from "./pointInArea";
import { type IMInMax } from "@/types/types";
import { findMinMaxCoordinates } from "./areasMinMaxCoords";
import { ValidationEnum } from "@/enums/validation.enum";
import { ShapeType } from "@/Layout/Layout/Areas/constants/areasConstants";

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
          const validate = isPointInArea(area.properties, seats[j].properties.x, seats[j].properties.y);

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
