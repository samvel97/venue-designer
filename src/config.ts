/**
 * Optional URL of a host application (e.g. an admin panel with a venues list).
 * When set, "Back" and "Save & continue" return there; otherwise the editor
 * stays standalone and returns to its own start page.
 */
const HOME_URL = import.meta.env.VITE_HOME_URL || "";

export const DEFAULT_VENUE_ID = "demo";

export const leaveEditor = (navigate: (to: string) => void) => {
  if (HOME_URL) {
    window.open(HOME_URL, "_self");
    return;
  }
  navigate(`/?id=${DEFAULT_VENUE_ID}&floor=1`);
};
