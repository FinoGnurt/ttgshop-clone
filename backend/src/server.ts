import chalk from 'chalk'
import { buildApp } from '~/app.ts'
import { initBuckets } from '~/config/minio.init.ts'
import { cleanExpiredSessions } from '~/cron/cleanExpiredSessions.ts'

const success = chalk.bold.green
const info = chalk.cyan
const error = chalk.bold.red
const label = chalk.gray
const highlight = chalk.bold.blue

// Start server
;(async () => {
  const app = await buildApp()

  try {
    console.log(info('ℹ️  Initializing application...'))

    await app.ready()
    console.log(success('✅ Ready: All plugins registered.'))

    console.log(info('ℹ️  Starting database connection...'))
    await app.prisma.$connect()
    await app.prisma.$queryRaw`SELECT 1`
    console.log(success('✅ Database connected successfully!'))

    console.log(info('ℹ️ Connecting and initializing MinIO...'))
    await initBuckets(app)
    console.log(success('✅ MinIO connected and buckets ready!'))

    // cron
    cleanExpiredSessions(app.prisma)

    console.log(info('ℹ️  Starting server...'))

    const env = process.env.NODE_ENV?.toUpperCase() || 'UNKNOWN'
    console.log(info(`🌐 Environment: ${highlight(env)}`))

    const address = await app.listen({ port: app.env.PORT, host: '0.0.0.0' })
    console.log(info(`🚀 Server is running at `) + highlight(address))

    // console.log('check Fastify Env >>>> ', app.getEnvs())
  } catch (err) {
    console.log(error('⚠️  Server failed to start!'))
    console.error(label('Details:'), (err as Error)?.message || err)
    process.exit(0)
  }
})()
