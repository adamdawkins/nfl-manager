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

import type { Game } from './game'
import updateGame from './game-engine'
import render from './render'


const trace = R.curry((tag, x) => {
  console.log(tag, x);
  return x;
});


/*
 * Game world setup 
 * ========
 * [/] run plays until the end of the game
 * [x] Turnover on Downs
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

const isEndOfGame = (game: Game): boolean => {
  return game.clock <= 0
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




const gameLoop = (game: Game):void => {

  if(isEndOfGame(game)) return console.log("THAT'S THE END")

  const newGame = updateGame(game)

  render(game)
  wait()
  gameLoop(newGame)
}

// alias `start` to the gameLoop
const start = gameLoop

start(game)
