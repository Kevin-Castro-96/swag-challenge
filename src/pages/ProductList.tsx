import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import { products as allProducts } from "../data/products";
import { Product } from "../types/Product";
import "./ProductList.css";

const ProductList = () => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);

  // Estados de filtros
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]); // 👈 amplio por defecto

  // 🔍 Función que aplica todos los filtros
  const filterProducts = () => {
    let filtered = [...allProducts];

    // Categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Proveedor
    if (selectedSupplier) {
      filtered = filtered.filter((p) => p.supplier === selectedSupplier);
    }

    // Rango de precios
    filtered = filtered.filter(
      (p) => p.basePrice >= priceRange[0] && p.basePrice <= priceRange[1]
    );

    // Orden
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price":
        filtered.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "stock":
        filtered.sort((a, b) => b.stock - a.stock);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  // 📌 Recalcular cada vez que cambien filtros
  useEffect(() => {
    filterProducts();
  }, [selectedCategory, searchQuery, sortBy, selectedSupplier, priceRange]);

  // 🔄 Limpiar filtros
  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("name");
    setSelectedSupplier("");
    setPriceRange([0, 10000]); // 👈 reset
  };

  return (
    <div className="product-list-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="page-info">
            <h1 className="page-title h2">Catálogo de Productos</h1>
            <p className="page-subtitle p1">
              Descubre nuestra selección de productos promocionales premium
            </p>
          </div>

          <div className="page-stats">
            <div className="stat-item">
              <span className="stat-value p1-medium">
                {filteredProducts.length}
              </span>
              <span className="stat-label l1">productos</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ProductFilters
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          sortBy={sortBy}
          selectedSupplier={selectedSupplier}
          priceRange={priceRange}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onSupplierChange={setSelectedSupplier}
          onPriceChange={setPriceRange}
          onClearFilters={handleClearFilters}
        />

        {/* Products Grid */}
        <div className="products-section">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons">search_off</span>
              <h3 className="h2">No hay productos</h3>
              <p className="p1">
                No se encontraron productos que coincidan con tu búsqueda.
              </p>
              <button
                className="btn btn-primary cta1"
                onClick={handleClearFilters}
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
