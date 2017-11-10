//@flow 
import {
  head,
  reduce,
  map,

  prop,
  path,
  
  add,

  compose,
} from 'ramda'

type Possession = {
plays: Array<Object>,
start: number,
offense: number
}

export type Game = {
  clock: number,                                // time remaining in seconds
  currentPossession: Possession,
  down: number,
  distance: number,
  event?: string,
  teams: Array<Team>,
  score: Array<number>
}

type Team = {
name: string,
abbr: string
}

// GAME DATA
const previousPlay = compose(
  head,
  path(['currentPossession', 'plays'])
)
const previousGain = compose(prop('gain'), previousPlay)

const currentDriveStartLine = (game: Game): number => {
  return path(['currentPossession', 'start'], game)
}

const totalGain = (plays: Array<Object>):number => {
  return reduce(add, 0, map(prop('gain'), plays))
}

const LOS = (game: Game): number => {
  return add(
    currentDriveStartLine(game), 
    totalGain(playsInCurrentDrive(game))
  )
}

const playsInCurrentDrive = (game: Game): Array<Object> => {
  return path(['currentPossession', 'plays'], game)
}

const currentOffense = path(['currentPossession', 'offense'])

export {
  previousGain,
  LOS,
  currentOffense,
}
