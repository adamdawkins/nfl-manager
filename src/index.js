//@flow
import R, {
  add,
  assoc,
  evolve,
  or,
  T,
  propEq,
  reduce,
  map,
  prop,
  path,
  lte,
  cond,
  compose,
  identity,
  pipe,
  when,
} from 'ramda'

import sleep from 'system-sleep'

import { formatTime } from './format'
const gameLoop = (game: Game):void => {

  if(endOfGame(game)) return console.log("THAT'S THE END")

  const newGame = update(game)

  render(game)
  wait()
  gameLoop(newGame)
}
// alias `start` to the gameLoop
const start = gameLoop


const runNextPlay = identity

const render = (game:Game):void => {
  const time = formatTime(game.clock)
  const eventText = propEq('event', 'TOUCHDOWN', game) ? '*** TOUCHDOWN ***' : 'new play'
  const score = prop('score', game)
  console.log({score})
  write(`(${time})\t ${eventText}\t ${R.nth(0, score)}-${R.nth(1, score)}`)
}

/*
 * Game logic (probably own module)
 */

const totalGain = (plays: Array<Object>):number => {
  return reduce(add, 0, map(prop('gain'), plays))
}

const currentDriveStartLine = (game: Game): number => {
  return path(['currentPossession', 'start'], game)
}

const playsInCurrentDrive = (game: Game): Array<Object> => {
  return path(['currentPossession', 'plays'], game)
}

const LOS = (game: Game): number => {

  return add(
    currentDriveStartLine(game), 
    totalGain(playsInCurrentDrive(game))
  )
}

const isTouchdown = (game: Game):boolean =>  {
  return  lte(100, LOS(game))
}


/*
 * Game world setup 
 * ========
 * [] run plays until the end of the game
 * [] Turnover on Downs
 * [] Touchdowns
 * [] Game Clock vs real life time
 * [] Field Position on Change of Possession
 * [] Quarters (?)
 * [] Drive Log
 * ...
 * Monads and stuff for FP?
 * ...
 * [] Player qualities
 * [] Play selection from user, etc.
 */


// waits for a bit to put some space between loops
// TODO: We'll be able to do 'game speed'
const wait = () => sleep(50)


const endOfGame = (game: Game): boolean => {
  return game.clock <= 0
}

const captureEvent = cond([
  [isTouchdown,          assoc('event', 'TOUCHDOWN')        ],
  // [isTurnoverOnDowns, assoc('event', 'TURNOVER_ON_DOWNS')],
  [T,                  assoc('event', undefined)] // T :: x => True
])

const decreaseClock = evolve({clock: add(-600)})

const maybeChangePossession = identity


const write = console.log

type Possession = {
  plays: Array<Object>,
  start: number,
  offense: number
}

type Game = {
  clock: number,                                // time remaining in seconds
  currentPossession: Possession,
  event?: string,
  teams: Array<Team>,
  score: Array<number>
}

type Team = {
  name: string
}

const plays = [
  {
    gain: 10
  },
  {
    gain: 5
  },
  {
    gain: 2
  },
  {
    gain: 3
  }
]

const game = {
  clock: 60 * 60,                               // 1 hour in seconds
  currentPossession: {
    plays,
    start: 80,
    offense: 1,
  },
  teams: [{name: 'Dallas Cowboys'}, {name: 'Philadelphia Eagles'}],
  score: [0, 0],
  event: 'TOUCHDOWN',
}
const currentOffense = path(['currentPossession', 'offense'])

const scoreTouchdown = (game) => {
  const offenseIndex = currentOffense(game)
  const scoreLens = R.lensProp('score')
  const score = R.adjust(R.add(7), offenseIndex, R.view(scoreLens, game))

  return R.set(scoreLens, score, game)
}

const updateScore = when(
  propEq('event', 'TOUCHDOWN'),
  scoreTouchdown
)

const update = pipe(
  decreaseClock,
  captureEvent,
  updateScore,
  maybeChangePossession,
  runNextPlay,
)

// start(game)

console.log(scoreTouchdown(game))
