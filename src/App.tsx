import SdnAdmin from './sdnadmin';
import { supabase } from "./supabaseClient";
import { INITIAL_CONFIG as siteData } from './siteConfig';
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
import React, { useRef, useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, ArrowRight, Instagram, Facebook, Twitter, ChevronDown, Heart, Plus, Minus, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: string;
  img: string;
  description: string;
  category: string;
  details?: string[];
}

const ALL_PRODUCTS: Product[] = [
  { id: '1', category: 'trending', name: "KISHORE KUMAR", price: "$145", img: "https://yxhdjxlakcsntswwxpwr.supabase.co/storage/v1/object/public/product-images/kishore.jpg", description: "A luxurious oversized shirt crafted from 100% pure silk, offering a fluid silhouette and exceptional comfort.", details: ['100% Silk', 'Oversized fit', 'Archive item'] },
  { id: '2', category: 'trending', name: "Linen Tailored Skirt", price: "$120", img: "https://images.unsplash.com/photo-1583496661160-fb4144f21f82?auto=format&fit=crop&q=80&w=1000", description: "Structured linen skirt with a minimalist profile and refined tailoring." },
  { id: '3', category: 'trending', name: "Double Breasted Blazer", price: "$320", img: "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&q=80&w=1000", description: "Sophisticated double-breasted blazer with sharp tailoring and structured shoulders." },
  { id: '4', category: 'trending', name: "Boxy Graphic T-Shirt", price: "$65", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000", description: "Heavyweight cotton t-shirt with a contemporary boxy fit." },
  { id: '5', category: 'trending', name: "Satin Midi Skirt", price: "$180", img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=1000", description: "Fluid satin skirt that catches the light with every movement." },
  { id: '6', category: 'trending', name: "Structural Wool Blazer", price: "$490", img: "https://images.unsplash.com/photo-1539533377285-3422400bc797?auto=format&fit=crop&q=80&w=1000", description: "Architectural blazer featuring clean lines and a premium wool weave." },
  { id: '7', category: 'new', name: "Poplin Cotton Shirt", price: "$85", img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1000", description: "Breathable poplin cotton shirt, an essential piece for any modern wardrobe." },
  { id: '8', category: 'new', name: "Premium Knit T-Shirt", price: "$90", img: "https://images.unsplash.com/photo-1576566582415-8422400bc797?auto=format&fit=crop&q=80&w=1000", description: "Ultra-soft knit t-shirt with a refined texture and drape." },
  { id: '9', category: 'new', name: "Linen Summer Blazer", price: "$240", img: "https://images.unsplash.com/photo-1593032465175-481ac7f402a1?auto=format&fit=crop&q=80&w=1000", description: "Lightweight linen blazer, ideal for summer layering and smart-casual events." },
  { id: '10', category: 'new', name: "Abstract Print Shirt", price: "$130", img: "https://images.unsplash.com/photo-1598961942613-ba8bd741e976?auto=format&fit=crop&q=80&w=1000", description: "Modern shirt featuring a unique abstract print and relaxed collar." },
  { id: '11', category: 'new', name: "Pleated Midi Skirt", price: "$210", img: "https://images.unsplash.com/photo-1583496661160-fb4144f21f82?auto=format&fit=crop&q=80&w=1000", description: "Timeless pleated skirt with a high-definition structure." },
  { id: '12', category: 'new', name: "Leather Midi Skirt", price: "$340", img: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&q=80&w=1000", description: "Luxurious leather midi skirt with a clean waist and refined finish." }
];

const Navbar = ({ onNavigate, cartCount, wishlistCount, onOpenCart, onOpenWishlist }: { onNavigate: (v: any) => void, cartCount: number, wishlistCount: number, onOpenCart: () => void, onOpenWishlist: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 transition-all duration-700 ${isScrolled ? 'bg-lemon/90 backdrop-blur-xl py-4 border-b border-grey-dark/5 shadow-sm' : 'bg-transparent'
          }`}
      >
        <div className="flex items-center gap-12">
          <button
            className="lg:hidden text-grey-dark hover:text-grey-dark/70 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
          <div className="hidden lg:flex items-center gap-10 whitespace-nowrap">
            {['Shop All', 'T-Shirts', 'Denim', 'Archive'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[11px] uppercase tracking-[0.25em] font-medium text-grey-dark/40 hover:text-grey-dark transition-all hover:tracking-[0.3em]"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <motion.div
          className="absolute left-1/2 -translate-x-1/2 cursor-pointer z-10 px-4 py-2 md:px-12 md:py-2.5 bg-grey-dark"
          style={{ width: 'clamp(140px, 40%, 300px)' }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onNavigate('home')}
        >
          <h1 className="text-[10px] md:text-xl lg:text-2xl font-sans font-black tracking-[0.4em] md:tracking-[0.8em] uppercase text-white -mr-[0.4em] md:-mr-[0.8em] text-center truncate">AURHOUSE</h1>
        </motion.div>

        <div className="flex items-center gap-8">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-grey-dark/40 hover:text-grey-dark transition-colors"
          >
            <Search size={20} strokeWidth={1} />
          </button>
          <button
            onClick={onOpenWishlist}
            className="text-grey-dark/40 hover:text-grey-dark transition-colors relative"
          >
            <Heart size={20} strokeWidth={1} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 text-[7px] bg-grey-mid text-lemon w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">{wishlistCount}</span>
            )}
          </button>
          <button
            onClick={onOpenCart}
            className="text-grey-dark/40 hover:text-grey-dark transition-colors relative"
          >
            <ShoppingBag size={20} strokeWidth={1} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 text-[7px] bg-grey-dark text-lemon w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">{cartCount}</span>
            )}
          </button>
        </div>
      </motion.nav>

      {/* Cart Drawer is now global in App */}

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-lemon p-8 md:p-16 flex flex-col text-grey-dark"
          >
            <div className="flex justify-between items-center mb-16">
              <h1 className="text-xl font-sans font-black tracking-widest uppercase">AURHOUSE</h1>
              <button onClick={() => setIsSearchOpen(false)} className="hover:rotate-90 transition-transform duration-300">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div className="max-w-4xl mx-auto w-full">
              <input
                autoFocus
                type="text"
                placeholder="SEARCH ARCHIVE..."
                className="w-full bg-transparent border-b border-grey-dark/20 py-6 text-4xl md:text-6xl font-display italic focus:outline-none focus:border-grey-dark transition-colors placeholder:text-grey-dark/20"
              />
              <div className="mt-12 flex flex-wrap gap-4">
                <span className="text-[10px] uppercase tracking-widest text-grey-dark/30 font-medium font-mono">Trending:</span>
                {['Tees', 'Selvage', 'Outerwear'].map(tag => (
                  <button key={tag} className="text-[10px] uppercase tracking-widest font-bold hover:text-grey-dark transition-colors text-grey-dark/50">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
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
                <h1 className="text-xl font-sans font-black tracking-widest uppercase">AURHOUSE</h1>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex flex-col gap-10">
                {['Shop All', 'Shirts', 'Pants', 'Blazers', 'Gowns'].map((item, idx) => (
                  <motion.a
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.1 }}
                    key={item}
                    href="#"
                    className="text-3xl font-sans font-black uppercase hover:translate-x-4 transition-transform duration-500 block"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex gap-6">
                <Instagram size={20} className="text-grey-dark/50" strokeWidth={1.5} />
                <Twitter size={20} className="text-grey-dark/50" strokeWidth={1.5} />
              </div>
              <p className="text-[8px] uppercase tracking-widest text-grey-dark/30">© 2026 Aurhouse Archive</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = ({ onNavigate }: { onNavigate: (v: any) => void }) => {
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
          src="https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&q=80&w=2000"
          alt="Hero"
          className="w-full h-full object-cover brightness-[0.7]"
          onLoad={() => console.log('Hero image loaded')}
          onError={(e) => {
            console.error('Hero image failed to load, trying fallback');
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611312449408-fcece17cdbb7?auto=format&fit=crop&q=80&w=2000";
          }}
        />
      </motion.div>

      <div className="relative z-10 text-center px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[9px] uppercase tracking-[0.4em] text-lemon/80 mb-3 block font-bold">Winter Collection 2026</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-sans font-black uppercase leading-none tracking-tighter mb-8 text-lemon">
            Timeless <br /> Redefined.
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('home')}
              className="px-8 py-3 bg-transparent border border-lemon text-lemon text-[10px] font-bold uppercase tracking-widest hover:bg-lemon hover:text-grey-dark transition-all duration-300 shadow-lg"
            >
              Shop Collection
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

const Quote = () => {
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
          "Purity of form is the highest expression of craft."
        </p>
        <div className="w-6 h-px bg-grey-dark/10 mx-auto mt-3" />
      </motion.div>
    </section>
  );
};

const Banners = ({ onNavigate }: { onNavigate: (v: any, p?: Product) => void }) => {
  return (
    <section className="px-6 md:px-12 lg:px-24 pb-12">
      <div className="max-w-screen-xl mx-auto grid grid-cols-2 gap-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="relative h-[70vh] md:h-[90vh] overflow-hidden group cursor-pointer shadow-sm"
          onClick={() => onNavigate('product', ALL_PRODUCTS[0])}
        >
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200"
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
          className="relative h-[70vh] md:h-[90vh] overflow-hidden group cursor-pointer shadow-sm"
          onClick={() => onNavigate('product', ALL_PRODUCTS[2])}
        >
          <img
            src="https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&q=80&w=1200"
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

const ProductGrid = ({ title, products, subtitle, id, onProductClick, onAddToCart }: { title: string, products: Product[], subtitle: string, id: string, onProductClick: (p: Product) => void, onAddToCart: (p: Product) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
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

  const { scrollXProgress } = useScroll({
    container: scrollRef,
  });
  const stripOpacity = useTransform(scrollXProgress, [0, 0.1, 0.9, 1], [0.8, 0.4, 0.4, 0.8]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section id={id} ref={ref} className="py-12 overflow-hidden bg-lemon relative group/section">
      <div className="px-6 md:px-12 lg:px-24 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 1 }}
          className="flex flex-col md:flex-row justify-between items-end gap-6"
        >
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
        </motion.div>
      </div>

      <div className="relative px-6 md:px-12 lg:px-24">
        {/* Horizontal Navigation Buttons - Vertical Rectangle Style centered to images */}
        <div className="absolute top-[40%] -translate-y-1/2 left-0 z-30 opacity-0 group-hover/section:opacity-100 transition-opacity duration-500">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-20 md:w-10 md:h-24 bg-grey-dark/10 backdrop-blur-sm text-grey-dark hover:bg-grey-dark hover:text-white transition-all flex items-center justify-center border-r border-grey-dark/5"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} strokeWidth={1} />
          </button>
        </div>
        <div className="absolute top-[40%] -translate-y-1/2 right-0 z-30 opacity-0 group-hover/section:opacity-100 transition-opacity duration-500">
          <button
            onClick={() => scroll('right')}
            className="w-8 h-20 md:w-10 md:h-24 bg-grey-dark/10 backdrop-blur-sm text-grey-dark hover:bg-grey-dark hover:text-white transition-all flex items-center justify-center border-l border-grey-dark/5"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} strokeWidth={1} />
          </button>
        </div>

        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-6 md:gap-8 lg:gap-10 overflow-x-auto pb-16 no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
          style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
        >
          {products.map((product, idx) => (
            <motion.div
              key={`${product.id}-${idx}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: false, amount: 0.1 }}
              onClick={() => !isDragging && onProductClick(product)}
              className="min-w-[150px] md:min-w-[210px] lg:min-w-[250px] snap-start group/card cursor-pointer"
            >
              <div className="aspect-[3/4] overflow-hidden mb-4 relative bg-[#f9f9f7] shadow-sm border border-grey-dark/5 p-8 flex items-center justify-center">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-contain transition-all duration-1000 group-hover/card:scale-105 pointer-events-none"
                />
                <div className="absolute inset-0 bg-lemon/5 group-hover/card:bg-transparent transition-colors shadow-inner" />
                <div className="absolute top-4 right-4 md:top-6 md:right-6 translate-y-[-10px] opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500">
                  <button
                    onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                    className="border border-white/50 text-white bg-transparent backdrop-blur-md px-4 py-1 text-[8px] uppercase font-bold tracking-widest hover:bg-white hover:text-grey-dark transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>                             <div className="flex flex-col gap-2 pl-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-[9px] uppercase tracking-[0.2em] font-black text-grey-dark">{product.name}</h4>
                  <span className="text-[9px] text-grey-dark/40 font-mono tracking-tighter">{product.price}</span>
                </div>
                <p className="text-[8px] text-grey-dark/30 uppercase tracking-widest font-medium">Fine Archive Piece</p>
              </div>
            </motion.div>
          ))}
          {/* Spacer for scroll-end padding */}
          <div className="min-w-[1.5rem] md:min-w-[3rem] lg:min-w-[6rem] h-1" aria-hidden="true" />
        </div>

        {/* Denim Strip Effect (Progress Indicator) */}
        <motion.div
          style={{ opacity: stripOpacity }}
          className="absolute bottom-6 left-6 md:left-12 lg:left-24 right-6 md:right-12 lg:right-24 h-[1px] bg-grey-dark/10 rounded-full overflow-hidden"
        >
          <motion.div
            style={{ scaleX: scrollXProgress, transformOrigin: '0%' }}
            className="h-full bg-grey-dark w-full"
          />
        </motion.div>


        {/* Custom styling to hide scrollbar and enable smooth scrolling */}
        <style dangerouslySetInnerHTML={{
          __html: `
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { 
                        -ms-overflow-style: none; 
                        scrollbar-width: none; 
                        scroll-behavior: smooth;
                        -webkit-overflow-scrolling: touch;
                    }
                ` }} />
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="pt-24 pb-12 px-6 md:px-12 lg:px-24 border-t border-grey-dark/5 bg-lemon text-grey-dark">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
        <div className="md:col-span-2">
          <h2 className="text-3xl font-sans font-black tracking-widest uppercase">AURHOUSE</h2>
          <p className="text-grey-dark/50 text-sm max-w-sm mb-8 leading-relaxed font-medium">
            Reimaging the modern wardrobe through an essentialist lens. Our focus remains on shirts, tailored blazers, and silhouettes that endure.
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
        <p>© 2026 Aurhouse Collective. Distributed by Art.</p>
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
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1] }}
      className="fixed inset-0 z-[100] bg-lemon flex items-center justify-center overflow-hidden"
    >
      <div className="relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 h-[1px] bg-grey-dark"
        />
        <motion.h1
          className="text-2xl md:text-4xl font-display italic text-grey-dark tracking-[0.5em] px-12 py-4 font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          AURHOUSE
        </motion.h1>
      </div>
    </motion.div>
  );
};

