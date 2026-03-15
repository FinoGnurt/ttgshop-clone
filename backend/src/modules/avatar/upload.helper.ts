export const buildFileName = (filename: string) => {
  const timestamp = Date.now()
  return `avatars/${timestamp}-${filename}`
}

export const buildFileUrl = (bucket: string, fileName: string) => {
  return `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucket}/${fileName}`
}
