import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/')
    
    // Parse store and product from path (e.g., "store-slug/product-slug")
    const pathParts = path.split('/')
    
    if (pathParts.length !== 2) {
      return new NextResponse('Invalid path', { status: 400 })
    }

    const [storeSlug, productSlug] = pathParts

    // Fetch product data (you might want to cache this)
    const productResponse = await fetch(`${req.nextUrl.origin}/api/products/og?store=${storeSlug}&product=${productSlug}`)
    
    if (!productResponse.ok) {
      return new NextResponse('Product not found', { status: 404 })
    }

    const product = await productResponse.json()

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            backgroundImage: 'linear-gradient(45deg, #f3f4f6 25%, transparent 25%), linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          }}
        >
          {/* Product Image */}
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.title}
              style={{
                width: '400px',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '16px',
                marginBottom: '32px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            />
          )}

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '800px',
              textAlign: 'center',
              padding: '0 32px',
            }}
          >
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#111827',
                margin: '0 0 16px 0',
                lineHeight: '1.2',
              }}
            >
              {product.title}
            </h1>

            {product.description && (
              <p
                style={{
                  fontSize: '24px',
                  color: '#6b7280',
                  margin: '0 0 24px 0',
                  lineHeight: '1.4',
                }}
              >
                {product.description}
              </p>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginTop: '16px',
              }}
            >
              {product.price && (
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#059669',
                    backgroundColor: '#d1fae5',
                    padding: '8px 16px',
                    borderRadius: '8px',
                  }}
                >
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
              )}

              <span
                style={{
                  fontSize: '20px',
                  color: '#6b7280',
                }}
              >
                {product.store.name}
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('OG image generation error:', error)
    return new NextResponse('Error generating image', { status: 500 })
  }
}
