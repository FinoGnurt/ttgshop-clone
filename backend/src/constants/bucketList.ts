/**
 * Bucket names must follow MinIO/S3 rules:
 * + Only contain lowercase letters, numbers, hyphens (-) or periods (.)
 * + No uppercase letters
 * + Length 3–63 characters
 * @description This is bucket list for minio storage service
 */

export const BucketList = {
  avatars: 'avatars',
  productImages: 'product-images'
} as const
