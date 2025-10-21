import type { FastifyInstance } from 'fastify'
import cron from 'node-cron'

export const cleanExpiredSessions = (app: FastifyInstance) => {
  // Lên lịch cron: chạy mỗi 1 giờ (0 phút mỗi giờ) 0 * * * *
  cron.schedule('* * * * *', async () => {
    console.log('🔄 Đang xóa các session hết hạn...')
    try {
      const result = await app.prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } })

      console.log(`✅ Đã xóa ${result.count} session hết hạn.`)
    } catch (err) {
      console.error('❌ Lỗi khi xóa session:', err)
    }
  })
}
