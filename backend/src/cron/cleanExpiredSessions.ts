import cron from 'node-cron'
import type { PrismaClient } from 'prisma/client'

export function cleanExpiredSessions(prisma: PrismaClient) {
  // Lên lịch cron: chạy mỗi 1 giờ (0 phút mỗi giờ) 0 * * * *
  // Lên lịch cron: chạy mỗi phút * * * * *
  cron.schedule('0 * * * *', async () => {
    console.log('🔄 Removing expired sessions...')
    try {
      const result = await prisma.session.deleteMany({
        where: { expiresAt: { lt: new Date() } }
      })

      console.log(`✅ Successfully removed ${result.count} expired sessions.`)
    } catch (err) {
      console.error('❌ An error occurred while deleting sessions:', err)
    }
  })
}
