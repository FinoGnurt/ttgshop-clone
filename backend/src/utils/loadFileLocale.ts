// export default function loadLocale(filename: any) {
//   return JSON.parse(
//     readFileSync(path.join(__dirname, "..", "locales", filename), "utf-8")
//   );
// }

import { readFileSync, readdirSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Tạo __filename & __dirname trong ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Đọc và merge nhiều file JSON trong thư mục locale
 * @param {string} localeDir - ví dụ: "vi" hoặc "en"
 */
export default function loadLocale(localeDir: string) {
  const dirPath = path.join(__dirname, '..', 'locales', localeDir)
  const files = readdirSync(dirPath).filter((f) => f.endsWith('.json'))

  const mergedLocale: Record<string, any> = {}

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const content = JSON.parse(readFileSync(filePath, 'utf-8'))
    Object.assign(mergedLocale, content)
  }

  return mergedLocale
}
