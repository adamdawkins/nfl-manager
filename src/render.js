//@flow
import {
  compose, ap,
  prop,
  nth, join, map,
} from 'ramda'

import type { Game } from './game'
import { previousGain } from './game'
import { formatTime } from './format'

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
const render = (game:Game):void => {
  const downAndDistance = formatDownDistanceAndLOS
  const time = formatClock
  const play = formatPlay
  const score = formatScore

  return console.log(join('\t', ap([downAndDistance, time, play, score], [game])))
}

export default render
