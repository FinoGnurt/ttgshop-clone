/**
 *
 * @param timeStr - string
 * @returns number
 * @description Chuyển đổi chuỗi thời gian thành mili giây
 * @example
 * parseTimeToMs('2d3h4m5s') // 183845000
 * parseTimeToMs('1h30m') // 5400000
 * parseTimeToMs('1d') // 86400000
 */

export default function parseTimeToMs(timeStr: string): number {
  if (/^\d+$/.test(timeStr)) return Number(timeStr) // test: trả về true nếu chuỗi timeStr chỉ có số, false nếu có ký tự khác.

  const regex = /(\d+)([dhms])/g
  let match: RegExpExecArray | null
  let totalMs = 0

  while ((match = regex.exec(timeStr))) {
    const value = Number(match[1])
    switch (match[2]) {
      case 'd':
        totalMs += value * 86400000
        break
      case 'h':
        totalMs += value * 3600000
        break
      case 'm':
        totalMs += value * 60000
        break
      case 's':
        totalMs += value * 1000
        break
    }
  }

  return totalMs
}
