export const toTimeString = (seconds: number, significantDigits = 2): string => {
  const neg = seconds < 0
  seconds = Math.abs(seconds)
  if (seconds < 120) {
    return `${seconds.toFixed(significantDigits)} seconds${neg ? ' ago' : ''}`
  }
  if (seconds / 60 < 120) {
    return `${(seconds / 60).toFixed(significantDigits)} minutes${neg ? ' ago' : ''}`
  }
  if (seconds / 60 / 60 < 48) {
    return `${(seconds / 60 / 60).toFixed(significantDigits)} hours${neg ? ' ago' : ''}`
  }
  return `${(seconds / 60 / 60 / 24).toFixed(significantDigits)} days${neg ? ' ago' : ''}`
}

export const periods: [period: string, amount: number][] = [
  ['second', 1],
  ['minute', 60],
  ['hour', 60 * 60],
  ['day', 86400],
  ['week', 86400 * 7],
  ['month', 86400 * 30],
  ['year', 86400 * 365],
]
