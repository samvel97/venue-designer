type Key = string | number | null | undefined;

export const storageKeys = {
  areas: (floor: Key, venueId: Key) => `venue_${floor}_${venueId}_areas`,
  selectedArea: (floor: Key, venueId: Key) => `${floor}_${venueId}_selectedArea`,
};
