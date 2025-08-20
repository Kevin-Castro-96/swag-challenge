import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { products } from "../data/products";
import { Product } from "../types/Product";

import PricingCalculator from "../components/PricingCalculator";
import "./ProductDetail.css";
import { useCartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useCartContext();
  const navigate = useNavigate();

  const AgregarProducto = () => {
    if (!product) return; // seguridad extra
    console.log("agregado al carrito");
    toast.success("Producto añadido al carrito");

    addToCart({
      product,
      quantity,
      selectedColor,
      selectedSize,
    });
  };

  const handleQuotation = () => {
    if (!product) return;

    // Navegar a la página de cotización pasando los datos del producto
    navigate("/cotizacion", {
      state: {
        product,
        selectedColor,
        selectedSize,
        quantity,
      },
    });
  };

  useEffect(() => {
    if (id) {
      const foundProduct = products.find((p) => p.id === parseInt(id));
      setProduct(foundProduct || null);

      // Set default selections
      if (foundProduct?.colors && foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0]);
      }
      if (foundProduct?.sizes && foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[0]);
      }
    }
  }, [id]);

  // Handle loading state
  if (!product) {
    return (
      <div className="container">
        <div className="product-not-found">
          <span className="material-icons">error_outline</span>
          <h2 className="h2">Producto no encontrado</h2>
          <p className="p1">
            El producto que buscas no existe o ha sido eliminado.
          </p>
          <Link to="/" className="btn btn-primary cta1">
            <span className="material-icons">arrow_back</span>
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  // Validate product status
  const canAddToCart = product.status === "active" && product.stock > 0;

  return (
    <motion.div
      className="product-detail-page"
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.9 }} 
      transition={{ duration: 0.6, ease: "easeOut" }} 
    >
      <div className="product-detail-page">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link l1">
              Catálogo
            </Link>
            <span className="breadcrumb-separator l1">/</span>
            <span className="breadcrumb-current l1">{product.name}</span>
          </nav>

          <div className="product-detail">
            {/* Product Images */}
            <div className="product-images">
              <div className="main-image">
                <div className="image-placeholder">
                  <span className="material-icons">image</span>
                </div>
              </div>

              {/* Bug: thumbnails don't work */}
              <div className="image-thumbnails">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="thumbnail">
                    <span className="material-icons">image</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="product-details">
              <div className="product-header">
                <h1 className="product-title h2">{product.name}</h1>
                <p className="product-sku p1">SKU: {product.sku}</p>

                {/* Status */}
                <div className="product-status">
                  {product.status === "active" ? (
                    <span className="status-badge status-active l1">
                      ✓ Disponible
                    </span>
                  ) : product.status === "pending" ? (
                    <span className="status-badge status-pending l1">
                      ⏳ Pendiente
                    </span>
                  ) : (
                    <span className="status-badge status-inactive l1">
                      ❌ No disponible
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="product-description">
                  <h3 className="p1-medium">Descripción</h3>
                  <p className="p1">{product.description}</p>
                </div>
              )}

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="product-features">
                  <h3 className="p1-medium">Características</h3>
                  <ul className="features-list">
                    {product.features.map((feature, index) => (
                      <li key={index} className="feature-item l1">
                        <span className="material-icons">check_circle</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="selection-group">
                  <h3 className="selection-title p1-medium">
                    Color disponibles
                  </h3>
                  <div className="color-options">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        className={`color-option ${
                          selectedColor === color ? "selected" : ""
                        }`}
                        onClick={() => setSelectedColor(color)}
                      >
                        <div className="color-preview"></div>
                        <span className="l1">{color}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="selection-group">
                  <h3 className="selection-title p1-medium">
                    Tallas disponibles
                  </h3>
                  <div className="size-options">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-option ${
                          selectedSize === size ? "selected" : ""
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        <span className="l1">{size}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="product-actions">
                <div className="quantity-selector">
                  <label className="quantity-label l1">Cantidad:</label>
                  <div className="quantity-controls">
                    {/* Botón - */}
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="quantity-btn"
                      disabled={quantity <= 1} // opcional: deshabilitar si ya está en 1
                    >
                      <span className="material-icons">remove</span>
                    </button>

                    {/* Input */}
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setQuantity(
                          Math.min(Math.max(1, value), product.stock)
                        ); 
                      }}
                      className="quantity-input"
                      min="1"
                      max={product.stock}
                    />

                    {/* Botón + */}
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="quantity-btn"
                      disabled={quantity >= product.stock}
                    >
                      <span className="material-icons">add</span>
                    </button>
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    className={`btn btn-primary cta1 ${
                      !canAddToCart ? "disabled" : ""
                    }`}
                    disabled={!canAddToCart}
                    onClick={AgregarProducto}
                  >
                    <span className="material-icons">shopping_cart</span>
                    {canAddToCart ? "Agregar al carrito" : "No disponible"}
                  </button>

                  <button
                    className="btn btn-secondary cta1"
                    onClick={handleQuotation}
                  >
                    <span className="material-icons">calculate</span>
                    Solicitar cotización
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Calculator */}
          <div className="pricing-section">
            <PricingCalculator product={product} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
