const plays = [] // We'll Immutable this bitch later

// 1-10-LA 25    (14:54) 30-T.Gurley left end to LA 25 for no gain (94-S.Thomas).
plays.push({
  offense: 'LA',
  defense: 'SF',
  down: 1,
  distance: 10,
  timestamp: 30 * 60 - 6,
  lineOfScrimmage: 25,
  duration: 35,  
  gain: 0
})
// 2-10-LA 25   (14:19) (Shotgun) 16-J.Goff pass short right to 17-R.Woods to LA 34 for 9 yards (24-K.Williams). LA-65-J.Sullivan was injured during the play. His return is Questionable. Caught at LA 31. 3-yds YAC

// 2-10-LA 25   (14:19) pass for 9 yards
plays.push({
  offense: 'LA',
    defense: 'SF',
  down: 2,
  distance: 10,
  timestamp: 30 * 60 - 6 - 35,
  lineOfScrimmage: 25,
  duration: 40,
  gain: 9
})

// 3-1-LA 34 (13:49) 30-T.Gurley left tackle to LA 39 for 5 yards (53-N.Bowman, 33-R.Robinson).
plays.push({
  offense: 'LA',
  defense: 'SF',
  down: 3,
  distance: 1,
  timestamp: 30 * 60 - 6 - 35 - 40,
  duration: 35,
  lineOfScrimmage: 34,
  gain: 3
})

export {
  plays
}
