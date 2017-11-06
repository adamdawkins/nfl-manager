//@flow
// Helpers
// ordinal :: Int -> String
const ordinal = (number: number):string => {
  switch (number % 10) {
    case 1:
      return `${number}st`
    case 2:
      return `${number}nd`
    case 3:
      return `${number}rd`
    default:
      return `${number}th`
  }
}

const padLeft = (string: string, desiredLength: number, character:string):string  => {
  if(string.length === Math.floor(desiredLength)) { // Math.floor here to force an integer (string length would never equal 4.2 and we'd recurse forever!)
    return string;
  }
  
  // pad and go again
  return padLeft(`${character}${string}`, desiredLength, character)
}
const padRight = (string:string, desiredLength:number, character:string):string  => {

  if(string.length === Math.floor(desiredLength)) { // Math.floor here to force an integer (string length would never equal 4.2 and we'd recurse forever!)
    return string;
  }

  // pad and go again
  return padRight(`${string}${character}`, desiredLength, character)
}

export {
  padRight,
  padLeft,
  ordinal,
}