const ProductPage = ({ product, onBack, onAddToCart, onToggleWishlist, wishlist, relatedProducts, setSelectedProduct }: { product: Product, onBack: () => void, onAddToCart: (p: Product) => void, onToggleWishlist: (p: Product) => void, wishlist: Product[], relatedProducts: Product[], setSelectedProduct: (p: Product) => void }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product.id]);

  const isInWishlist = wishlist.some(p => p.id === product.id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-24 px-6 md:px-12 lg:px-24 bg-lemon min-h-screen">
      <button onClick={onBack} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest mb-12 text-grey-dark/40 hover:text-grey-dark">
        <ArrowLeft size={14} /> Back to Archive
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="aspect-[3/4] bg-white border border-grey-dark/5 overflow-hidden shadow-xl border border-grey-dark/5 p-12 flex items-center justify-center">
          <img src={product.img} alt={product.name} className="w-full h-full object-contain" />
        </div>
        <div className="space-y-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-sans font-black uppercase mb-4">{product.name}</h1>
            <p className="text-2xl font-mono text-grey-dark/60">{product.price}</p>
          </div>
          <p className="text-sm leading-relaxed text-grey-dark/60">{product.description || "Archive piece."}</p>
          <div className="flex flex-col gap-4">
            <button onClick={() => onAddToCart(product)} className="w-full py-5 bg-grey-dark text-lemon text-[10px] uppercase font-black tracking-widest shadow-lg hover:bg-black transition-colors">Add to Cart</button>
            <button onClick={() => onToggleWishlist(product)} className="w-full py-4 border border-grey-dark text-[10px] uppercase font-black tracking-widest flex items-center justify-center gap-2 hover:bg-grey-dark/5 transition-colors">
              <Heart size={14} fill={isInWishlist ? "black" : "none"} /> {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
      <ProductGrid
        id="related-1"
        title="Similar Arrivals"
        subtitle="The Archive"
        products={relatedProducts.slice(0, 8)}
        onProductClick={(p) => { setSelectedProduct(p); window.scrollTo(0, 0); }}
        onAddToCart={onAddToCart}
      />
    </motion.div>
  );
};

