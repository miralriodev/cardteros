import { atom, map } from 'nanostores';
import type { CartItem } from '../types/cards';

// Umbral oficial de envío gratis asegurado
export const FREE_SHIPPING_THRESHOLD_MXN = 3500;

// Estado de visibilidad del Drawer de Carrito
export const isCartOpen = atom<boolean>(false);

// Mapa de items en el carrito sincronizado
export const cartItems = map<Record<string, CartItem>>({});

// Cupón de descuento aplicado
export const appliedCoupon = atom<{ code: string; discountPercent: number; amountMxn?: number } | null>(null);

// Modalidad de manejo de producto: 'ship_sealed' (Envío sellado) o 'rip_on_stream' (Apertura en vivo)
export const fulfillmentMode = atom<'ship_sealed' | 'rip_on_stream'>('ship_sealed');

export const openCart = () => isCartOpen.set(true);
export const closeCart = () => isCartOpen.set(false);
export const toggleCart = () => isCartOpen.set(!isCartOpen.get());

// Cargar estado inicial desde localStorage en cliente
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('cardteros_cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed === 'object' && parsed !== null) {
        cartItems.set(parsed);
      }
    }
  } catch {
    // Si localStorage está restringido o corrupto, ignora silenciosamente
  }

  // Guardar en localStorage ante cualquier cambio
  cartItems.subscribe((items) => {
    try {
      localStorage.setItem('cardteros_cart', JSON.stringify(items));
    } catch {
      // Ignora en caso de storage quota
    }
  });
}

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

export const updateQuantity = (id: string, quantity: number) => {
  if (quantity <= 0) {
    removeFromCart(id);
    return;
  }
  const current = cartItems.get();
  const existing = current[id];
  if (existing) {
    cartItems.setKey(id, {
      ...existing,
      quantity
    });
  }
};

export const incrementQuantity = (id: string) => {
  const current = cartItems.get();
  const existing = current[id];
  if (existing) {
    cartItems.setKey(id, {
      ...existing,
      quantity: existing.quantity + 1
    });
  }
};

export const decrementQuantity = (id: string) => {
  const current = cartItems.get();
  const existing = current[id];
  if (existing) {
    if (existing.quantity > 1) {
      cartItems.setKey(id, {
        ...existing,
        quantity: existing.quantity - 1
      });
    } else {
      removeFromCart(id);
    }
  }
};

export const removeFromCart = (id: string) => {
  const current = { ...cartItems.get() };
  delete current[id];
  cartItems.set(current);
};

export const clearCart = () => {
  cartItems.set({});
  appliedCoupon.set(null);
};
