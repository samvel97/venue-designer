import { lazy, memo, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Check, Eye, LoaderCircle, Save, Theater } from "lucide-react";
import { useCreateEditAreaMutation } from "@/api/api";
import { Button } from "@/components/primitives/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/primitives/dialog";
import { leaveEditor } from "@/config";
import type { IAreaData } from "@/Layout/Layout/Areas/types/areasTypes";
import { notify } from "@/lib/notify";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setAreas } from "@/store/venueSlice";
import { textToBinary } from "@/utils";
import { storageKeys } from "@/utils/storageKeys";
import { updateAreas } from "@/utils/updateAreas";
import UnsavedChangesDialog from "./UnsavedChangesDialog";

const HallView = lazy(() => import("@/components/shared/HallView/HallView"));

interface HeaderProps {
  venueId: string;
  floor: string;
  isEqual: boolean;
}

const Header = ({ venueId, floor, isEqual }: HeaderProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [mutateVenue, { isLoading }] = useCreateEditAreaMutation();
  const { validations, areas, floorProps, floorsCount } = useAppSelector((state) => state.venue);
  const [previewOpen, setPreviewOpen] = useState(false);
  const draftKey = storageKeys.selectedArea(floor, venueId);

  const openPreview = (open: boolean) => {
    const draft = localStorage.getItem(draftKey);
    if (open && draft) updateAreas(areas, floorsCount, floorProps, draft, venueId, floor);
    setPreviewOpen(open);
  };

  const save = async (fromModal?: boolean, floorToValidate?: number) => {
    const failed = (validations[floorToValidate ?? +floor] ?? []).filter((item) => !item.isValidate);
    if (!validations[floorToValidate ?? +floor] || failed.length) {
      failed.forEach((item) => notify.error(item.message));
      return false;
    }

    const draft = localStorage.getItem(draftKey);
    const selected: IAreaData | null = draft ? JSON.parse(draft) : null;
    const nextAreas = selected ? areas.map((area) => (area.localId === selected.localId ? selected : area)) : areas;
    dispatch(setAreas(nextAreas));

    const result = await mutateVenue({
      venueId,
      venue: textToBinary({ floor: +floor, properties: floorProps, areas: nextAreas }),
    });
    if (result.data?.message !== "Ok") return false;

    localStorage.removeItem(storageKeys.areas(floor, venueId));
    localStorage.removeItem(draftKey);
    notify.success("saved_success");
    if (fromModal) leaveEditor(navigate);
    return true;
  };

  return (
    <header className="border-border bg-background flex h-14 shrink-0 items-center justify-between gap-4 border-b px-3">
      <div className="flex items-center gap-3">
        <UnsavedChangesDialog onSave={save} />
        <div className="bg-border h-6 w-px" />
        <div className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground grid size-7 place-items-center rounded-lg">
            <Theater className="size-4" />
          </span>
          <h1 className="text-sm font-semibold">{t("header.title")}</h1>
          <span className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-xs">
            {t("rightSide.floor")} {floor}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Dialog open={previewOpen} onOpenChange={openPreview}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye />
              {t("header.preview")}
            </Button>
          </DialogTrigger>
          <DialogContent
            className="h-[min(85vh,800px)] max-w-6xl grid-rows-[auto_1fr] p-0"
            aria-describedby={undefined}
          >
            <DialogTitle className="px-6 pt-5">{t("header.preview")}</DialogTitle>
            <Suspense fallback={<LoaderCircle className="text-primary m-auto size-6 animate-spin" />}>
              <HallView venueId={venueId} />
            </Suspense>
          </DialogContent>
        </Dialog>
        <Button size="sm" className="min-w-24" disabled={isEqual} loading={isLoading} onClick={() => save()}>
          {isLoading ? null : isEqual ? <Check /> : <Save />}
          {isEqual ? t("header.saved") : t("header.save")}
        </Button>
      </div>
    </header>
  );
};

export default memo(Header);
