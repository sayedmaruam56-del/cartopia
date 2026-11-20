"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const WishlistContext = createContext(null);

async function fetchWishlist() {
  const res = await api.get("/wishlist");
  return res.data.data ?? [];
}

export function WishlistProvider({ children }) {
  const { token } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [state, setState] = useState([]);
  const [busyId, setBusyId] = useState(null);

  const items = token ? state : [];

  useEffect(() => {
    if (!token) return;
    let off = false;
    fetchWishlist()
      .then((list) => !off && setState(list))
      .catch(() => !off && setState([]));
    return () => {
      off = true;
    };
  }, [token]);

  const has = (id) => items.some((p) => p._id === id);

  async function toggle(productId) {
    if (!token) {
      toast("Please sign in to save items", "info");
      router.push("/login");
      return;
    }
    const liked = has(productId);
    setBusyId(productId);
    try {
      if (liked) await api.delete(`/wishlist/${productId}`);
      else await api.post("/wishlist", { productId });
      setState(await fetchWishlist());
      toast(liked ? "Removed from saved" : "Saved to your wishlist", "success");
    } catch (err) {
      toast(err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <WishlistContext.Provider value={{ items, busyId, has, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
