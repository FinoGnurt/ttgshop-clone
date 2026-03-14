import type { FastifyInstance } from 'fastify'
import { BucketList } from '~/constants/bucketList.ts'

//const buckets = ['avatars', 'images']

export async function initBuckets(fastify: { minio: FastifyInstance['minio'] }) {
  const minio = fastify.minio

  for (const bucket of Object.values(BucketList)) {
    const exists = await minio.bucketExists(bucket)
    if (!exists) await minio.makeBucket(bucket)

    // Gán policy public-read
    await minio.setBucketPolicy(
      bucket,
      JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${bucket}/*`]
          }
        ]
      })
    )
  }
}
