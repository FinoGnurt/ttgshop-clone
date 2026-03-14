/**
 * @description Chuyển đổi ngày giờ sang định dạng việt nam (ngày giờ hiện tại)
 * @returns string
 * @example formatVNDateTime() // 01:17:12 24/11/2025
 */

export function formatVNDateTime(): string {
  return new Date().toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  })
}
