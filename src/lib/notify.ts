import { toast } from "sonner";
import i18n from "@/i18n/i18n";

const text = (key: string) => i18n.t(`snack.${key}`);

export const notify = {
  success: (key: string) => toast.success(text(key)),
  error: (key: string) => toast.error(text(key)),
};
