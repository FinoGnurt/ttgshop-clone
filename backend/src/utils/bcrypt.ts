import bcrypt from 'bcrypt'

// Mã hóa mật khẩu
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10 // độ mạnh của salt (càng cao càng chậm nhưng bảo mật hơn)
  const hashed = await bcrypt.hash(password, saltRounds)
  return hashed
}

// Kiểm tra mật khẩu nhập vào có khớp với mật khẩu đã lưu không
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
