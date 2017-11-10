// @flow
import {
  // Logic
  cond,
  both,
  when,
  either,

  // Function
  T,
  compose,
  pipe,
  always,
  identity,

  // Math
  add,

  // Relation
  gte,
  lte,
  equals,
  ifElse,

  // Object
  evolve,
  assoc,
  prop,
  path,
  lensProp,
  view,
  set,

  // List
  map,
  reduce,
  head,
  adjust,
} from 'ramda'

import type { Game } from './game'
import {
  previousGain,
  LOS,
  currentOffense,
} from './game'


// GAME STATE CHECKS

const isFourthDown = compose(
  equals(4),
  prop('down')
)
const isShortOfLineToGain = (game: Game):boolean => {
  return gte(
    prop('distance', game),
    previousGain(game)
  )
}

// isTouchdown :: Game -> Boolean
const isTouchdown = compose(lte(100), LOS)

// isTurnoverOnDowns :: Game -> Boolean
const isTurnoverOnDowns = both(
  isFourthDown, 
  isShortOfLineToGain
)

const isEndOfPossession = either(isTouchdown, isTurnoverOnDowns)


/* UPDATE FUNCTIONS */
// decreaseClock :: Game -> Game
// returns a new game with clock decreased by 600s
const decreaseClock = evolve({clock: add(-600)})

const scoreTouchdown = (game) => {
  const offenseIndex = currentOffense(game)
  const scoreLens = lensProp('score')
  const score = adjust(add(7), offenseIndex, view(scoreLens, game))

return set(scoreLens, score, game)
}

const updateScore = when(
  isTouchdown,
  scoreTouchdown
)

const changePossession = evolve({
  down: always(1),
  distance: always(10), // todo
  currentPossession: {
    plays: always([]),
    offense: ifElse(
      compose(
        equals(0),
        currentOffense,
      ),
      always(1),
      always(0),
    )
  }
})

const maybeChangePossession = when(
  isEndOfPossession,
  changePossession
)

const updateDownAndDistance = identity
const runNextPlay = identity


// captureEvent :: Game -> Game
// returns a new game with the 'event' property set
const captureEvent = cond([
  [isTouchdown,          assoc('event', 'TOUCHDOWN')        ],
  [isTurnoverOnDowns,    assoc('event', 'TURNOVER_ON_DOWNS')],
  [T,                    assoc('event', undefined)] // T :: x => True
])

const updateGame = pipe(
  decreaseClock,
  captureEvent,
  updateScore,
  maybeChangePossession,
  updateDownAndDistance,
  runNextPlay,
)

export default updateGame
