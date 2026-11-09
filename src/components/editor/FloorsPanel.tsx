import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { Eye, EyeOff, Layers, Plus, Trash2 } from "lucide-react";
import { useCreateEditAreaMutation, useDeleteFloorMutation, useLazyGetLayoutViewQuery } from "@/api/api";
import { Button } from "@/components/primitives/button";
import { Tooltip } from "@/components/primitives/tooltip";
import type { ILayoutView } from "@/Layout/Layout/Areas/types/areasTypes";
import { cn } from "@/lib/cn";
import { notify } from "@/lib/notify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLayoutViewProps } from "@/store/venueSlice";
import { binaryToText, textToBinary } from "@/utils";
import { storageKeys } from "@/utils/storageKeys";

const MAX_FLOORS = 5;
const hiddenLayout: ILayoutView = { floor: "", properties: null };

const FloorsPanel = ({ canAdd, layoutView }: { canAdd: boolean; layoutView: ILayoutView }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const venueId = params.get("id") ?? "";
  const currentFloor = params.get("floor") ?? "1";
  const floorsCount = useAppSelector((state) => state.venue.floorsCount);
  const [mutateVenue, { isLoading: adding }] = useCreateEditAreaMutation();
  const [deleteFloor, { isLoading: removing }] = useDeleteFloorMutation();
  const [getLayoutView] = useLazyGetLayoutViewQuery();

  const openFloor = (floor: string) => {
    setParams((prev) => {
      prev.set("floor", floor);
      return prev;
    });
    if (layoutView.floor === floor) dispatch(setLayoutViewProps(hiddenLayout));
  };

  const toggleOverlay = async (floor: string) => {
    if (layoutView.floor === floor) return dispatch(setLayoutViewProps(hiddenLayout));
    const { data } = await getLayoutView({ id: venueId, floor: +floor });
    if (data?.layout) dispatch(setLayoutViewProps({ floor, properties: binaryToText(data.layout).properties }));
  };

  const addFloor = async () => {
    const { data } = await mutateVenue({
      venueId,
      venue: textToBinary({ floor: floorsCount + 1, properties: {}, areas: [] }),
    });
    if (data?.message === "Ok") notify.success("created_success");
  };

  const removeLastFloor = async () => {
    localStorage.removeItem(storageKeys.areas(floorsCount, venueId));
    localStorage.removeItem(storageKeys.selectedArea(currentFloor, venueId));
    const { error } = await deleteFloor(venueId);
    if (error) return;
    notify.success("removed_success");
    if (+currentFloor === floorsCount) navigate(`/?id=${venueId}&floor=1`);
  };

  return (
    <div className="grid gap-2">
      <h2 className="text-muted-foreground flex items-center gap-1.5 px-1 text-[11px] font-semibold tracking-wider uppercase">
        <Layers className="size-3.5" />
        {t("rightSide.floors")}
      </h2>
      <ul className="grid gap-1">
        {Array.from({ length: floorsCount }, (_, i) => String(i + 1)).map((floor, index) => {
          const active = floor === currentFloor;
          const overlay = layoutView.floor === floor;
          return (
            <li
              key={floor}
              className={cn(
                "group flex items-center gap-1 rounded-lg pr-1 transition-colors",
                active ? "bg-primary/10 text-primary" : "hover:bg-muted",
              )}
            >
              <button
                className="flex-1 cursor-pointer px-3 py-2 text-left text-sm font-medium"
                aria-current={active ? "page" : undefined}
                onClick={() => openFloor(floor)}
              >
                {t("rightSide.floor")} {floor}
              </button>
              {!active ? (
                <Tooltip content={t("rightSide.overlay")}>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("rightSide.overlay")}
                    aria-pressed={overlay}
                    onClick={() => toggleOverlay(floor)}
                  >
                    {overlay ? <Eye /> : <EyeOff className="text-muted-foreground" />}
                  </Button>
                </Tooltip>
              ) : null}
              {index > 0 && index === floorsCount - 1 ? (
                <Tooltip content={t("toolbar.delete")}>
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    aria-label={`${t("toolbar.delete")} ${t("rightSide.floor")} ${floor}`}
                    loading={removing}
                    onClick={removeLastFloor}
                  >
                    {removing ? null : <Trash2 />}
                  </Button>
                </Tooltip>
              ) : null}
            </li>
          );
        })}
      </ul>
      {floorsCount < MAX_FLOORS ? (
        <Button variant="outline" size="sm" disabled={!canAdd} loading={adding} onClick={addFloor}>
          {adding ? null : <Plus />}
          {t("rightSide.add_floor")}
        </Button>
      ) : null}
    </div>
  );
};

export default memo(FloorsPanel);
