//@flow
const R = require('ramda')
import { formatLOS, formatTimestamp } from './format'
import { plays } from './example'

// 5-B.Pinion kicks 68 yards from SF 35 to LA -3. 10-P.Cooper to LA 25 for 28 yards (31-R.Mostert).
  const startingGameState = {
    teams: ["LA", "SF"],
    timeRemaining: 30 * 60,
    offense: "LA",
    defense: "SF",
    lineOfScrimmage: 25,
    down: 1,
    distance: 10,
    score: [24, 13]
  }




// A full play-by-play drive chart as per (nfl.com)[http://bit.ly/2heTGXY]
const printDriveChart = (state: Object, plays: Array<Object>):void => { 
  printDriveHeader(state)
  R.map(printPlay, plays)
  printDriveSummary(state, plays)
}

  // e.g. "Los Angeles Rams at 15:00 3rd Quarter"
const printDriveHeader = (state: Object): void => {
  console.log(`** ${state.offense} at ${formatTimestamp(state.clock)} **`)
}

// e.g. LA 7 SF 7 Plays: 14, Possession: 6:31
const printDriveSummary = (gameState: Object, plays: Array<Object>): void => {
  // TODO: score needs to include any scores in this drive, 
  const { teams, score } = gameState;
  const displayScore = `${teams[0]} ${score[0]} ${teams[1]} ${score[1]}\t`
  const numberOfPlays = `Plays: ${plays.length}`
  const possessionInSeconds = R.sum(R.map(R.prop('duration'), plays))
  const timeOfPossession = `Possession: ${formatTimestamp(possessionInSeconds)}`

  const summary = R.join(' ', [displayScore, numberOfPlays, timeOfPossession])


  console.log(summary)
}

const printPlay = (play: Object): void =>  {
  const { 
    down,
    distance,
    timestamp,
    lineOfScrimmage,
    offense,
    defense,
    gain,
  } = play

  // 1-10-LA 25    (14:54) 30-T.Gurley left end to LA 25 for no gain (94-S.Thomas).
  const los = formatLOS(lineOfScrimmage, offense, defense)
  const clock = formatTimestamp(timestamp)
  console.log(`${down}-${distance}-${los}\t(${ clock }) ${gain === 0 ? 'Incomplete' : `Pass for ${gain} yards.`}`)
}

export {
  printDriveHeader,
  printPlay,
  printDriveSummary,
}

// printDriveChart(startingGameState, [])
