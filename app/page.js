"use client";
import { useEffect } from "react";
import api from "./lib/api";

export default function Home() {
  useEffect(() => {
    api.get("/products").then((res) => console.log(res.data));
  }, []);

  return <h1 className="text-3xl font-bold p-6">Home</h1>;
}