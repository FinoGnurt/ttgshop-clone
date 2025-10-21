import chalk from 'chalk'
import { buildApp } from '~/app.ts'

const app = buildApp()
const port = Number(process.env.PORT)

const success = chalk.bold.green
const info = chalk.cyan
const error = chalk.bold.red
const label = chalk.gray

// start server
;(async () => {
  try {
    console.log(info('ℹ️  Initializing application...'))

    await app.ready() // Đợi tất cả plugin được đăng ký
    console.log(success('✅ Ready: All plugins registered.'))

    await app.prisma.$connect()
    console.log(success('✅ Database connected successfully!'))

    const address = await app.listen({ port, host: '0.0.0.0' })
    console.log(info(`🚀 Server is running at `) + chalk.bold.blue(address))
  } catch (err) {
    console.log(error('⚠️  Server failed to start!'))
    console.error(label('Details:'), err)
    process.exit(0)
  }
})()
