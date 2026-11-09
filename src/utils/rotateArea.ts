export const getRotatedPoints = (element:any) => {
  if(!element) return;
    const matrix = element?.getCTM();
      const x = parseFloat(element.getAttribute("x"));
      const y = parseFloat(element.getAttribute("y"));
      const width = parseFloat(element.getAttribute("width"));
      const height = parseFloat(element.getAttribute("height"));
      const unrotatedPoints = [
        { x, y },
        { x: x + width, y },
        { x: x + width, y: y + height },
        { x, y: y + height },
      ];
      const rotatedPoints = unrotatedPoints.map(({ x, y }) => ({
        x: x * matrix.a + y * matrix.c + matrix.e,
        y: x * matrix.b + y * matrix.d + matrix.f,
      }));
      return rotatedPoints;
  };