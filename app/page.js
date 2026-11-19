import Hero from "./components/Hero";
import Features from "./components/Features";
import CategoriesBento from "./components/CategoriesBento";
import BrandsStrip from "./components/BrandsStrip";
import FeaturedProducts from "./components/FeaturedProducts";
import CtaBanner from "./components/CtaBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <CategoriesBento />
      <BrandsStrip />
      <FeaturedProducts />
      <CtaBanner />
    </>
  );
}
