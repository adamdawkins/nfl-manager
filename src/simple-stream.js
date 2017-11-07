//@flow
import R from 'ramda'
import random from 'lodash.random'

import type {Stream} from './stream'
import { stream, pushToStream, addListener } from './stream'
// A Game of Football (of any kinds) is a series of _events_ over time.
// some of these events trigger other events.
// We should be able to look at these streams at any point and decide what to do next.
// BUT, I'm rubbish with the Rxjs, xstream, etc. So we're going to use arrays and functions to fake a stream


const play$ = stream()
const drive$ = stream()


type PlayEvent = {
  duration: number,
  gain: number
}

const play = ():PlayEvent => {
  const isPassComplete = (random(1,3) !== 1) // 2/3 success
  const gain = isPassComplete ? random(1,10) : 0;
  const duration = random(20, 32);

  return { duration, gain }
}

const playLogger = (play:PlayEvent):void => {
  console.log(`${play.gain === 0 ? 'incomplete' : `gained ${play.gain} yards.`} ${play.duration}s`)
}
const play$WithListener = addListener(play$, playLogger)

const createPlayEvent = (play$: Stream):Stream => {
  const event = play();
  return pushToStream(play$, event, false)
}



let n = 10;
const interval =  setInterval(() => {
  createPlayEvent(play$WithListener)
    
  if(!n--) {
    clearInterval(interval)
  }

}, 1000)
