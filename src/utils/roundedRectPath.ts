interface Corners {
  cornerTopLeft?: number;
  cornerTopRight?: number;
  cornerBottomRight?: number;
  cornerBottomLeft?: number;
}

export const roundedRectPath = (x: number, y: number, width: number, height: number, corners: Corners) => {
  const {
    cornerTopLeft: tl = 0,
    cornerTopRight: tr = 0,
    cornerBottomRight: br = 0,
    cornerBottomLeft: bl = 0,
  } = corners;
  return [
    `M ${x + tl} ${y}`,
    `L ${x + width - tr} ${y}`,
    `A ${tr} ${tr}, 0, 0, 1, ${x + width} ${y + tr}`,
    `L ${x + width} ${y + height - br}`,
    `A ${br} ${br}, 0, 0, 1, ${x + width - br} ${y + height}`,
    `L ${x + bl} ${y + height}`,
    `A ${bl} ${bl}, 0, 0, 1, ${x} ${y + height - bl}`,
    `L ${x} ${y + tl}`,
    `A ${tl} ${tl}, 0, 0, 1, ${x + tl} ${y}`,
    "Z",
  ].join(" ");
};
