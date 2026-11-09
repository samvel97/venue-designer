const Grid = () => {
  const cellSize = 200;
  const size = 20000;
  return (
    <>
      <defs>
        <pattern
          id="grid"
          width={cellSize}
          height={cellSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
            fill="none"
            stroke="silver"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width={size} height={size} fill="url(#grid)" />
    </>
  );
};

export default Grid;
