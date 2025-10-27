import crypto from 'crypto'

/**
 * Tạo mật khẩu ngẫu nhiên an toàn
 * @param {number} length - độ dài mật khẩu mong muốn
 * @param {object} options - tùy chọn ký tự
 * @param {boolean} options.uppercase - có chữ hoa không
 * @param {boolean} options.lowercase - có chữ thường không
 * @param {boolean} options.numbers - có số không
 * @param {boolean} options.symbols - có ký tự đặc biệt không
 * @returns {string} mật khẩu
 */

interface PasswordOptions {
  uppercase?: boolean
  lowercase?: boolean
  numbers?: boolean
  symbols?: boolean
}

export function generateSecurePassword(
  length = 16,
  options: PasswordOptions = { uppercase: true, lowercase: true, numbers: true, symbols: false }
) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?'

  // Thiết lập tập ký tự dựa trên options
  let chars = ''
  if (options.uppercase !== false) chars += upper
  if (options.lowercase !== false) chars += lower
  if (options.numbers !== false) chars += numbers
  if (options.symbols === true) chars += symbols

  if (!chars) throw new Error('Phải chọn ít nhất một loại ký tự.')

  const charsLength = chars.length
  let password = ''

  while (password.length < length) {
    // Tạo byte ngẫu nhiên
    const byte = crypto.randomBytes(1).readUInt8(0)
    // Chỉ lấy byte < 256 mà chia hết cho độ dài chars để tránh bias
    if (byte < 256 - (256 % charsLength)) {
      password += chars[byte % charsLength]
    }
  }

  return password
}
