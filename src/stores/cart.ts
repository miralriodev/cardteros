import { atom, map } from 'nanostores';
import type { CartItem } from '../types/cards';

// Estado de visibilidad del Drawer de Carrito
export const isCartOpen = atom<boolean>(false);

// Mapa de items en el carrito sincronizado
export const cartItems = map<Record<string, CartItem>>({});

export const openCart = () => isCartOpen.set(true);
export const closeCart = () => isCartOpen.set(false);
export const toggleCart = () => isCartOpen.set(!isCartOpen.get());

export const addToCart = (item: CartItem) => {
  const current = cartItems.get();
  const existing = current[item.id];

  if (existing) {
    cartItems.setKey(item.id, {
      ...existing,
      quantity: existing.quantity + (item.quantity || 1)
    });
  } else {
    cartItems.setKey(item.id, {
      ...item,
      quantity: item.quantity || 1
    });
  }

  // Abrir carrito automáticamente al agregar
  openCart();
};

export const removeFromCart = (id: string) => {
  const current = { ...cartItems.get() };
  delete current[id];
  cartItems.set(current);
};

export const clearCart = () => {
  cartItems.set({});
};
