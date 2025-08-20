import { useCartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCartContext();

  if (cart.length === 0) {
    return (
      <div className="container">
        <h2>Tu carrito está vacío 🛒</h2>
        <Link to="/" className="btn btn-primary">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="containerCart cart-page">
      <h2>Tu carrito</h2>

      <ul className="cart-list">
        {cart.map((item, index) => (
          <li key={index} className="cart-item">
            <h3>{item.product.name}</h3>
            <p>Cantidad: {item.quantity}</p>
            {item.selectedColor && <p>Color: {item.selectedColor}</p>}
            {item.selectedSize && <p>Talla: {item.selectedSize}</p>}
            <button
              className="btn btn-danger"
              onClick={() =>
                removeFromCart(item.product.id, item.selectedColor, item.selectedSize)
              }
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-actions">
        <button className="btn btn-secondary" onClick={clearCart}>
          Vaciar carrito
        </button>
        <button className="btn btn-primary">Finalizar compra</button>
      </div>
    </div>
  );
};

export default CartPage;
