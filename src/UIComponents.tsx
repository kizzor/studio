import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Heart, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { woocommerce } from './woocommerceClient';

// --- Shared Interfaces ---
export interface Product {
    id: string;
    name: string;
    price: number;
    images: any[];
    brand: string;
    description: string;
    short_description?: string;
    type?: string;
    attributes?: any[];
    categories?: any[];
    warning_text?: string;
}

// --- Helper Functions ---
export const getProductImage = (product: any): string => {
    // Check for variation image, then main product image, then fallbacks
    const imageUrl =
        product?.images?.[0]?.src ||
        (product?.images && product.images.length > 0 ? product.images[0].src : null);

    if (!imageUrl) {
        return "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000"; // Your default placeholder
    }

    // Handle local environment URL mapping if necessary
    // If your WooCommerce images are stored with the live domain, 
    // you might need to replace it here:
    return imageUrl.replace('https://your-live-site.com', import.meta.env.VITE_WOOCOMMERCE_API_URL || '');
};

export const CartDrawer = ({
    isOpen,
    onClose,
    items,
    onRemove,
    onUpdateQty
}: {
    isOpen: boolean;
    onClose: () => void;
    items: any[];
    onRemove: (id: string, variant: any) => void;
    onUpdateQty: (id: string, variant: any, d: number) => void;
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200]">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-grey-dark/30 z-[200] backdrop-blur-sm" />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0, width: isExpanded ? "100%" : "400px" }}
                        exit={{ x: "100%" }}
                        className="fixed top-0 right-0 bottom-0 bg-lemon z-[210] p-8 md:p-12 pt-28 md:pt-32 flex flex-col border-l border-grey-dark/10 shadow-2xl transition-all duration-500 ease-in-out"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-xl font-sans font-black uppercase tracking-widest text-grey-dark">Cart</h2>
                            <div className="flex gap-4">
                                <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-grey-dark/5 rounded-full transition-colors font-bold text-[10px] uppercase">
                                    {isExpanded ? 'Minimize' : 'Expand View'}
                                </button>
                                <button onClick={onClose} className="p-2 hover:bg-grey-dark/5 rounded-full transition-colors"><X size={24} /></button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-8">
                            {items.length === 0 ? <p className="text-[10px] uppercase tracking-widest text-grey-dark/30 text-center mt-20">Your archive is empty.</p> : items.map((item, idx) => (
                                <div key={`${item.product.id}-${idx}`} className="flex gap-4">
                                    <div className="w-20 h-24 bg-grey-light overflow-hidden">
                                        <img src={item.variant?.image || getProductImage(item.product)} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <p className="text-[10px] uppercase font-black">{item.product.name}</p>
                                        {item.variant?.color && <p className="text-[8px] uppercase text-grey-dark/40">{item.variant.color} / {item.variant.size}</p>}
                                        <div className="flex items-center gap-4 text-[10px] font-mono">
                                            <button onClick={() => onUpdateQty(item.product.id, item.variant, -1)}><Minus size={12} /></button>
                                            <span>{item.qty}</span>
                                            <button onClick={() => onUpdateQty(item.product.id, item.variant, 1)}><Plus size={12} /></button>
                                        </div>
                                        <button onClick={() => onRemove(item.product.id, item.variant)} className="text-[8px] uppercase tracking-tighter text-grey-dark/40 underline">Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {items.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-grey-dark/10">
                                <div className="flex justify-between text-[10px] font-black uppercase mb-4">
                                    <span>Total</span>
                                    <span>₹{items.reduce((acc, i) => acc + (i.product.price * i.qty), 0).toFixed(2)}</span>
                                </div>
                                <button className="w-full py-5 bg-grey-dark text-lemon text-[10px] uppercase font-black tracking-widest">
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export const WishlistDrawer = ({
    isOpen,
    onClose,
    items,
    onRemove,
    onAddToCart
}: {
    isOpen: boolean;
    onClose: () => void;
    items: Product[];
    onRemove: (id: string) => void;
    onAddToCart: (p: Product, selectedColor: string | null, selectedSize: string | null, variationImage: string | null) => void;
}) => {
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
                                    <div className="w-20 h-24 bg-grey-light overflow-hidden">
                                        <img src={getProductImage(p)} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <p className="text-[10px] uppercase font-black">{p.name}</p>
                                        <button onClick={() => onAddToCart(p, null, null, null)} className="text-[8px] uppercase font-black text-grey-dark/40 block">Add to Cart</button>
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

export const ProductPage = ({
    product: selectedProduct,
    onBack,
    onAddToCart,
    onToggleWishlist,
    wishlist,
    products,
    setSelectedProduct,
    colorOptions
}: {
    product: Product;
    onBack: () => void;
    onAddToCart: (product: Product, selectedColor: string | null, selectedSize: string | null, variationImage: string | null) => void;
    onToggleWishlist: (product: Product) => void;
    wishlist: Product[];
    products: Product[];
    setSelectedProduct: (product: Product) => void;
    colorOptions: any[];
}) => {
    if (!selectedProduct) return null;

    const [activeImage, setActiveImage] = useState(getProductImage(selectedProduct));
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [loadedVariations, setLoadedVariations] = useState<any[]>([]);

    useEffect(() => {
        setActiveImage(getProductImage(selectedProduct));
        setSelectedColor(null);
        setSelectedSize(null);
        setLoadedVariations([]);
    }, [selectedProduct.id]);

    useEffect(() => {
        if (selectedProduct?.type === 'variable' && selectedProduct.id) {
            const fetchVariations = async () => {
                try {
                    const response = await woocommerce.get(`products/${selectedProduct.id}/variations`, {
                        params: {
                            per_page: 100
                        }
                    });
                    const vars = response.data;
                    setLoadedVariations(vars || []);
                } catch (err) {
                    console.error("Failed to fetch variations:", err);
                }
            };
            fetchVariations();
        }
    }, [selectedProduct.id, selectedProduct.type]);

    const isAvailable = (size: string) => {
        if (selectedProduct.type !== 'variable') return true;
        if (loadedVariations.length === 0) return true;
        return loadedVariations.some((v: any) => {
            const variationSizeAttr = v.attributes?.find((a: any) =>
                a.name?.toLowerCase() === 'size' || a.name?.toLowerCase() === 'pa_size'
            );
            const matchesSize = variationSizeAttr ? (variationSizeAttr.option?.toLowerCase() === size.toLowerCase() || variationSizeAttr.option === "") : true;
            if (!matchesSize) return false;
            if (selectedColor) {
                const variationColorAttr = v.attributes?.find((a: any) => a.name?.toLowerCase() === 'color' || a.name?.toLowerCase() === 'pa_color');
                const matchesColor = variationColorAttr ? (variationColorAttr.option?.toLowerCase() === selectedColor.toLowerCase() || variationColorAttr.option === "") : true;
                if (!matchesColor) return false;
            }
            return v.stock_status !== 'outofstock';
        });
    };

    const handleColorSelect = (colorName: string) => {
        setSelectedColor(colorName);
        const match = loadedVariations.find((v: any) => v.attributes?.some((attr: any) => attr.option?.toLowerCase().trim() === colorName.toLowerCase().trim()));
        if (match && match.image?.src) setActiveImage(match.image.src);
        else {
            const galleryMatch = selectedProduct.images?.find((img: any) => img.src?.toLowerCase().includes(colorName.toLowerCase()));
            if (galleryMatch) setActiveImage(galleryMatch.src);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-28 pb-24 px-6 md:px-12 lg:px-24 bg-[#f9f9f7] min-h-screen">
            <button onClick={onBack} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest mb-12 text-grey-dark/40 hover:text-grey-dark transition-colors">
                <ArrowLeft size={14} /> Back to Archive
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-7xl mx-auto items-start">
                <div className="flex flex-col gap-4 sticky top-24">
                    <div className="w-full p-8 flex items-center justify-center border border-grey-dark/5 overflow-hidden image-container" style={{ minHeight: '500px', background: '#f5f5f5' }}>
                        <motion.img key={activeImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} src={activeImage} alt={selectedProduct.name} className="max-h-[500px] w-full object-contain product-display-image" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000"; }} />
                    </div>
                    {selectedProduct.images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar">
                            {selectedProduct.images.map((imgObj: any, index: number) => {
                                const imgUrl = typeof imgObj === 'string' ? imgObj : imgObj?.src;
                                return <button key={index} onClick={() => setActiveImage(imgUrl)} className={`w-16 h-20 bg-[#f4f4f2] p-1 border flex-shrink-0 transition-all ${activeImage === imgUrl ? 'border-grey-dark scale-95' : 'border-grey-dark/10 opacity-60 hover:opacity-100'}`}><img src={imgUrl} className="w-full h-full object-cover" /></button>
                            })}
                        </div>
                    )}
                </div>
                <div className="space-y-8 pr-4">
                    <div><h1 className="text-3xl font-black uppercase mb-3 text-grey-dark">{selectedProduct.name}</h1><p className="text-xl font-mono text-grey-dark/80 font-medium">₹{selectedProduct.price}</p></div>
                    <div className="border-t border-b border-grey-dark/5 py-6">
                        <span className="text-[9px] uppercase tracking-[0.3em] font-black text-grey-dark/40 block mb-3">Product Brief</span>
                        <div className="text-[11px] uppercase tracking-[0.2em] text-grey-dark/70 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: selectedProduct.short_description || selectedProduct.description || 'Fine Archival curated apparel artifact item.' }} />
                    </div>
                    {selectedProduct.attributes?.find((a: any) => a.name.toLowerCase().includes('color'))?.options.length > 0 && (
                        <div className="space-y-3"><span className="text-[9px] uppercase tracking-[0.3em] font-black text-grey-dark/40 block">Select Colorway</span><div className="flex flex-wrap gap-3">{selectedProduct.attributes.find((a: any) => a.name.toLowerCase().includes('color')).options.map((c: string, idx: number) => <button key={idx} onClick={() => handleColorSelect(c)} className={`w-8 h-8 rounded-none border transition-all ${selectedColor === c ? 'border-grey-dark scale-110 shadow-md ring-1 ring-grey-dark/20' : 'border-grey-dark/20 hover:scale-105'}`} />)}</div></div>
                    )}
                    {selectedProduct.attributes?.find((a: any) => a.name.toLowerCase().includes('size'))?.options.length > 0 && (
                        <div className="space-y-3"><span className="text-[9px] uppercase tracking-[0.3em] font-black text-grey-dark/40 block">Select Fit Matrix</span><div className="flex flex-wrap gap-3">{selectedProduct.attributes.find((a: any) => a.name.toLowerCase().includes('size')).options.map((s: string) => <button key={s} disabled={!isAvailable(s)} onClick={() => setSelectedSize(s)} className={`w-12 h-12 text-[10px] font-mono border font-black transition-all ${!isAvailable(s) ? 'opacity-25 line-through cursor-not-allowed' : selectedSize === s ? 'bg-grey-dark text-lemon border-grey-dark shadow-sm' : 'bg-white text-grey-dark border-grey-dark/10 hover:border-grey-dark'}`}>{s}</button>)}</div></div>
                    )}
                    <button onClick={() => onAddToCart(selectedProduct, selectedColor, selectedSize, activeImage)} className="w-full py-5 bg-grey-dark text-lemon font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl">Add to Cart</button>
                </div>
            </div>
            <div className="mt-24 border-t border-grey-dark/5 pt-16">
                <ProductGrid id="similar-arrivals" title="SIMILAR ARRIVALS" subtitle="THE ARCHIVE" products={products.filter((p: Product) => p.id !== selectedProduct.id)} onProductClick={setSelectedProduct} onAddToCart={(p: Product) => onAddToCart(p, null, null, null)} />
            </div>
        </motion.div>
    );
};

export const ProductGrid = ({ title, products, subtitle, id, onProductClick, onAddToCart }: { title: string, products: Product[], subtitle: string, id: string, onProductClick: (p: Product) => void, onAddToCart: (p: Product) => void }) => {
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
        scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    };

    return (
        <section id={id} className="py-4 overflow-hidden bg-lemon relative block w-full group/section">
            <div className="px-6 md:px-12 lg:px-24 mb-4">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                    <div className="pl-1">
                        <span className="text-[8px] uppercase tracking-[0.4em] text-grey-dark/30 mb-2 block font-bold">{subtitle}</span>
                        <h2 className="text-xl md:text-3xl font-sans font-black tracking-tight uppercase text-grey-dark">{title}</h2>
                    </div>
                    <div className="hidden md:flex gap-4 items-center">
                        <div className="w-10 h-[1px] bg-grey-dark/20" />
                        <span className="text-[8px] uppercase tracking-widest font-bold text-grey-dark/40">Discover more</span>
                    </div>
                </div>
            </div>

            <div className="relative px-6 md:px-12 lg:px-24 w-full block">
                <div className="absolute top-[40%] -translate-y-1/2 left-0 z-30 opacity-0 group-hover/section:opacity-100 transition-opacity duration-500">
                    <button onClick={() => scroll('left')} className="w-8 h-20 bg-grey-dark/10 backdrop-blur-sm text-grey-dark flex items-center justify-center"><ChevronLeft size={20} /></button>
                </div>
                <div className="absolute top-[40%] -translate-y-1/2 right-0 z-30 opacity-0 group-hover/section:opacity-100 transition-opacity duration-500">
                    <button onClick={() => scroll('right')} className="w-8 h-20 bg-grey-dark/10 backdrop-blur-sm text-grey-dark flex items-center justify-center"><ChevronRight size={20} /></button>
                </div>
                <div
                    ref={scrollRef}
                    onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}
                    className="flex flex-nowrap items-start justify-start gap-6 overflow-x-auto pb-2 no-scrollbar cursor-grab active:cursor-grabbing select-none w-full max-w-full relative"
                    style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
                >
                    {products.map((product, idx) => (
                        <motion.div key={`${product.id}-${idx}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }} onClick={() => !isDragging && onProductClick(product)} className="w-[210px] min-w-[210px] shrink-0 block group/card cursor-pointer">
                            <div className="w-[210px] h-[280px] overflow-hidden mb-4 relative bg-[#f9f9f7] border border-grey-dark/5 flex items-center justify-center">
                                <img src={getProductImage(product)} alt={product.name} className="absolute inset-0 w-full h-full object-cover pointer-events-none" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000"; }} />
                                <div className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform translate-y-[-4px] group-hover/card:translate-y-0 z-10">
                                    <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className="bg-[rgba(27,27,27,0.75)] backdrop-blur-md text-lemon px-3 py-1.5 text-[9px] uppercase font-bold tracking-widest hover:bg-grey-dark transition-all shadow-sm border border-white/5">Add</button>
                                </div>
                            </div>
                            <div className="space-y-1 pl-1 w-full block">
                                <div className="flex justify-between items-start gap-2 w-full min-h-[30px]">
                                    <h4 className="text-[10px] uppercase tracking-[0.15em] font-black text-grey-dark truncate max-w-[70%]">{product.name}</h4>
                                    <span className="text-[10px] text-grey-dark/60 font-mono font-medium whitespace-nowrap">₹{product.price}</span>
                                </div>
                                <p className="text-[8px] text-grey-dark/30 uppercase tracking-widest font-medium">Fine Archive Piece</p>
                            </div>
                        </motion.div>
                    ))}
                    <div className="min-w-[2rem] h-1" />
                </div>
            </div>
        </section>
    );
};