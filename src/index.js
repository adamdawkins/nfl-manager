//@flow
import xs from 'xstream'

import { formatTimestamp, formatLOS } from './format'
import { plays } from './example'
import { printPlay } from './drive-chart'

const gameSpeed = 30 // number of seconds a game output should last
const gameLength = 60 * 60 // length of game in real world seconds

const play$ = xs.fromArray(plays)

const clock$ = xs.periodic(gameSpeed * 1000 / gameLength)
  .take(gameLength)
  .filter(time => (play$.map(play => play.timestamp === time)).length > 0)
  .map(i => gameLength - i)

const printTime = (timestamp: number):void => {
  console.log(formatTimestamp(timestamp))
}

clock$.addListener({
  next: printTime,
  error: err => console.error(err),
  complete: () => console.log('STOP! END OF GAME')
})

// console.log(`${plays.length} plays found`)
// const play$ = xs.fromArray(plays)

// play$.addListener({
//   next: printPlay,
//   error: err => console.error(err),
//   done: console.log('end of drive?'),
// })



// game$.addListener({
//   next: thing => console.log(thing),
//   error: err => console.error(err),
//   done: console.log('end of drive?'),
// })

// Ok, our streams
// drives (a section of possession by one team)
// subscribe for:
//  - current score
//  - who has the ball
//
//
// plays (streams of plays that are happening)
//  subscribe for:
//  down & distance
//  ball position (line of scrimmage)

// clock
// mapping against seconds reamining, this could control the speed at which we go through the game, but how do we join them up with the drive and play start times?
// subscribe for
//  - end of game
