
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Products from "@/components/home/Products";
import Benefits from "@/components/home/Benefits";
import CTA from "@/components/home/CTA";
import Footer from "@/components/home/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <Features />
      <Products />
      <Benefits />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
