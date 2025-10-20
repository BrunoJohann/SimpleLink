import { getTranslations } from 'next-intl/server'

export async function getStoreTranslations(language: string) {
  try {
    const t = await getTranslations({ locale: language, namespace: 'store' })
    return {
      'store.title': t('store.title'),
      'store.description': t('store.description'),
      'store.noProducts': t('store.noProducts'),
      'store.loading': t('store.loading'),
      'store.search.placeholder': t('store.search.placeholder'),
      'store.search.results': t('store.search.results'),
      'store.product.price': t('store.product.price'),
      'store.product.description': t('store.product.description'),
      'store.product.buyNow': t('store.product.buyNow'),
      'store.product.viewDetails': t('store.product.viewDetails'),
      'store.categories.all': t('store.categories.all'),
      'store.categories.noCategory': t('store.categories.noCategory'),
    }
  } catch (error) {
    // Fallback para inglês se o idioma não estiver disponível
    const t = await getTranslations({ locale: 'en', namespace: 'store' })
    return {
      'store.title': t('store.title'),
      'store.description': t('store.description'),
      'store.noProducts': t('store.noProducts'),
      'store.loading': t('store.loading'),
      'store.search.placeholder': t('store.search.placeholder'),
      'store.search.results': t('store.search.results'),
      'store.product.price': t('store.product.price'),
      'store.product.description': t('store.product.description'),
      'store.product.buyNow': t('store.product.buyNow'),
      'store.product.viewDetails': t('store.product.viewDetails'),
      'store.categories.all': t('store.categories.all'),
      'store.categories.noCategory': t('store.categories.noCategory'),
    }
  }
}
