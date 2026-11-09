export const CANVAS_SIZE = 20000;

const Grid = () => {
  const cellSize = 200;
  return (
    <>
      <defs>
        <pattern id="grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
          <path d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`} fill="none" stroke="silver" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width={CANVAS_SIZE} height={CANVAS_SIZE} fill="url(#grid)" />
    </>
  );
};

export default Grid;