const CartDrawer = ({ isOpen, onClose, items, onRemove, onUpdateQty }: { isOpen: boolean, onClose: () => void, items: { product: Product, qty: number }[], onRemove: (id: string) => void, onUpdateQty: (id: string, d: number) => void }) => {
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
              {items.length === 0 ? <p className="text-[10px] uppercase tracking-widest text-grey-dark/30 text-center mt-20">Your archive is empty.</p> : items.map(item => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-grey-light overflow-hidden"><img src={item.product.img} className="w-full h-full object-cover" /></div>
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] uppercase font-black">{item.product.name}</p>
                    <div className="flex items-center gap-4 text-[10px] font-mono">
                      <button onClick={() => onUpdateQty(item.product.id, -1)}><Minus size={12} /></button>
                      <span>{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.product.id, 1)}><Plus size={12} /></button>
                    </div>
                    <button onClick={() => onRemove(item.product.id)} className="text-[8px] uppercase tracking-tighter text-grey-dark/40 underline">Remove</button>
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

const WishlistDrawer = ({ isOpen, onClose, items, onRemove, onAddToCart }: { isOpen: boolean, onClose: () => void, items: Product[], onRemove: (id: string) => void, onAddToCart: (p: Product) => void }) => {
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
              {items.length === 0 ? <p className="text-[10px] uppercase tracking-widest text-grey-dark/30 text-center mt-20">No favorites selected yet.</p> : items.map(p => (
                <div key={p.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-grey-light overflow-hidden"><img src={p.img} className="w-full h-full object-cover" /></div>
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] uppercase font-black">{p.name}</p>
                    <button onClick={() => onAddToCart(p)} className="text-[8px] uppercase font-black text-grey-dark/40 block">Add to Cart</button>
                    <button onClick={() => onRemove(p.id)} className="text-[8px] uppercase tracking-tighter text-grey-dark/40 underline">Remove</button>
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

  const [dbItems, setDbItems] = React.useState([]);
  React.useEffect(() => {
    const getItems = async () => {
      const { data } = await supabase.from("products").select("*");
      if (data) setDbItems(data);
    };
    getItems();
  }, []);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'home' | 'product'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<{ product: Product, qty: number }[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.find(p => p.id === product.id)) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  const trends = ALL_PRODUCTS.filter(p => p.category === 'trending');
  const newArrivals = ALL_PRODUCTS.filter(p => p.category === 'new');

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
              onNavigate={(v) => { setView(v); window.scrollTo(0, 0); }}
              cartCount={cartItems.reduce((acc, item) => acc + item.qty, 0)}
              wishlistCount={wishlist.length}
              onOpenCart={() => setIsCartOpen(true)}
              onOpenWishlist={() => setIsWishlistOpen(true)}
            />
            <main>
              {view === 'home' ? (
                <>
                  <Hero onNavigate={setView} />
                  <Quote />

                  {/* 1. The Editorial Banners */}
                  <Banners onNavigate={(v, p) => {
                    if (p) { setSelectedProduct(p); setView('product'); }
                    else setView(v);
                  }} />

                  {/* 2. The Dynamic Sections */}
                  {siteData.dynamicSections.map((section: any) => {
                    // Force the correct data based on the section ID
                    const items = section.id.toLowerCase().includes("trend") ? trends : newArrivals;

                    return (
                      <ProductGrid
                        key={section.id}
                        id={section.id}
                        title={section.title}
                        subtitle={section.subtitle}
                        products={items}
                        onProductClick={(p) => { setSelectedProduct(p); setView('product'); }}
                        onAddToCart={handleAddToCart}
                      />
                    );
                  })}
                </>
              ) : selectedProduct ? (
                <ProductPage
                  product={selectedProduct}
                  onBack={() => setView('home')}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlist={wishlist}
                  relatedProducts={ALL_PRODUCTS.filter(p => p.id !== selectedProduct.id)}
                  setSelectedProduct={setSelectedProduct}
                />
              ) : null}
            </main>
            <Footer />
            <CartDrawer
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
              items={cartItems}
              onRemove={(id) => setCartItems(prev => prev.filter(i => i.product.id !== id))}
              onUpdateQty={(id, delta) => setCartItems(prev => prev.map(i => i.product.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))}
            />
            <WishlistDrawer
              isOpen={isWishlistOpen}
              onClose={() => setIsWishlistOpen(false)}
              items={wishlist}
              onRemove={(id) => setWishlist(prev => prev.filter(p => p.id !== id))}
              onAddToCart={handleAddToCart}
            />
          </>
        )}
      </div>
    </div>
  );
}
