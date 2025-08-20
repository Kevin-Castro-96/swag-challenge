import { categories, suppliers } from "../data/products";
import "./ProductFilters.css";

interface ProductFiltersProps {
  selectedCategory: string;
  searchQuery: string;
  sortBy: string;
  selectedSupplier: string;
  priceRange: [number, number];
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: string) => void;
  onSupplierChange: (supplier: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

const ProductFilters = ({
  selectedCategory,
  searchQuery,
  sortBy,
  selectedSupplier,
  priceRange,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onSupplierChange,
  onPriceChange,
  onClearFilters,
}: ProductFiltersProps) => {
  return (
    <div className="product-filters">
      <div className="filters-card">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-box">
            <span className="material-icons">search</span>
            <input
              type="text"
              placeholder="Buscar productos, SKU..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input p1"
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => onSearchChange("")}
              >
                <span className="material-icons">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Categorías</h3>
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => onCategoryChange(category.id)}
              >
                <span className="material-icons">{category.icon}</span>
                <span className="category-name l1">{category.name}</span>
                <span className="category-count l1">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Ordenar por</h3>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select p1"
          >
            <option value="name">Nombre A-Z</option>
            <option value="price">Precio</option>
            <option value="stock">Stock disponible</option>
          </select>
        </div>

        {/* Supplier Filters */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Proveedores</h3>
          <div className="supplier-list">
            {suppliers.map((supplier) => (
              <button
                key={supplier.id}
                className={`supplier-item ${
                  selectedSupplier === supplier.id ? "active" : ""
                }`}
                onClick={() => onSupplierChange(supplier.id)}
              >
                <span className="supplier-name l1">{supplier.name}</span>
                <span className="supplier-count l1">({supplier.products})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="filter-section">
          <h3 className="filter-title p1-medium">Rango de precios</h3>
          <div className="price-range">
            <input
              type="number"
              min="0"
              value={priceRange[0]}
              onChange={(e) => onPriceChange([+e.target.value, priceRange[1]])}
              className="price-input"
              placeholder="Mín"
            />
            <span>-</span>
            <input
              type="number"
              min="0"
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], +e.target.value])}
              className="price-input"
              placeholder="Máx"
            />
          </div>
        </div>

        {/* Clear Filters */}
        <div className="filter-section">
          <button className="clear-filters-btn" onClick={onClearFilters}>
            <span className="material-icons">apps</span>
            Limpiar todos los filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
