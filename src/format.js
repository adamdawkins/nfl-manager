//@flow
import assert from 'assert'
import { padLeft } from './utils'

export const formatLOS = (LOS: number, offense: string, defense: string): string => {
  switch(Math.sign(LOS - 50)) { 
    case (-1):
      return `${offense} ${LOS}`
    case (1):
      return `${defense} ${100-LOS}`
    default:
      return '50'
  }
}

assert.strictEqual(formatLOS(10, 'PHI', 'DAL'), 'PHI 10')
assert.strictEqual(formatLOS(80, 'PHI', 'DAL'), 'DAL 20')
assert.strictEqual(formatLOS(50, 'PHI', 'DAL'), '50', '50 yard line should return "50"')

export const formatTimestamp = (timestampInSeconds: number): string => {
  const wholeMinutes = Math.floor(timestampInSeconds / 60).toString()
  const remainingSeconds = (timestampInSeconds % 60).toString()

  return `${padLeft(wholeMinutes, 2, '0')}:${padLeft(remainingSeconds, 2, '0')}`
}

assert.strictEqual(formatTimestamp(3600), '60:00')
assert.strictEqual(formatTimestamp(599), '09:59')
