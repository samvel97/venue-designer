import { type FloorPropTypes, type IAreaData } from "@/Layout/Layout/Areas/types/areasTypes";
import { textToBinary } from "@/utils";

export const updateAreas = (
  allAreas: IAreaData[],
  floorsCount: number,
  properties: FloorPropTypes,
  selectedArea: string,
  venueId: string,
  floor: string,
) => {
  const selected: IAreaData = JSON.parse(selectedArea);

  if (!allAreas.length) return;
  const managedList = allAreas.map((area) => {
    if (area.localId === selected.localId) {
      return selected;
    }
    return area;
  });
  const makeBinary = textToBinary({
    floorsCount: floorsCount,
    properties: properties,
    areas: managedList,
  });

  localStorage.setItem(`venue_${floor}_${venueId}_areas`, makeBinary);
  localStorage.removeItem(`${floor}_${venueId}_selectedArea`);
  return { managedList };
};
