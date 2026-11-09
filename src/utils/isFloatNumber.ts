export const isFloat = (number:number) => {
    // Check if the number is a valid numeric value
    if (typeof number !== 'number' || isNaN(number)) {
      return false;
    }
  
    // Check if the number has a decimal part
    return !Number.isInteger(number)
}