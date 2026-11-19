"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const CartContext = createContext(null);
const EMPTY = { items: [], count: 0, total: 0, cartId: null };

function normalize(res) {
  const d = res.data;
  const data = d.data;
  return {
    items: data?.products ?? [],
    count: d.numOfCartItems ?? 0,
    total: data?.totalCartPrice ?? 0,
    cartId: d.cartId ?? data?._id ?? null,
  };
}

async function fetchCart() {
  try {
    return normalize(await api.get("/cart"));
  } catch (err) {
    if (err.response?.status === 404) return EMPTY;
    throw err;
  }
}

export function CartProvider({ children }) {
  const { token } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [state, setState] = useState(EMPTY);
  const [busyId, setBusyId] = useState(null);

  const cart = token ? state : EMPTY;

  useEffect(() => {
    if (!token) return;
    let off = false;
    fetchCart()
      .then((c) => !off && setState(c))
      .catch(() => !off && setState(EMPTY));
    return () => {
      off = true;
    };
  }, [token]);

  async function mutate(id, request, okMsg, failMsg) {
    setBusyId(id);
    try {
      await request();
      setState(await fetchCart());
      if (okMsg) toast(okMsg, "success");
    } catch (err) {
      toast(err.response?.data?.message || failMsg, "error");
    } finally {
      setBusyId(null);
    }
  }

  function addToCart(productId) {
    if (!token) {
      toast("Please sign in to add items", "info");
      router.push("/login");
      return;
    }
    return mutate(
      productId,
      () => api.post("/cart", { productId }),
      "Added to your cart",
      "Could not add to cart",
    );
  }

  function updateQuantity(productId, count) {
    if (count < 1) return removeItem(productId);
    return mutate(
      productId,
      () => api.put(`/cart/${productId}`, { count }),
      null,
      "Could not update quantity",
    );
  }

  function removeItem(productId) {
    return mutate(
      productId,
      () => api.delete(`/cart/${productId}`),
      "Removed from cart",
      "Could not remove item",
    );
  }

  async function clearCart() {
    try {
      await api.delete("/cart");
      setState(EMPTY);
      toast("Cart cleared", "success");
    } catch (err) {
      toast(err.response?.data?.message || "Could not clear cart", "error");
    }
  }

  return (
    <CartContext.Provider
      value={{
        ...cart,
        busyId,
        refresh: fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
