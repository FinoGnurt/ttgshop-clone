import { randomUUID } from 'crypto'

export const buildFileName = (folder: string, originalName: string) => {
  const ext = originalName.split('.').pop()
  return `${folder}/${randomUUID()}.${ext}`
}

export const uploadFileToMinio = async (
  minio: any,
  bucket: string,
  fileName: string,
  buffer: Buffer,
  mimeType: string
) => {
  await minio.putObject(bucket, fileName, buffer, buffer.length, {
    'Content-Type': mimeType
  })
}

export const getFileUrl = (bucket: string, fileName: string) => {
  return `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucket}/${fileName}`
}

export const deleteFile = async (minio: any, bucket: string, fileName: string) => {
  await minio.removeObject(bucket, fileName)
}
