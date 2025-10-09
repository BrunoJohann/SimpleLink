import { z } from 'zod'

export const createProductSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  slug: z
    .string()
    .min(1, 'Slug é obrigatório')
    .max(100, 'Slug muito longo')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  description: z.string().max(2000, 'Descrição muito longa').optional(),
  imageUrl: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
  price: z
    .string()
    .regex(/^\d+([.,]\d{1,2})?$/, 'Preço deve ser um número válido')
    .transform((val) => val.replace(',', '.'))
    .optional()
    .or(z.literal('')),
  published: z.boolean().default(true),
})

export const updateProductSchema = createProductSchema.partial()

export const affiliateLinkSchema = z.object({
  marketplace: z.string().min(1, 'Marketplace é obrigatório'),
  url: z.string().url('URL inválida'),
  note: z.string().max(200, 'Nota muito longa').optional(),
})

export const updateAffiliateLinksSchema = z.object({
  links: z.array(affiliateLinkSchema),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type AffiliateLinkInput = z.infer<typeof affiliateLinkSchema>
export type UpdateAffiliateLinksInput = z.infer<typeof updateAffiliateLinksSchema>
