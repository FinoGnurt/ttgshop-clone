import { type FastifyInstance } from 'fastify'
import { uploadImageController } from '~/modules/avatar/upload.controller.ts'

export async function userRoutes(app: FastifyInstance) {
  app.post('/upload/avatar', uploadImageController)
}
