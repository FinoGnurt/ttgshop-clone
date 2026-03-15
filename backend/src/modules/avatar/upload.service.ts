import type { FastifyRequest } from 'fastify'
import { buildFileName, getFileUrl, uploadFileToMinio } from '~/modules/avatar/storage.helper.ts'

export const uploadImageService = async (req: FastifyRequest) => {
  const { minio, statusCode, throwCustomError } = req.server

  const file = await req.file()

  if (!file) {
    throwCustomError(statusCode.BAD_REQUEST, { file: 'FILE_REQUIRED' })
  }

  if (!file!.mimetype.startsWith('image/')) {
    throwCustomError(statusCode.BAD_REQUEST, { file: 'INVALID_FILE_TYPE' })
  }

  const bucket = 'avatars'
  const buffer = await file!.toBuffer()

  const fileName = buildFileName('avatars', file!.filename)

  await uploadFileToMinio(minio, bucket, fileName, buffer, file!.mimetype)

  return {
    url: getFileUrl(bucket, fileName)
  }
}
