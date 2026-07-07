const { Worker } = require('bullmq')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')
const { prisma } = require('../config/db')
const { redisConnection, QUEUE_NAMES } = require('../queue')
const logger = require('../utils/logger')
const { env } = require('../config/env')

const UPLOAD_ROOT = path.resolve(env.uploadBasePath)

const IMAGE_SIZES = {
  thumb: { width: 400, height: 225 },
  medium: { width: 800, height: 450 },
  large: { width: 1600, height: 900 }
}

async function processImage (mediaId, filePath) {
  const absoluteInput = path.join(UPLOAD_ROOT, filePath)

  if (!fs.existsSync(absoluteInput)) {
    throw new Error(`Source file not found: ${absoluteInput}`)
  }

  const ext = path.extname(filePath)
  const base = path.basename(filePath, ext)
  const dir = path.dirname(filePath)

  // Generate WebP
  const webpPath = path.join(dir, `${base}.webp`)
  await sharp(absoluteInput)
    .webp({ quality: 82 })
    .toFile(path.join(UPLOAD_ROOT, webpPath))

  // Generate AVIF
  const avifPath = path.join(dir, `${base}.avif`)
  await sharp(absoluteInput)
    .avif({ quality: 70 })
    .toFile(path.join(UPLOAD_ROOT, avifPath))

  // Generate thumbnails
  const thumbPath = path.join(dir, `${base}_thumb.webp`)
  await sharp(absoluteInput)
    .resize(IMAGE_SIZES.thumb.width, IMAGE_SIZES.thumb.height, { fit: 'cover' })
    .webp({ quality: 75 })
    .toFile(path.join(UPLOAD_ROOT, thumbPath))

  const mediumPath = path.join(dir, `${base}_medium.webp`)
  await sharp(absoluteInput)
    .resize(IMAGE_SIZES.medium.width, IMAGE_SIZES.medium.height, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(path.join(UPLOAD_ROOT, mediumPath))

  const largePath = path.join(dir, `${base}_large.webp`)
  await sharp(absoluteInput)
    .resize(IMAGE_SIZES.large.width, IMAGE_SIZES.large.height, { fit: 'cover', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(path.join(UPLOAD_ROOT, largePath))

  // Get dimensions of original
  const meta = await sharp(absoluteInput).metadata()

  // Update database record
  await prisma.media.update({
    where: { id: mediaId },
    data: {
      path_webp: webpPath,
      path_avif: avifPath,
      path_thumb: thumbPath,
      path_medium: mediumPath,
      path_large: largePath,
      width: meta.width,
      height: meta.height,
      processing_status: 'done'
    }
  })

  logger.info('Image processed', { mediaId, webpPath, avifPath })
}

const imageWorker = new Worker(
  QUEUE_NAMES.IMAGE_PROCESSING,
  async (job) => {
    const { mediaId, filePath } = job.data
    logger.info(`[image-worker] Processing job ${job.id}`, { mediaId })
    await processImage(mediaId, filePath)
  },
  {
    connection: redisConnection,
    concurrency: 3
  }
)

imageWorker.on('failed', (job, err) => {
  logger.error('[image-worker] Job failed', { jobId: job.id, error: err.message })
  // Mark media record as errored
  if (job.data.mediaId) {
    prisma.media.update({
      where: { id: job.data.mediaId },
      data: { processing_status: 'error' }
    }).catch(() => {})
  }
})

imageWorker.on('completed', (job) => {
  logger.info(`[image-worker] Job completed ${job.id}`)
})

module.exports = { imageWorker }
