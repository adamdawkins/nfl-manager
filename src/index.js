import assert from 'assert'


const IO = {
  printDriveHeader,
}

const Game = (state, action) => {
  return state;
}

const SFvsLA = Game({
  teams: ['SF', 'LA'],
  offense: 'SF',
  defense: 'LA',
  clock: 60 * 60, // we store the clock in seconds
  LOS: 25,  // LOS: Line of Scrimmage, where the ball start this play
  down: 1,
  distance: 10,
  score: [0, 0],
  drives: [],
})

// drive runs a series of plays for one team, until terminated by:
// 1. a touchdown
// 2. turnover on downs
// 3. the end of the game
const endOfGame = (game: Object):void => {
  console.log('end of game', {game})
}


console.log(startDrive(SFvsLA, IO))
// assert.equal(drive({clock: 0}), undefined)



//   // runPlay :: () -> Int (yards gained)
//   const runPlay = ():number => {
//     const { yardsGainedPerPlay, secondsPerPlay } = Settings // ! Impure
//     const isPassComplete = !(Math.floor(Math.random() * 3) === 0) // change to 2/3 chance
//     const message = isPassComplete ? `Complete for ${yardsGainedPerPlay} yards` : 'Incomplete pass' 
//     IO.printMessageWithClockAndScore(message)
//     DIRTY.drainClock(secondsPerPlay)
//     return isPassComplete ? yardsGainedPerPlay : 0 // if it was complete, go 5 yards
//   }


// const isTurnoverOnDowns = (yardGains:Array<number>, down:number = 1, distance:number = 10, debug:boolean = false):boolean => {
//   const gain = R.head(yardGains)
//   const rest = R.tail(yardGains)
//   debug && console.log({gain, rest, down, distance })

//   // We've reached the end of the plays without turning over on downs
//   if (typeof gain === 'undefined') {
//     debug && console.log(`Not turning over on downs it's ${ordinal(down)} & ${distance}`);
//     return false
//   }

//   // It must be a turnover on downs in this case
//   if (down === 4 && gain < distance) {
//     debug && console.log(`TURNOVER: Failed to convert on 4th & ${distance} (${gain} yards gained)`);
//     return true
//   }

//   // reset to first down if the distance is gained
//   if (gain >= distance) {
//     return isTurnoverOnDowns(rest, 1, 10)
//   } else  {
//     // increment down, adjust distance
//     return isTurnoverOnDowns(rest, down + 1, distance - gain)
//   }
// }

// const updateDriveSummary = (eventName: string, plays: Array<number>):void => {
//   driveSummary.push(
//     `${padLeft(`${driveSummary.length + 1}`, 3, ' ')}: [${DIRTY.getFormattedClock()}] ${DIRTY.getOffense()} - ${padRight(`${eventName} (${plays.length} plays)`, 30, ' ')} ${DIRTY.getFormattedScore()}`
//   )
// }

// // isTouchdown :: [Int] -> Int -> Boolean
// const isTouchdown = (yardGains:Array<number>, startingFieldPosition:number):boolean =>  {
//   // once the yardgains + the startingFieldPosition are more than 100 yards, it must be a touchdon

//   return R.sum(yardGains) + startingFieldPosition >= 100
// }

// const continueDrive = (plays:Array<number> = []) => {
//   if (plays.length === 0) {
//     IO.printGameState()
//   }
//   const start = 25; // start on 25 yard line
//   if (DIRTY.isEndOfGame()) {
//     return endOfGame()
//   }
   
//   if(isTurnoverOnDowns(plays)) {
//     updateDriveSummary("TURNOVER ON DOWNS", plays)
//     IO.printGameState()
//     IO.printBreak()
//     return endOfDrive()
//   }

//   if (isTouchdown(plays, start)) {
//     updateDriveSummary("TOUCHDOWN", plays)
//     DIRTY.addScore(GameState.offense, 7)
//     IO.printGameState()
//     IO.printBreak()
//     return endOfDrive()
//   }

//   // if it's not a touchdown on a turnover, keep driving
//   const play = runPlay()
//   plays.push(play)
//   AllPlays.push(play)
//   return continueDrive(plays)
// }

// const Settings = {
//   yardsGainedPerPlay: 4,
//   secondsPerPlay: 28,
// }


// const AllPlays = []
// const GameState = {
//   teams: ['PHI', 'DAL'],
//   offense: 0,
//   defense: 1,
//   score: [0,0],
//   clock: 3600 // seconds
// }

// const endOfDrive = ():void => {
//   DIRTY.changePossession()
//   continueDrive()
// }

// const endOfGame = () => {
//   IO.printBreak()
//   console.log("END OF GAME")
//   IO.printBreak()
//   IO.printBreak()
//   IO.printFullScore()
//   IO.printBreak()
//   IO.printBreak()
//   console.log('DRIVE SUMMARY')
//   R.map(console.log, driveSummary)
//   console.log(`TOTAL PLAYS: ${AllPlays.length}`)
// }

// const DIRTY = {
//   isEndOfGame():boolean {
//     return GameState.clock <= 0
//   },
//   addScore(team:number, points:number):void {
//     GameState.score[team] += points
//   },
//   changePossession() {
//     const { defense, offense } = GameState
//     GameState.defense = offense
//     GameState.offense = defense
//   },
//   drainClock(seconds:number):void {
//     GameState.clock -= Math.floor(seconds) // integerize
//   },
//   getClock():number {
//     return GameState.clock
//   },
//   getFormattedClock():string {
//     const { clock } = GameState
//     const minutes = Math.floor(clock / 60).toString()
//     const seconds = (clock % 60).toString()
//     return `${padRight(minutes, 2, '0')}:${padRight(seconds, 2, '0')}`
//   },
//   getFormattedScore():string {
//     const { score } = GameState
//     return `${score[0]} — ${score[1]}`
//   },
//   getOffense():string {
//     const { teams, offense } = GameState
//     return teams[offense]
//   }
// }

// const IO = {
//   printBreak() {
//     console.log('--------------------')
//   },

//   printClock() {
//     console.log(DIRTY.getFormattedClock())
//   },
//   printGameState() {
//     IO.printPossession()
//   },
//   printScore() {
//     console.log(DIRTY.getFormattedScore())
//   },
//   printPossession() {
//     const {teams, offense, score} = GameState
//     console.log(`[${DIRTY.getFormattedClock()}] - ${teams[offense]} have the ball -  ${ DIRTY.getFormattedScore() }`)
//   },
//   printFullScore() {
//     const {teams, score} = GameState
//     console.log(`${teams[0]} ${score[0]} — ${score[1]} ${ teams[1]}`)
//   },
//   printMessageWithClockAndScore(message:string) {
//     console.log(`[${DIRTY.getFormattedClock()}] ${message} (${DIRTY.getFormattedScore()})`)
//   }
// }

// const driveSummary = []

// continueDrive()
