import { useNavigate, Link } from 'react-router-dom'
import { Product } from '../types/Product'
import { formatPriceCLP } from '../utils/formatPrice'
import './ProductCard.css'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="status-badge status-active l1">Disponible</span>
      case 'inactive': return <span className="status-badge status-inactive l1">No disponible</span>
      case 'pending': return <span className="status-badge status-pending l1">Pendiente</span>
      default: return null
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return <span className="stock-status out-of-stock l1">Sin stock</span>
    if (stock < 10) return <span className="stock-status low-stock l1">Stock bajo ({stock})</span>
    return <span className="stock-status in-stock l1">{stock} disponibles</span>
  }

  const getDiscountPrice = () => {
    if (product.priceBreaks && product.priceBreaks.length > 1) {
      const bestDiscount = product.priceBreaks[product.priceBreaks.length - 1]
      return bestDiscount.price
    }
    return null
  }

  const handleQuotation = () => {
    navigate("/cotizacion", {
      state: {
        product,
        quantity: 1,
        selectedColor: product.colors?.[0] || "",
        selectedSize: product.sizes?.[0] || "",
      },
    });
  }

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image">
          <div className="image-placeholder">
            <span className="material-icons">image</span>
          </div>
          <div className="product-status">{getStatusBadge(product.status)}</div>
        </div>

        <div className="product-info">
          <div className="product-header">
            <h3 className="product-name p1-medium">{product.name}</h3>
            <p className="product-sku l1">{product.sku}</p>
          </div>

          <div className="product-details">
            <div className="product-category">
              <span className="material-icons">category</span>
              <span className="l1">{product.category}</span>
            </div>
            {getStockStatus(product.stock)}
          </div>

          {product.features && (
            <div className="product-features">
              {product.features.map((feature, idx) => (
                <span key={idx} className="feature-tag l1">{feature}</span>
              ))}
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="product-colors">
              <span className="colors-label l1">{product.colors.length} colores:</span>
              <div className="colors-preview">
                {product.colors.slice(0, 3).map((color, idx) => (
                  <div key={idx} className="color-dot" title={color}></div>
                ))}
                {product.colors.length > 3 && (
                  <span className="more-colors l1">+{product.colors.length - 3}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="product-footer">
        <div className="price-section">
          <div className="current-price p1-medium">{formatPriceCLP(product.basePrice)}</div>
          {getDiscountPrice() && (
            <div className="discount-info">
              <span className="discount-price l1">{formatPriceCLP(getDiscountPrice()!)}</span>
              <span className="discount-label l1">desde 50 unidades</span>
            </div>
          )}
        </div>

        <div className="card-actions">
          <button 
            className="btn btn-secondary l1"
            onClick={handleQuotation}
          >
            <span className="material-icons">calculate</span>
            Cotizar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
