import { z } from 'zod'

export const createStoreSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  slug: z
    .string()
    .min(1, 'Slug é obrigatório')
    .max(50, 'Slug muito longo')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug deve conter apenas letras minúsculas, números e hífens'
    ),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  logo: z.string().optional(), // Base64 da imagem otimizada
  theme: z
    .object({
      primaryColor: z.string().optional(),
      layout: z.enum(['grid', 'list']).optional(),
      preset: z.enum(['light', 'dim']).optional(),
    })
    .optional(),
})

export const updateStoreSchema = createStoreSchema.partial()

export type CreateStoreInput = z.infer<typeof createStoreSchema>
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>
