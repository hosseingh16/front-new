/**
 * The local nginx in front of the API uses the default 1MB body limit.
 * Anything larger is rejected with 413 and no CORS header, which the
 * browser surfaces as a failed fetch. Stored logos are only 128px, so a
 * modest source is enough and stays under that limit.
 */
export const LOGO_UPLOAD_BUDGET_BYTES = 900 * 1024

const OUTPUT_EDGE = 512

export async function shrinkLogoForUpload(
  file: File,
  maxBytes = LOGO_UPLOAD_BUDGET_BYTES,
): Promise<File> {
  if (file.size <= maxBytes) return file
  if (!file.type.startsWith('image/') || typeof document === 'undefined') {
    throw new Error('حجم لوگو بیشتر از حد مجاز سرور است.')
  }

  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error('این تصویر قابل پردازش نیست. فایل دیگری انتخاب کنید.')
  })

  try {
    const type = (await canvasSupports('image/webp'))
      ? 'image/webp'
      : file.type === 'image/png'
        ? 'image/png'
        : 'image/jpeg'
    const ext = type === 'image/webp' ? 'webp' : type === 'image/png' ? 'png' : 'jpg'
    const base = file.name.replace(/\.[^.]+$/, '') || 'logo'

    let edge = Math.min(OUTPUT_EDGE, Math.max(bitmap.width, bitmap.height))
    let quality = 0.85

    for (let attempt = 0; attempt < 6; attempt++) {
      const blob = await render(bitmap, edge, type, quality)
      if (blob && blob.size <= maxBytes) {
        return new File([blob], `${base}.${ext}`, {
          type,
          lastModified: Date.now(),
        })
      }

      quality = Math.max(0.5, quality - 0.15)
      edge = Math.max(128, Math.round(edge * 0.75))
    }

    throw new Error('حجم لوگو بیشتر از حد مجاز سرور است.')
  } finally {
    bitmap.close()
  }
}

function render(
  bitmap: ImageBitmap,
  edge: number,
  type: string,
  quality: number,
): Promise<Blob | null> {
  const longest = Math.max(bitmap.width, bitmap.height)
  const scale = Math.min(1, edge / longest)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  const context = canvas.getContext('2d')
  if (!context) return Promise.resolve(null)
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality)
  })
}

async function canvasSupports(type: string): Promise<boolean> {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((value) => resolve(value), type)
  })
  return blob?.type === type
}
