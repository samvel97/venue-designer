export const getLSData = (key: string) => {
  try {
    if (typeof window !== "undefined") {
      const value = localStorage.getItem(key);

      if (value !== null) {
        return value;
      }
    }
  } catch (e: unknown) {
    console.log("error reading value", e);
  }
};
