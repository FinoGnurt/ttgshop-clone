import type { FastifyReply, FastifyRequest } from 'fastify'
import { uploadImageService } from '~/modules/avatar/upload.service.ts'

export const uploadImageController = async (req: FastifyRequest, rep: FastifyReply) => {
  const { statusCode, statusText } = req.server

  const result = await uploadImageService(req)

  return rep.sendSuccess(statusCode.OK, statusText[statusCode.OK], result, {
    type: 'single'
  })
}
