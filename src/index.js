//@flow
import R, {
  add,
  assoc,
  evolve,
  either,
  equals,
  or,
  both,
  T,
  F,
  nth,
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

const trace = R.curry((tag, x) => {
  console.log(tag, x);
  return x;
});

const rev = R.curry((v, fn) => fn(v))

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

  // const time = formatTime(game.clock)
  // const offense = currentOffense(game)
  // const eventText = propEq('event', 'TOUCHDOWN', game) ? '*** TOUCHDOWN ***' : 'new play'
  // const { 
  //   score,
  //   teams
  // } = game

  // const abbrs = map(prop('abbr'), teams)
  // write(`(${time})\t [${R.nth(offense, abbrs)}]${eventText}\t ${R.nth(0, abbrs)} ${R.nth(0, score)}-${R.nth(1, score)} ${R.nth (1, abbrs)}`)


const formatDownDistanceAndLOS = (game) => {
  const down = prop('down', game)
  const distance = prop('distance', game)
  return `${down}-${distance}`
}

const formatClock = compose(formatTime, prop('clock'))

const formatPlay = (game:Game):string => {
  return `Pass for ${previousGain(game)} yards`
}

const formatScore = (game:Game): string => {
  const teams = map(prop('abbr'), prop('teams', game))
  const score = prop('score', game)

  return `${nth(0, teams)} ${nth(0, score)} - ${nth(1, score)} ${nth(1, teams)}`
}

    // 1-10-LA 25    (14:54) 30-T.Gurley left end to LA 25 for no gain (94-S.Thomas).

const write = console.log

const render = (game) => {
  const downAndDistance = formatDownDistanceAndLOS
  const time = formatClock
  const play = formatPlay
  const score = formatScore

  return write(R.join('\t', R.ap([downAndDistance, time, play, score], [game])))
}

/*
 * Game logic (probably own module)
 */

const totalGain = (plays: Array<Object>):number => {
  return reduce(add, 0, map(prop('gain'), plays))
}

const currentOffense = path(['currentPossession', 'offense'])
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

const isTouchdown = compose(lte(100), LOS)

/*
 * Game world setup 
 * ========
 * [/] run plays until the end of the game
 * [ ] Turnover on Downs
 * [x] Touchdowns
 * [ ] Game Clock vs real life time
 * [ ] Field Position on Change of Possession
 * [ ] Quarters (?)
 * [ ] Drive Log
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

const isFourthDown = compose(
  R.equals(4),
  prop('down')
)

const previousPlay = R.compose(
  R.head,
  path(['currentPossession', 'plays'])
)
const previousGain = compose(prop('gain'), previousPlay)
 
const isShortOfLineToGain = (game: Game):boolean => {
  return R.gte(
    prop('distance', game),
    previousGain(game)
  )
}

const isTurnoverOnDowns = both(
  isFourthDown, 
  isShortOfLineToGain
)


const captureEvent = cond([
  [isTouchdown,          assoc('event', 'TOUCHDOWN')        ],
  [isTurnoverOnDowns,    assoc('event', 'TURNOVER_ON_DOWNS')],
  [T,                    assoc('event', undefined)] // T :: x => True
])

const decreaseClock = evolve({clock: add(-600)})

const shouldChangePossession = either(isTouchdown, isTurnoverOnDowns)

const changePossession = evolve({
  down: R.always(1),
  distance: R.always(10), // todo
  currentPossession: {
    plays: R.always([]),
    offense: R.ifElse(
      compose(
        equals(0),
        currentOffense,
      ),
      R.always(1),
      R.always(0),
    )
  }
})

const maybeChangePossession = when(
  shouldChangePossession,
  changePossession
)



type Possession = {
plays: Array<Object>,
start: number,
offense: number
}

type Game = {
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
  down: 1,
  distance: 10,
  currentPossession: {
    plays,
    start: 50,
    offense: 1,
  },
  teams: [{abbr: 'DAL', name: 'Dallas Cowboys'}, {abbr: 'PHI', name: 'Philadelphia Eagles'}],
  score: [0, 0],
}

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

const updateDownAndDistance = identity

const update = pipe(
  decreaseClock,
  captureEvent,
  updateScore,
  maybeChangePossession,
  updateDownAndDistance,
  runNextPlay,
)


start(game)
