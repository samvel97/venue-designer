export const shapeCenter = (dCoords:string) => {
    const pathCommands = dCoords.match(/[a-df-z][^a-df-z]*/ig) || [];
    const xCoords:any[] = [];
    const yCoords:any[] = [];
    const allCoordinates:number[] = []
    
    pathCommands.forEach(command => {
        const values = command.trim().split(/\s*,\s*|\s+/).map(parseFloat);
        values.forEach((value, i) => {
            if(!isNaN(value)){
                let coord = value
                if(i === 0 && allCoordinates.length >= 1){
                    coord = (allCoordinates.at(-1) ?? 0) + value
                }else if(allCoordinates.length > 1){
                    coord = (allCoordinates.at(-2) ?? 0) + value
                }
                allCoordinates.push(coord)
            }
        })
    });
    
    allCoordinates.forEach((value, index) => {
        if (index % 2 === 0) {
            xCoords.push(value);
        } else {
            yCoords.push(value);
        }
    });

    const minX = Math.min(...xCoords)
    const minY = Math.min(...yCoords)
    const maxX = Math.max(...xCoords)
    const maxY = Math.max(...yCoords)
    const centerX = minX + (maxX - minX) / 2
    const centerY = minY + (maxY - minY) / 2
    return({ minX, minY, maxX, maxY, centerX, centerY });
}