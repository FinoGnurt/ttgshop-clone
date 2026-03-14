import type { FastifyInstance, FastifyRequest } from 'fastify'
import { formatVNDateTime } from '~/utils/formatVNDateTime.ts'

const addMetaResponse = (app: FastifyInstance) => {
  app.addHook('onRequest', async (request: FastifyRequest) => {
    request.startTime = Date.now()
  })

  app.addHook('onSend', async (request, reply, payload) => {
    // Chỉ áp dụng cho response JSON
    const contentType = reply.getHeader('content-type')
    const parsed = JSON.parse(payload as string)

    if (typeof contentType === 'string' && contentType.includes('application/json') && !Array.isArray(parsed)) {
      try {
        const duration = Date.now() - request.startTime
        // const parsed = JSON.parse(payload as string)
        parsed.meta = {
          ...(parsed.meta || {}),
          duration,
          timestamp: formatVNDateTime,
          path: request.url
        }

        return JSON.stringify(parsed)
      } catch (err) {
        // Nếu không parse được, trả lại payload gốc
        console.log('error at durationResHook.ts', err)
        return payload
      }
    }

    return payload
  })
}

export default addMetaResponse
