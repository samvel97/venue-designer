import { type IAreaData } from "@/Layout/Layout/Areas/types/areasTypes";

export const getHigherOrder = (areas: IAreaData[]) => {
  let maxOrder: number = 0;
  areas.forEach((item) => {
    if (item.localId > maxOrder) {
      maxOrder = item.localId;
    }
  });
  return maxOrder;
};
