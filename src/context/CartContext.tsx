import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "../types/Product";

type CartItem = {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
};

type CartContextType = {
  cart: CartItem[];
  isLoading: boolean; // 🔹 Nuevo estado de carga
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number, selectedColor?: string, selectedSize?: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // 🔹 Estado inicial en true

  // 🔹 Cargar carrito desde localStorage al montar
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        setCart([]);
      }
    }
    setIsLoading(false); // 🔹 Marcar como cargado
  }, []);

  // 🔹 Guardar carrito en localStorage cada vez que cambie (solo si ya se cargó)
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isLoading]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (c) =>
          c.product.id === item.product.id &&
          c.selectedColor === item.selectedColor &&
          c.selectedSize === item.selectedSize
      );

      if (existing) {
        return prev.map((c) =>
          c.product.id === item.product.id &&
          c.selectedColor === item.selectedColor &&
          c.selectedSize === item.selectedSize
            ? { ...c, quantity: Math.min(c.quantity + item.quantity, item.product.stock) }
            : c
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: number, selectedColor?: string, selectedSize?: string) => {
    setCart((prev) =>
      prev.filter(
        (c) =>
          !(
            c.product.id === productId &&
            c.selectedColor === selectedColor &&
            c.selectedSize === selectedSize
          )
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, isLoading, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCartContext debe usarse dentro de un CartProvider");
  return context;
};