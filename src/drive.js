//@flow
import assert from 'assert'
const consoleHistory = [];
const log = (stuff: any) =>  {
  consoleHistory.push(stuff)
  return console.log(stuff)
}

export const startDrive = (gameState: Object, IO: Object, plays: Array<Object> = []) => {
  IO.printDriveChart(gameState, plays)
  return drive(gameState, plays)
}

export const drive = (gameState: Object, plays:Array<Object> = [], debug: boolean = false):Object => {
  console.log('drive')
  if(gameState.clock <= 0) {
    return {
      plays,
      action: 'End of game'
    }
  }

  return  {
    plays,
  }
}
