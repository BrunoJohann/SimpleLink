/**
 * Utilitários para processamento de imagens
 */

/**
 * Redimensiona e otimiza uma imagem para logo
 * @param file - Arquivo de imagem
 * @param maxSize - Tamanho máximo em pixels (padrão: 200x200)
 * @param quality - Qualidade da compressão (0-1, padrão: 0.8)
 * @returns Promise com base64 da imagem otimizada
 */
export async function optimizeLogoImage(
  file: File,
  maxSize: number = 200,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = e => {
      const img = new Image()

      img.onload = () => {
        // Criar canvas para redimensionar
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Não foi possível criar contexto do canvas'))
          return
        }

        // Calcular dimensões mantendo aspect ratio
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
        }

        // Redimensionar
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)

        // Converter para base64 com compressão
        const base64 = canvas.toDataURL('image/jpeg', quality)

        // Verificar tamanho (limite de 100KB para base64)
        const sizeInKB = Math.round((base64.length * 3) / 4 / 1024)

        if (sizeInKB > 100) {
          // Se ainda estiver grande, comprimir mais
          const newQuality = quality * 0.7
          if (newQuality > 0.3) {
            optimizeLogoImage(file, maxSize, newQuality)
              .then(resolve)
              .catch(reject)
            return
          }
        }

        resolve(base64)
      }

      img.onerror = () => {
        reject(new Error('Erro ao carregar imagem'))
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Valida se o arquivo é uma imagem válida
 */
export function validateImageFile(file: File): {
  valid: boolean
  error?: string
} {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSizeInMB = 5

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato inválido. Use JPG, PNG ou WebP.',
    }
  }

  if (file.size > maxSizeInMB * 1024 * 1024) {
    return {
      valid: false,
      error: `Arquivo muito grande. Máximo ${maxSizeInMB}MB.`,
    }
  }

  return { valid: true }
}
