import type { ISeatsData } from "@/Layout/Layout/Seats/types/seatsTypes";

/** One SVG path drawing every seat of a row as a circle: far fewer DOM nodes than a <circle> per seat. */
export const seatsPath = (seats: ISeatsData[], radius: number) =>
  seats
    .map(
      ({ properties: { x, y } }) =>
        `M${x - radius} ${y}a${radius} ${radius} 0 1 0 ${radius * 2} 0a${radius} ${radius} 0 1 0 ${-radius * 2} 0`,
    )
    .join("");
