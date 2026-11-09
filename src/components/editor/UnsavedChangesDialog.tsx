import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, ArrowRight, TriangleAlert } from "lucide-react";
import { Button } from "@/components/primitives/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/primitives/dialog";
import { leaveEditor } from "@/config";
import { useAppSelector } from "@/store/hooks";
import { storageKeys } from "@/utils/storageKeys";

interface Props {
  onSave: (fromModal?: boolean, floor?: number) => Promise<boolean>;
}

const UnsavedChangesDialog = ({ onSave }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const venueId = params.get("id") ?? "";
  const floorsCount = useAppSelector((state) => state.venue.floorsCount);
  const [open, setOpen] = useState(false);
  const [pickFloor, setPickFloor] = useState(false);

  const unsavedFloors = Array.from({ length: floorsCount }, (_, i) => i + 1).filter(
    (floor) =>
      localStorage.getItem(storageKeys.areas(floor, venueId)) ||
      localStorage.getItem(storageKeys.selectedArea(floor, venueId)),
  );

  const close = () => {
    setOpen(false);
    setPickFloor(false);
  };

  const goBack = () => {
    if (unsavedFloors.length) return setOpen(true);
    leaveEditor(navigate);
  };

  const goToFloor = (floor: number) => {
    navigate(`/?id=${venueId}&floor=${floor}`);
    close();
  };

  const saveAndContinue = async () => {
    if (unsavedFloors.length > 1) return setPickFloor(true);
    const [floor] = unsavedFloors;
    navigate(`/?id=${venueId}&floor=${floor}`);
    await onSave(true, floor);
    close();
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={goBack}>
        <ArrowLeft />
        {t("header.back")}
      </Button>
      <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
        <DialogContent className="text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-amber-100 text-amber-600">
            <TriangleAlert className="size-6" />
          </span>
          <DialogTitle>
            {t(unsavedFloors.length === 1 ? "modal.attention" : "modal.attention_multi", {
              values: unsavedFloors.join(", "),
            })}
          </DialogTitle>
          {pickFloor ? (
            <div className="grid gap-1">
              {unsavedFloors.map((floor) => (
                <Button key={floor} variant="ghost" className="text-primary" onClick={() => goToFloor(floor)}>
                  {t("modal.go_to_floor")} {floor}
                  <ArrowRight />
                </Button>
              ))}
            </div>
          ) : (
            <DialogDescription>{t("modal.warning_message")}</DialogDescription>
          )}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button variant="outline" className={pickFloor ? "col-span-2" : ""} onClick={() => leaveEditor(navigate)}>
              {t("modal.continue_without_save")}
            </Button>
            {pickFloor ? null : <Button onClick={saveAndContinue}>{t("modal.save_continue")}</Button>}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UnsavedChangesDialog;
