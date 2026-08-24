import SdnAdmin from './sdnadmin';
import { supabase } from "./supabaseClient";
import { INITIAL_CONFIG } from './siteConfig';
import { woocommerce } from "./woocommerceClient";
import { HeroSlider } from './src/components/HeroSlider';

import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
import React, { useRef, useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, ArrowRight, Instagram, Facebook, Twitter, ChevronDown, Heart, Plus, Minus, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  price: number;
  images: any[];
  brand: string;
  description: string;
  category?: string;
  warning_text?: string;
  details?: string[];
  colors?: { name: string; img?: string }[];
  sizes?: string[];
}

const getProductImage = (product: any): string => {
  if (!product) return "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000";

  if (Array.isArray(product.images) && product.images.length > 0) {
    const firstImg = product.images[0];
    if (typeof firstImg === 'string') return firstImg;
    if (firstImg && typeof firstImg === 'object' && firstImg.src) return firstImg.src;
  }

  return product.img || product.image_url || "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000";
};

const Navbar = ({ onNavigate, cartCount, wishlistCount, onOpenCart, onOpenWishlist, navLinks, products, onProductClick, categories }: { onNavigate: (v: any) => void, cartCount: number, wishlistCount: number, onOpenCart: () => void, onOpenWishlist: () => void, navLinks: any[], products: any[], onProductClick: (p: any) => void, categories: string[] }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = searchQuery ? products.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const filteredCategories = searchQuery ? categories.filter(c =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-700 ${isScrolled ? 'bg-[#f9f9f7]/70 backdrop-blur-2xl py-3 lg:py-[18px] shadow-sm' : 'bg-[#f9f9f7]/40 backdrop-blur-lg'
          }`}
      >
        <div className="flex items-center gap-3 pl-2.5 py-2.5 lg:py-[18px]">
          <button
            className="text-grey-dark hover:text-grey-dark/70 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-grey-dark hover:text-grey-dark/70 transition-colors relative z-[101]"
            aria-label="Search"
            title="Search"
          >
            <Search size={20} strokeWidth={1} />
          </button>

          <div className="hidden lg:flex space-x-8 text-[10px] tracking-[0.3em] font-medium whitespace-nowrap">
            {navLinks?.map((link: any, i: number) => (
              <button
                key={i}
                onClick={() => onNavigate(link.label)}
                className="hover:text-grey-dark/60 transition-colors uppercase cursor-pointer tracking-widest"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          className="cursor-pointer z-10 px-4 py-2.5 md:px-8 lg:px-12 md:py-3 bg-grey-dark absolute left-1/2 -translate-x-1/2 overflow-hidden"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate('home')}
        >
          <h1 className="text-[10px] md:text-lg lg:text-xl font-sans font-black tracking-[0.15em] md:tracking-[0.25em] uppercase text-white text-center whitespace-nowrap">GadgetsHub NC</h1>
        </motion.div>

        <div className="flex items-center gap-3 pr-2.5 py-2.5 lg:py-[18px]">
          <button
            onClick={onOpenWishlist}
            className="text-grey-dark hover:text-grey-dark/70 transition-colors relative z-[101]"
          >
            <Heart size={20} strokeWidth={1} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 text-[7px] bg-grey-mid text-lemon w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">{wishlistCount}</span>
            )}
          </button>
          <button
            onClick={onOpenCart}
            className="text-grey-dark hover:text-grey-dark/70 transition-colors relative z-[101]"
          >
            <ShoppingBag size={20} strokeWidth={1} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 text-[7px] bg-grey-dark text-lemon w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">{cartCount}</span>
            )}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-lemon p-8 md:p-16 flex flex-col text-grey-dark"
          >
            <div className="flex justify-between items-center mb-16">
              <h1 className="text-xl font-sans font-black tracking-widest uppercase">GadgetsHub NC</h1>
              <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="hover:rotate-90 transition-transform duration-300">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div className="max-w-4xl mx-auto w-full">
              <input
                autoFocus
                type="text"
                placeholder="SEARCH ARCHIVE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-grey-dark/20 py-6 text-4xl md:text-6xl font-display italic focus:outline-none focus:border-grey-dark transition-colors placeholder:text-grey-dark/20"
              />
              {!searchQuery && (
                <div className="mt-12 space-y-12">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-grey-dark/30 font-black mb-6 block">Trending Collections</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categories.slice(0, 4).map(cat => (
                        <button
                          key={cat}
                          onClick={() => { onNavigate(cat); setIsSearchOpen(false); }}
                          className="group flex items-center justify-between p-6 bg-grey-dark/5 hover:bg-grey-dark hover:text-white transition-all duration-500"
                        >
                          <span className="text-xl font-black uppercase tracking-widest">{cat}</span>
                          <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {searchQuery && (
                <div className="mt-12 space-y-12 overflow-y-auto max-h-[70vh] no-scrollbar">
                  {filteredCategories.length > 0 && (
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-grey-dark/30 font-black mb-6 block">Related Sections</span>
                      <div className="flex flex-wrap gap-6">
                        {filteredCategories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => {
                              onNavigate(cat);
                              setIsSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="text-2xl font-sans font-black uppercase hover:translate-x-2 transition-transform duration-300 block text-left"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredProducts.length > 0 && (
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-grey-dark/30 font-black mb-6 block">Archive Matches</span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-4">
                        {filteredProducts.map(product => (
                          <div
                            key={product.id}
                            className="cursor-pointer group"
                            onClick={() => {
                              onProductClick(product);
                              setIsSearchOpen(false);
                              setSearchQuery("");
                            }}
                          >
                            <div className="aspect-[3/4] overflow-hidden bg-[#f9f9f7] mb-4 border border-grey-dark/5">
                              <img
                                src={getProductImage(product)}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                alt={product.name}
                              />
                            </div>
                            <h4 className="text-[10px] font-black uppercase truncate tracking-widest">{product.name}</h4>
                            <p className="text-[9px] font-mono text-grey-dark/60 mt-1">₹{product.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredProducts.length === 0 && filteredCategories.length === 0 && (
                    <p className="text-[10px] uppercase tracking-widest text-grey-dark/30 py-8">No results found for "{searchQuery}"</p>
                  )}
                </div>
              )}
              <div className="mt-12 flex flex-wrap gap-4">
                <span className="text-[10px] uppercase tracking-widest text-grey-dark/30 font-medium font-mono">Archive Suggestions:</span>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      onNavigate(cat);
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="text-[10px] uppercase tracking-widest font-bold hover:text-grey-dark transition-colors text-grey-dark/50"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-lemon p-8 flex flex-col justify-between text-grey-dark"
          >
            <div>
              <div className="flex justify-between items-center mb-16">
                <h1 className="text-xl font-sans font-black tracking-widest uppercase">GadgetsHub NC</h1>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex flex-col gap-10">
                {navLinks?.map((link, idx) => (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.1 }}
                    key={link.label}
                    onClick={() => { onNavigate(link.label); setIsMobileMenuOpen(false); }}
                    className="text-3xl font-sans font-black uppercase hover:translate-x-4 transition-transform duration-500 block text-left"
                  >
                    {link.label}
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex gap-6">
                <Instagram size={20} className="text-grey-dark/50" strokeWidth={1.5} />
                <Twitter size={20} className="text-grey-dark/50" strokeWidth={1.5} />
              </div>
              <p className="text-[8px] uppercase tracking-widest text-grey-dark/30">© 2026 GadgetsHub NC</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = ({ onNavigate, title, subtitle, backgroundImage, buttonText }: { onNavigate: (v: any) => void, title: string, subtitle: string, backgroundImage?: string, buttonText: string }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[85vh] md:h-[92vh] overflow-hidden flex items-center justify-center">
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 z-0"
      >
        <img
          src={backgroundImage || "https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&q=80&w=2000"}
          alt="Hero"
          className="w-full h-full object-cover brightness-[0.7]"
        />
      </motion.div>

      <div className="relative z-10 text-center px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[9px] uppercase tracking-[0.4em] text-lemon/80 mb-3 block font-bold">{subtitle || "Winter Collection 2026"}</span>
          <h2 className="text-6xl md:text-8xl font-sans font-black uppercase leading-none tracking-tighter mb-8 text-lemon">
            {title || "Timeless Redefined."}
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('home')}
              className="px-8 py-3 bg-transparent border border-lemon text-lemon text-[10px] font-bold uppercase tracking-widest hover:bg-lemon hover:text-grey-dark transition-all duration-300 shadow-lg"
            >
              {buttonText || "Shop Collection"}
            </motion.button>
            <motion.button
              className="text-[10px] font-bold uppercase tracking-widest border-b border-lemon/30 pb-1 hover:border-lemon transition-colors flex items-center gap-2 text-lemon"
            >
              Learn More <ArrowRight size={12} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      <motion.div
        style={{ opacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <ChevronDown size={20} strokeWidth={1} className="text-lemon/50" />
      </motion.div>
    </section>
  );
};

const Quote = ({ philosophy }: { philosophy: string }) => {
  return (
    <section className="py-6 px-6 md:px-12 lg:px-24 bg-lemon text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="max-w-xl mx-auto"
      >
        <span className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-grey-dark/30 mb-2 block font-bold">Philosophy</span>
        <p className="text-base md:text-lg font-sans font-black uppercase leading-tight text-grey-dark italic">
          "{philosophy}"
        </p>
        <div className="w-6 h-px bg-grey-dark/10 mx-auto mt-3" />
      </motion.div>
    </section>
  );
};

const Banners = ({ onNavigate, banners_config }: { onNavigate: (v: any, p?: Product) => void, banners_config: any[] }) => {
  return (
    <section className="px-6 md:px-12 lg:px-24 pb-12">
      <div className="max-w-screen-xl mx-auto grid grid-cols-2 gap-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="relative h-[40vh] sm:h-[50vh] md:h-[70vh] lg:h-[90vh] overflow-hidden group cursor-pointer shadow-sm"
        >
          <img
            src={banners_config?.[0]?.img || "https://www.shutterstock.com/shutterstock/photos/1369308689/display_1500/stock-photo-young-man-holding-drone-before-flight-near-ocean-or-sea-pretty-guy-prepare-to-pilot-outdoor-1369308689.jpg"}
            alt="Trending Editorial 1"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-grey-dark/10 group-hover:bg-transparent transition-colors" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex justify-center z-10 w-full px-4 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-grey-dark text-[8px] md:text-[10px] uppercase font-bold tracking-[0.2em] shadow-xl border border-grey-dark/5 px-6 py-2.5 md:px-10 md:py-3.5 whitespace-nowrap"
            >
              Shop Now
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="relative h-[40vh] sm:h-[50vh] md:h-[70vh] lg:h-[90vh] overflow-hidden group cursor-pointer shadow-sm"
        >
          <img
            src={banners_config?.[1]?.img || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNiptiYFaZKfACBnnjXp2CSEIPE5sLoHOwldu0MsHpd6X3zvqnAqDRMemt&s=10"}
            alt="Trending Editorial 2"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-grey-dark/10 group-hover:bg-transparent transition-colors" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex justify-center z-10 w-full px-4 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-grey-dark text-[8px] md:text-[10px] uppercase font-bold tracking-[0.2em] shadow-xl border border-grey-dark/5 px-6 py-2.5 md:px-10 md:py-3.5 whitespace-nowrap"
            >
              Shop Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ProductGrid = ({ title, products, subtitle, id, onProductClick, onAddToCart }: React.PropsWithChildren<{ title: string, products: any[], subtitle: string, id: string, onProductClick: (p: any) => void, onAddToCart: (p: any) => void }>) => {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };
  return (
    <section id={id} ref={ref} className="py-4 overflow-hidden bg-lemon relative block w-full group/section scroll-mt-24 md:scroll-mt-32">
      <div className="px-6 md:px-12 lg:px-24 mb-4">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="pl-1">
            <span className="text-[8px] uppercase tracking-[0.4em] text-grey-dark/30 mb-2 block font-bold">
              {subtitle}
            </span>
            <h2 className="text-xl md:text-3xl font-sans font-black tracking-tight uppercase text-grey-dark">{title}</h2>
          </div>
          <div className="hidden md:flex gap-4 items-center">
            <div className="w-10 h-[1px] bg-grey-dark/20" />
            <span className="text-[8px] uppercase tracking-widest font-bold text-grey-dark/40">Discover more</span>
          </div>
        </div>
      </div>

      <div className="relative px-6 md:px-12 lg:px-24 w-full block">
        {/* Always visible on mobile; hover/focus only on desktop */}
        <div className="absolute top-[40%] -translate-y-1/2 left-0 z-30 opacity-100 md:opacity-0 group-hover/section:opacity-100 transition-opacity duration-500">
          <button onClick={() => scroll('left')} className="w-8 h-20 bg-grey-dark/10 backdrop-blur-sm text-grey-dark flex items-center justify-center">
            <ChevronLeft size={20} />
          </button>
        </div>
        <div className="absolute top-[40%] -translate-y-1/2 right-0 z-30 opacity-100 md:opacity-0 group-hover/section:opacity-100 transition-opacity duration-500">
          <button onClick={() => scroll('right')} className="w-8 h-20 bg-grey-dark/10 backdrop-blur-sm text-grey-dark flex items-center justify-center">
            <ChevronRight size={20} />
          </button>
        </div>

        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex flex-nowrap items-start justify-start gap-6 overflow-x-auto pb-2 no-scrollbar cursor-grab active:cursor-grabbing select-none w-full max-w-full relative"
          style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
        >
          {products.map((product, idx) => (
            <div
              key={`${product.id}-${idx}`}
              onClick={() => !isDragging && onProductClick(product)}
              className="w-[210px] min-w-[210px] shrink-0 block group/card cursor-pointer"
            >
              <div className="w-[210px] h-[280px] overflow-hidden mb-4 relative bg-[#f9f9f7] border border-grey-dark/5 flex items-center justify-center">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000";
                  }}
                />
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                  <button
                    onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                    className="bg-white/20 backdrop-blur-md text-white px-3 py-1.5 text-[9px] uppercase font-bold tracking-widest hover:bg-white/40 transition-all shadow-sm border border-white/30"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="space-y-1 pl-1 w-full block">
                <div className="flex justify-between items-start gap-2 w-full">
                  <h4 className="text-[10px] uppercase tracking-[0.15em] font-black text-grey-dark truncate max-w-[70%]">{product.name}</h4>
                  <span className="text-[10px] text-grey-dark/60 font-mono font-medium whitespace-nowrap">₹{product.price}</span>
                </div>
                <p className="text-[8px] text-grey-dark/30 uppercase tracking-widest font-medium">Fine Archive Piece</p>
              </div>
            </div>
          ))}
          <div className="min-w-[2rem] h-1" />
        </div>
      </div>
    </section>
  );
};

const Footer = ({ brand }: { brand: { name: string, description: string } }) => {
  return (
    <footer className="pt-24 pb-12 px-6 md:px-12 lg:px-24 border-t border-grey-dark/5 bg-lemon text-grey-dark">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
        <div className="md:col-span-2">
          <h2 className="text-3xl font-sans font-black tracking-widest uppercase">{brand?.name || "GadgetsHub NC"}</h2>
          <p className="text-grey-dark/50 text-sm max-w-sm mb-8 leading-relaxed font-medium">
            {brand?.description || "Reimaging the modern wardrobe through an essentialist lens. Our focus remains on shirts, tailored blazers, and silhouettes that endure."}
          </p>
          <div className="flex gap-6">
            <Instagram className="text-grey-dark/40 hover:text-grey-dark cursor-pointer transition-colors" size={20} strokeWidth={1.5} />
            <Facebook className="text-grey-dark/40 hover:text-grey-dark cursor-pointer transition-colors" size={20} strokeWidth={1.5} />
            <Twitter className="text-grey-dark/40 hover:text-grey-dark cursor-pointer transition-colors" size={20} strokeWidth={1.5} />
          </div>
        </div>

        <div>
          <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] mb-6">Collections</h4>
          <ul className="space-y-3 text-grey-dark/40 text-[10px] uppercase tracking-widest font-bold">
            <li className="hover:text-grey-dark cursor-pointer transition-colors">Essentials</li>
            <li className="hover:text-grey-dark cursor-pointer transition-colors">Denim Archive</li>
            <li className="hover:text-grey-dark cursor-pointer transition-colors">Suits & Blazers</li>
            <li className="hover:text-grey-dark cursor-pointer transition-colors">Outerwear</li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] mb-6">Help</h4>
          <ul className="space-y-3 text-grey-dark/40 text-[10px] uppercase tracking-widest font-bold">
            <li className="hover:text-grey-dark cursor-pointer transition-colors">Shipping</li>
            <li className="hover:text-grey-dark cursor-pointer transition-colors">Returns</li>
            <li className="hover:text-grey-dark cursor-pointer transition-colors">Sizing Guide</li>
            <li className="hover:text-grey-dark cursor-pointer transition-colors">Contact US</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-grey-dark/5 text-[8px] uppercase tracking-[0.3em] text-grey-dark/30 font-medium">
        <p>© 2026 GadgetsHub NC. All Rights Reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-grey-dark transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[100] hidden lg:block mix-blend-difference"
        animate={{
          x: position.x - 3,
          y: position.y - 3,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.1 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 border border-white/40 rounded-full pointer-events-none z-[100] hidden lg:block mix-blend-difference"
        animate={{
          x: position.x - 12,
          y: position.y - 12,
          scale: isPointer ? 1.5 : 1,
          borderColor: isPointer ? 'rgba(255,255,255, 0.8)' : 'rgba(255,255,255, 0.4)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 150, mass: 0.5 }}
      />
    </>
  );
};

const Preloader = ({ onComplete }: { onComplete: () => void, key?: string }) => {
  const sparkles = [
    [18, 24, 2, 0.2], [23, 29, 1, 1.1], [28, 22, 1, 1.8], [31, 35, 2, 0.7],
    [20, 39, 1, 1.5], [27, 42, 2, 0.4], [34, 29, 1, 2.2],
    [69, 66, 2, 1.2], [74, 71, 1, 0.9], [80, 65, 2, 0.3], [84, 74, 1, 1.4],
    [72, 79, 1, 2.1], [78, 82, 2, 0.6], [87, 68, 1, 1.6],
    [43, 80, 1, 2.4], [49, 84, 2, 0.8], [55, 78, 1, 1.7], [58, 87, 1, 0.5]
  ];

  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1] }}
      className="preloader fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
    >
      <div className="preloader-liquid" aria-hidden="true" />
      <div className="preloader-sparkles" aria-hidden="true">
        {sparkles.map(([left, top, size, delay], index) => (
          <span
            key={index}
            className="preloader-sparkle"
            style={{ left: `${left}%`, top: `${top}%`, width: `${size}px`, height: `${size}px`, animationDelay: `${delay}s` }}
          />
        ))}
      </div>
      <div className="relative inline-block">
        <div className="preloader-galaxy" aria-hidden="true" />
        <motion.h1
          className="relative z-[1] text-xl md:text-3xl font-sans text-white tracking-[0.3em] px-8 py-4 font-black uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          GadgetsHub NC
        </motion.h1>
        <motion.div
          className="preloader-underline"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 1.6, ease: "easeOut" }}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
};

const ProductPage = ({
  product: selectedProduct,
  onBack,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  products,
  setSelectedProduct
}: any) => {

  // Safety first: handle missing product object gracefully
  if (!selectedProduct) return null;

  const [activeImage, setActiveImage] = useState(getProductImage(selectedProduct));
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [loadedVariations, setLoadedVariations] = useState<any[]>([]);

  useEffect(() => {
    setActiveImage(getProductImage(selectedProduct));
    setSelectedColor(null);
    setSelectedSize(null);

    const isVariable = selectedProduct?.type === 'variable';
    if (isVariable && selectedProduct.id) {
      woocommerce.get(`products/${selectedProduct.id}/variations?per_page=100`)
        .then((raw: any) => {
          let vars: any[] = [];
          if (Array.isArray(raw)) vars = raw;
          else if (Array.isArray(raw?.data)) vars = raw.data;
          else if (Array.isArray(raw?.value)) vars = raw.value;
          setLoadedVariations(vars);
        })
        .catch(() => {
          setLoadedVariations([]);
        });
    }
  }, [selectedProduct.id]);

  const handleProductClick = (p: any) => {
    setSelectedProduct(p);
    window.scrollTo(0, 0);
  };

  const isInWishlist = wishlist.some((w: any) => w.product.id === selectedProduct.id);
  const imageTracks = Array.isArray(selectedProduct.images) ? selectedProduct.images : [];

  const getOptions = (slug: string) => {
    if (!selectedProduct?.attributes) return [];

    // Look for exact match, pa_ prefixed, or partial match (color/colour)
    const attr = selectedProduct.attributes.find((a: any) => {
      const name = a.name?.toLowerCase() || '';
      const target = slug.toLowerCase();
      return name === target ||
        name === `pa_${target}` ||
        name.startsWith(target) ||
        target.startsWith(name);
    });
    return attr?.options || [];
  };

  const normalizeToken = (v: any): string => String(v ?? '').toLowerCase().trim();

  const allColors = getOptions('colour').length > 0 ? getOptions('colour') : getOptions('color');
  const allSizes = getOptions('size').length > 0 ? getOptions('size') : ['S', 'M', 'L', 'XL', 'XXL'];

  const getColorHex = (colorName: string): string => {
    const clean = colorName.toLowerCase().trim();
    const map: Record<string, string> = {
      'white': '#ffffff', 'red': '#ef4444', 'blue': '#3b82f6',
      'green': '#22c55e', 'yellow': '#eab308', 'black': '#1b1b1b',
      'navy': '#1e3a5f', 'grey': '#9ca3af', 'gray': '#9ca3af',
      'brown': '#92400e', 'beige': '#d4c5a9', 'pink': '#ec4899',
      'orange': '#f97316', 'purple': '#8b5cf6', 'maroon': '#7f1d1d',
      'olive': '#65a30d', 'teal': '#14b8a6', 'cream': '#fef3c7',
      'tan': '#d2b48c', 'ivory': '#fffff0', 'burgundy': '#800020',
      'charcoal': '#36454f', 'mustard': '#e1ad01', 'rust': '#b7410e',
    };
    return map[clean] || '#cbd5e1';
  };

  const getVarAttr = (v: any, attrName: string): string => {
    if (!v) return '';
    if (Array.isArray(v.attributes)) {
      const found = v.attributes.find((a: any) => {
        const n = (a?.name || '').toLowerCase();
        return n === attrName || n.startsWith(attrName) || attrName.startsWith(n);
      });
      return (found?.option || '').toLowerCase().trim();
    }
    return '';
  };

  const getVarImage = (v: any): string => {
    const img = v?.image;
    if (typeof img === 'string') return img;
    if (img?.src) return img.src;
    if (v?.image_url) return v.image_url;
    return '';
  };

  const inStockVariations = loadedVariations.filter((v: any) => v?.stock_status !== 'outofstock');

  const colorsWithVariations = new Set(inStockVariations.map((v: any) => getVarAttr(v, 'colour') || getVarAttr(v, 'color')).filter(Boolean));

  const rawColors = colorsWithVariations.size > 0
    ? allColors.filter(c => colorsWithVariations.has(c.toLowerCase().trim()))
    : allColors;

  const sizesForSelectedColor = new Set(
    inStockVariations
      .filter((v: any) => {
        const vc = getVarAttr(v, 'colour') || getVarAttr(v, 'color');
        return selectedColor ? vc === selectedColor.toLowerCase().trim() : true;
      })
      .map((v: any) => getVarAttr(v, 'size'))
      .filter(Boolean)
  );

  const rawSizes = allSizes;

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    const ct = colorName.toLowerCase().trim();

    const match = inStockVariations.find((v: any) => {
      const vc = getVarAttr(v, 'colour') || getVarAttr(v, 'color');
      return vc === ct;
    });

    if (match) {
      const img = getVarImage(match);
      if (img) setActiveImage(img);
      const firstSize = getVarAttr(match, 'size');
      if (firstSize) setSelectedSize(firstSize.toUpperCase());
    } else {
      setActiveImage(getProductImage(selectedProduct));
    }
  };

  const isSizeAvailable = (size: string) => {
    if (!selectedColor) return sizesForSelectedColor.size === 0 || sizesForSelectedColor.has(size.toLowerCase().trim());
    return sizesForSelectedColor.has(size.toLowerCase().trim());
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-16 px-4 md:px-12 lg:px-24 bg-[#f9f9f7] min-h-screen">
      <div className="sticky top-[52px] z-[60] mb-6 px-4 md:px-12 lg:px-24 py-3 bg-white/30 backdrop-blur-xl border-b border-grey-dark/5">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-grey-dark/40 hover:text-grey-dark">
          <ArrowLeft size={14} /> Back to Archive
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto items-start">
        {/* Image Container */}
        <div className="w-full md:w-1/2">
          <div className="w-full flex items-center justify-center border border-grey-dark/5 bg-[#f5f5f5] overflow-hidden">
            <img
              src={activeImage || getProductImage(selectedProduct)}
              alt={selectedProduct.name}
              className="w-full h-auto max-h-[calc(60vh+10px)] md:max-h-[75vh] object-contain transition-all duration-500 ease-out"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000";
              }}
            />
          </div>

          {imageTracks.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar">
              {imageTracks.map((imgObj: any, index: number) => {
                const imgUrl = typeof imgObj === 'string' ? imgObj : imgObj?.src;
                if (!imgUrl) return null;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-16 h-20 bg-[#f4f4f2] p-1 border flex-shrink-0 transition-all ${activeImage === imgUrl ? 'border-grey-dark scale-95' : 'border-grey-dark/10 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT PROPERTY DESCRIPTION STACKS */}
        <div className="space-y-8 pr-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase mb-2 text-grey-dark">{selectedProduct.name}</h1>
            <p className="text-lg font-mono text-grey-dark/80 font-medium">₹{selectedProduct.price}</p>
          </div>

          {selectedProduct.warning_text && (
            <div className="bg-grey-dark text-lemon p-4 text-[9px] font-mono font-black tracking-widest leading-relaxed flex items-center gap-2">
              <span>⚡ {selectedProduct.warning_text}</span>
            </div>
          )}

          {/* COLORWAY SELECTION BUTTON HOOK PANEL */}
          {rawColors.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-grey-dark/40">Select Colorway</span>
                {selectedColor && <span className="text-[9px] uppercase tracking-widest font-black text-grey-dark">{selectedColor}</span>}
              </div>

              {/* Dynamic + responsive swatch layout (handles variable attribute counts across products) */}
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 sm:gap-3">
                {rawColors.map((colorName: string, idx: number) => {
                  const hex = getColorHex(colorName);
                  const isSelected = selectedColor === colorName;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleColorSelect(colorName)}
                      title={colorName}
                      style={{ backgroundColor: hex }}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-none border transition-all duration-300 relative group transform ${isSelected
                        ? 'border-grey-dark scale-110 shadow-md ring-1 ring-grey-dark/20'
                        : 'border-grey-dark/20 hover:border-grey-dark/60 hover:scale-105'
                        }`}
                    >
                      {isSelected && (
                        <span className="absolute inset-0.5 border border-white pointer-events-none mix-blend-difference" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SIZES MATRIX GRID */}
          {rawSizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] uppercase tracking-[0.3em] font-black text-grey-dark/40">Select Fit Matrix</span>
                {selectedSize && <span className="text-[10px] font-mono font-bold text-grey-dark">{selectedSize}</span>}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                {rawSizes.map((size: string) => {
                  const isSelected = normalizeToken(selectedSize) === normalizeToken(size);
                  const available = isSizeAvailable(size);
                  return (
                    <button
                      key={size}
                      disabled={!available}
                      onClick={() => {
                        if (!available) return;
                        setSelectedSize(size);
                        if (selectedColor) {
                          const ct = selectedColor.toLowerCase().trim();
                          const st = size.toLowerCase().trim();
                          const match = inStockVariations.find((v: any) => {
                            const vc = getVarAttr(v, 'colour') || getVarAttr(v, 'color');
                            const vs = getVarAttr(v, 'size');
                            return vc === ct && vs === st;
                          });
                          if (match) {
                            const img = getVarImage(match);
                            if (img) setActiveImage(img);
                          }
                        }
                      }}
                      className={`w-11 h-11 sm:w-12 sm:h-12 text-[10px] font-mono border font-black transition-all ${isSelected
                        ? 'bg-grey-dark text-lemon border-grey-dark shadow-sm'
                        : available
                          ? 'bg-white text-grey-dark border-grey-dark/10 hover:border-grey-dark'
                          : 'bg-white text-grey-dark/20 border-grey-dark/5 cursor-not-allowed opacity-30 line-through pointer-events-none'
                        }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PRODUCT BRIEF */}
          <div className="border-t border-b border-grey-dark/5 py-6">
            <span className="text-[9px] uppercase tracking-[0.3em] font-black text-grey-dark/40 block mb-3">Product Brief</span>
            <div
              className="text-[11px] uppercase tracking-[0.2em] text-grey-dark/70 font-medium leading-relaxed font-sans"
              dangerouslySetInnerHTML={{ __html: selectedProduct.short_description || selectedProduct.description || 'Fine Archival curated apparel artifact item.' }}
            />
          </div>

          {/* SUBMIT SHEET ACTUATORS */}
          <div className="flex flex-col gap-4 pt-4">
            <button
              disabled={rawColors.length > 0 && (!selectedColor || !selectedSize)}
              onClick={() => onAddToCart(selectedProduct, selectedColor, selectedSize, activeImage)}
              className={`w-full py-5 text-[10px] uppercase font-black tracking-widest transition-all duration-300 ${rawColors.length === 0 || (selectedColor && selectedSize)
                ? 'bg-grey-dark text-lemon shadow-xl hover:bg-black cursor-pointer'
                : 'bg-grey-dark/10 text-grey-dark/30 cursor-not-allowed'
                }`}
            >
              {rawColors.length === 0 ? 'Buy Now' : selectedColor && selectedSize ? `Buy Now` : 'Select Color & Size Matrix'}
            </button>
            <button
              onClick={() => onToggleWishlist(selectedProduct, selectedColor, selectedSize)}
              className="w-full py-4 border border-grey-dark/20 text-[10px] uppercase font-black tracking-widest flex items-center justify-center gap-2 hover:bg-grey-dark/5 transition-colors"
            >
              <Heart size={14} fill={isInWishlist ? "black" : "none"} />
              {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-24 border-t border-grey-dark/5 pt-16">
        <ProductGrid
          id="similar-arrivals"
          title="SIMILAR ARRIVALS"
          subtitle="THE ARCHIVE"
          products={products.filter(p => p.id !== selectedProduct.id)}
          onProductClick={handleProductClick}
          onAddToCart={onAddToCart}
        />
      </div>
    </motion.div>
  );
};

const CartDrawer = ({ isOpen, onClose, items, onRemove, onUpdateQty }: {
  isOpen: boolean,
  onClose: () => void,
  items: { product: Product, qty: number, variant?: { color: string | null, size: string | null, image: string | null } }[],
  onRemove: (id: string, color: string | null, size: string | null) => void,
  onUpdateQty: (id: string, color: string | null, size: string | null, d: number) => void
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-grey-dark/30 z-[200] backdrop-blur-sm" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-lemon z-[210] p-8 md:p-12 pt-28 md:pt-32 flex flex-col border-l border-grey-dark/10 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-sans font-black uppercase tracking-widest text-grey-dark">Cart</h2>
              <button onClick={onClose} className="p-2 hover:bg-grey-dark/5 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-8">
              {items.length === 0 ? <p className="text-[10px] uppercase tracking-widest text-grey-dark/30 text-center mt-20">Your archive is empty.</p> : items.map((item, idx) => (
                <div key={`${item.product.id}-${item.variant?.color}-${item.variant?.size}-${idx}`} className="flex gap-4">
                  <div className="w-20 h-24 bg-grey-light overflow-hidden">
                    <img src={item.variant?.image || getProductImage(item.product)} className="w-full h-full object-cover" alt={item.product.name} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] uppercase font-black">{item.product.name}</p>
                    {item.variant?.color && <p className="text-[8px] uppercase text-grey-dark/40">{item.variant.color} / {item.variant.size}</p>}
                    <div className="flex items-center gap-4 text-[10px] font-mono">
                      <button onClick={() => onUpdateQty(item.product.id, item.variant?.color || null, item.variant?.size || null, -1)}><Minus size={12} /></button>
                      <span>{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.product.id, item.variant?.color || null, item.variant?.size || null, 1)}><Plus size={12} /></button>
                    </div>
                    <button onClick={() => onRemove(item.product.id, item.variant?.color || null, item.variant?.size || null)} className="text-[8px] uppercase tracking-tighter text-grey-dark/40 underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            {items.length > 0 && <button className="w-full py-5 bg-grey-dark text-lemon text-[10px] uppercase font-black tracking-widest mt-8">Checkout</button>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const WishlistDrawer = ({ isOpen, onClose, items, onRemove, onAddToCart }: { isOpen: boolean, onClose: () => void, items: { product: Product, color?: string | null, size?: string | null }[], onRemove: (id: string, color?: string | null, size?: string | null) => void, onAddToCart: (p: Product, color?: string | null, size?: string | null) => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-grey-dark/30 z-[200] backdrop-blur-sm" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-lemon z-[210] p-8 md:p-12 pt-28 md:pt-32 flex flex-col border-l border-grey-dark/10 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-sans font-black uppercase tracking-widest text-grey-dark">Wishlist</h2>
              <button onClick={onClose} className="p-2 hover:bg-grey-dark/5 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-8">
              {items.length === 0 ? <p className="text-[10px] uppercase tracking-widest text-grey-dark/30 text-center mt-20">No favorites selected yet.</p> : items.map((item, idx) => (
                <div key={`${item.product.id}-${item.color}-${item.size}-${idx}`} className="flex gap-4">
                  <div className="w-20 h-24 bg-grey-light overflow-hidden">
                    <img src={getProductImage(item.product)} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] uppercase font-black">{item.product.name}</p>
                    {(item.color || item.size) && <p className="text-[8px] uppercase text-grey-dark/40">{item.color || '—'} / {item.size || '—'}</p>}
                    <button onClick={() => onAddToCart(item.product, item.color || null, item.size || null)} className="text-[8px] uppercase font-black text-grey-dark/40 block">Add to Cart</button>
                    <button onClick={() => onRemove(item.product.id, item.color || null, item.size || null)} className="text-[8px] uppercase tracking-tighter text-grey-dark/40 underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState(window.location.pathname === "/sdnadmin");
  if (isAdmin) return <SdnAdmin onClose={() => { window.history.pushState({}, "", "/"); setIsAdmin(false); }} />;

  const [siteData, setSiteData] = useState({
    hero: { title: 'GadgetsHub NC', subtitle: 'COLLECTION 2026', image_url: '' },
    quote: { text: '' },
    banners: [],
    sections: [],
    navigation_links: [],
    brand: INITIAL_CONFIG.brand
  });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'home' | 'product'>('home');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [homeCategoryFocus, setHomeCategoryFocus] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<{ product: Product, qty: number, variant?: { color: string | null, size: string | null, image: string | null } }[]>([]);
  const [wishlist, setWishlist] = useState<{ product: Product, color?: string | null, size?: string | null }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await woocommerce.get(`products?per_page=100&_cb=${Date.now()}`);

        let parsedProducts: any[] = [];
        if (Array.isArray(response)) {
          parsedProducts = response;
        } else if (response && Array.isArray(response.data)) {
          parsedProducts = response.data;
        } else if (response && typeof response === 'object') {
          parsedProducts = Object.values(response).filter(item => typeof item === 'object' && item !== null);
        }

        if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
          parsedProducts = [
            {
              id: "rugged-log",
              name: "RUGGED",
              price: 1005,
              brand: "JACK HARRISTON",
              images: [
                { src: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000" },
                { src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000" }
              ],
              description: "Premium architectural lifestyle accent wood.",
              categories: [{ name: "GENZ AZEZ", slug: "genz-azez" }]
            },
            {
              id: "signature-hoodie",
              name: "GadgetsHub NC DRONE PRO",
              price: 2500,
              brand: "GadgetsHub NC",
              images: [
                { src: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000" }
              ],
              description: "Refined silhouette hoodie for the modern archive.",
              categories: [{ name: "ESSENTIAL ARCHIVE", slug: "essential-archive" }]
            }
          ];
        }

        setProducts(parsedProducts);

        const uniqueCats = new Set<string>();

        const normalizeCategoryName = (cat: any): string | null => {
          if (!cat) return null;

          // Common Woo shapes:
          // - { name, slug }
          // - { id, name }
          // - strings
          // - taxonomy objects
          const name = typeof cat === 'string' ? cat : cat?.name;
          const slug = typeof cat === 'string' ? null : cat?.slug;

          const n = typeof name === 'string' ? name.trim() : '';
          const s = typeof slug === 'string' ? slug.trim().toLowerCase() : '';

          if (!n) return null;
          if (s === 'uncategorized' || n.toLowerCase() === 'uncategorized') return null;
          return n;
        };

        // Some plugins may attach categories as:
        // - product.categories (array)
        // - product.category (object)
        // - product.taxonomies / product.attributes (non-standard)
        const tryAddFromList = (list: any) => {
          if (!Array.isArray(list)) return;
          for (const cat of list) {
            const norm = normalizeCategoryName(cat);
            if (norm) uniqueCats.add(norm);
          }
        };

        parsedProducts.forEach((product: any) => {
          // Preferred: product.categories
          if (product?.categories) {
            tryAddFromList(product.categories);
          }

          // Fallback: sometimes category may be a single object or nested
          if (!product?.categories && product?.category) {
            const norm = normalizeCategoryName(product.category);
            if (norm) uniqueCats.add(norm);
          }
        });

        const DEFAULTS = ["ESSENTIAL ARCHIVE", "GENZ AZEZ"];
        const allCats = Array.from(uniqueCats);

        // Deterministic order: sort by lowercase name.
        allCats.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

        // Up to 10 categories for homepage.
        const finalCats = allCats.length > 0 ? allCats.slice(0, 10) : DEFAULTS;

        // Debug: verify what Woo payload returns + what we extract.
        // Keep as lightweight as possible.
        try {
          console.log('[categories] extractedAllCount=', allCats.length, 'final=', finalCats);
          if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
            const sample = parsedProducts[0];
            console.log('[categories] sampleProduct.categories=', sample?.categories);
            console.log('[categories] sampleProduct.category=', sample?.category);
          }
        } catch (e) {
          // ignore
        }

        setCategories(finalCats);
      } catch (error) {
        console.error("WooCommerce payload normalization failure:", error);
        setCategories(["ESSENTIAL ARCHIVE", "GENZ AZEZ"]);
      }
    };
    fetchInventory();
  }, []);

  const handleAddToCart = (product: Product, color: string | null = null, size: string | null = null, image: string | null = null) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(i =>
        i.product.id === product.id &&
        i.variant?.color === color &&
        i.variant?.size === size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], qty: updated[existingIndex].qty + 1 };
        return updated;
      }

      return [...prev, {
        product,
        qty: 1,
        variant: { color, size, image: image || getProductImage(product) }
      }];
    });
    setIsCartOpen(true);
  };

  const handleToggleWishlist = (product: Product, color?: string | null, size?: string | null) => {
    setWishlist(prev => {
      const existing = prev.find(w => w.product.id === product.id && w.color === (color || null) && w.size === (size || null));
      if (existing) return prev.filter(w => !(w.product.id === product.id && w.color === (color || null) && w.size === (size || null)));
      return [...prev, { product, color: color || null, size: size || null }];
    });
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setView('product');
    window.scrollTo(0, 0);
  };

  return (
    <div className="font-sans bg-lemon min-h-screen text-grey-dark">
      <AnimatePresence mode="wait">
        {loading && (
          <Preloader key="loader" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      <div className={`relative transition-opacity duration-1500 ${loading ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>
        {!loading && (
          <>
            <CustomCursor />
            <Navbar
              onNavigate={(v: any) => {
                if (categories.includes(v)) {
                  setHomeCategoryFocus(v);
                  setView('home');
                  setTimeout(() => {
                    const element = document.getElementById(v.toLowerCase().replace(/\s+/g, '-'));
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                } else {
                  setView(v);
                  if (v === 'home') {
                    setHomeCategoryFocus(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }
                setSelectedProduct(null);
              }}
              cartCount={cartItems.reduce((acc, item) => acc + item.qty, 0)}
              wishlistCount={wishlist.length}
              onOpenCart={() => setIsCartOpen(true)}
              onOpenWishlist={() => setIsWishlistOpen(true)}
              navLinks={categories.map(c => ({ label: c, url: '#' }))}
              products={products}
              onProductClick={handleProductClick}
              categories={categories}
            />
            <main>
              {view === 'home' ? (
                <>
                  <HeroSlider />
                  <div id="hero-quote">
                    <Quote philosophy={siteData.quote?.text || INITIAL_CONFIG.brand.philosophy} />
                  </div>

                  <div className="bg-lemon">
                    <Banners
                      onNavigate={(v, p) => { if (p) { setSelectedProduct(p); setView('product'); } else setView(v); }}
                      banners_config={siteData.banners}
                    />
                  </div>

                  {(() => {
                    const displayCategories = [...categories];
                    if (homeCategoryFocus) {
                      const focusIdx = displayCategories.indexOf(homeCategoryFocus);
                      if (focusIdx > -1) {
                        const [focused] = displayCategories.splice(focusIdx, 1);
                        displayCategories.unshift(focused);
                      }
                    }

                    return displayCategories.map((categoryName) => {
                      const safeProductCollection = Array.isArray(products) ? products : [];
                      const filteredProducts = safeProductCollection.filter(p => {
                        if (!p) return false;
                        const matchesCat = Array.isArray(p.categories) && p.categories.some((c: any) =>
                          c.name?.toLowerCase() === categoryName.toLowerCase() ||
                          c.slug?.toLowerCase() === categoryName.toLowerCase().replace(/\s+/g, '-')
                        );
                        if (categoryName === "GENZ AZEZ" && (p.id === "rugged-log" || p.id === "signature-hoodie")) return true;
                        return matchesCat;
                      });

                      if (filteredProducts.length === 0) return null;

                      return (
                        <ProductGrid
                          key={categoryName}
                          id={categoryName.toLowerCase().replace(/\s+/g, '-')}
                          title={categoryName}
                          subtitle="ARCHIVE SPECIFICATION"
                          products={filteredProducts}
                          onProductClick={handleProductClick}
                          onAddToCart={handleAddToCart}
                        />
                      );
                    });
                  })()}
                </>
              ) : selectedProduct ? (
                <ProductPage
                  key={selectedProduct?.id}
                  product={selectedProduct}
                  onBack={() => { setView('home'); setSelectedProduct(null); }}
                  onAddToCart={(p: Product, c: string | null, s: string | null, img: string | null) =>
                    handleAddToCart(p, c, s, img)
                  }
                  onToggleWishlist={handleToggleWishlist}
                  wishlist={wishlist}
                  products={products}
                  setSelectedProduct={setSelectedProduct}
                />
              ) : null}
            </main>
            <Footer brand={siteData.brand} />
            <CartDrawer
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              items={cartItems}
              onRemove={(id, color, size) => setCartItems(prev => prev.filter(i => !(i.product.id === id && i.variant?.color === color && i.variant?.size === size)))}
              onUpdateQty={(id, color, size, delta) => setCartItems(prev => prev.map(i =>
                (i.product.id === id && i.variant?.color === color && i.variant?.size === size)
                  ? { ...i, qty: Math.max(1, i.qty + delta) }
                  : i
              ))}
            />
            <WishlistDrawer
              isOpen={isWishlistOpen}
              onClose={() => setIsWishlistOpen(false)}
              items={wishlist}
              onRemove={(id, color, size) => setWishlist(prev => prev.filter(w => !(w.product.id === id && w.color === (color || null) && w.size === (size || null))))}
              onAddToCart={(p, color, size) => handleAddToCart(p, color || null, size || null)}
            />
          </>
        )}
      </div>
    </div>
  );
}