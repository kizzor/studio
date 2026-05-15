import React, { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";
import { Plus, Trash2, Save, X, Image as ImageIcon, Type, Layout, ShoppingBag, AlertTriangle, Layers, Shirt } from 'lucide-react';

interface ColorVariant {
    name: string;
    img: string;
}

interface ProductDNA {
    id: string;
    name: string;
    price: string;
    img: string;
    description: string;
    warning_text: string;
    sizes: string[];
    colors: ColorVariant[];
}

interface SectionDNA {
    id: string;
    title: string;
    subtitle: string;
    products: ProductDNA[];
}

const SdnAdmin = ({ onClose }: { onClose: () => void }) => {
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState<SectionDNA[]>([]);
    const [hero, setHero] = useState<any>({ title: '', subtitle: '', image_url: '' });
    const [quote, setQuote] = useState<any>({ text: '', author: '' });
    const [banners, setBanners] = useState<any[]>([]);

    // Expansion controls state hooks for dashboard navigation cleanly
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    const [activeProductId, setActiveProductId] = useState<string | null>(null);

    useEffect(() => {
        fetchDNA();
    }, []);

    const fetchDNA = async () => {
        setLoading(true);
        const { data } = await supabase.from('site_config').select('*').eq('id', 1).single();
        if (data) {
            setSections(data.dynamic_sections || []);
            setHero(data.hero_config || { title: '', subtitle: '', image_url: '' });
            setQuote(data.quote_config || { text: '', author: '' });
            setBanners(data.banners_config || []);
        }
        setLoading(false);
    };

    const saveDNA = async () => {
        const { error } = await supabase
            .from('site_config')
            .upsert({
                id: 1, // Keep it fixed to ID 1
                dynamic_sections: sections,
                hero_config: hero,
                quote_config: quote,
                banners_config: banners,
                updated_at: new Date()
            });

        if (!error) {
            alert("✨ SITE CONFIGURATION AND PRODUCT DNA MASTER CONFLICT COMMIT COMPLETE");
        } else {
            console.error(error);
            alert(`CRITICAL SYNC ERROR: ${error.message}`);
        }
    };

    // Deep Mutation Engine Helpers
    const addProductElement = (sectionIdx: number) => {
        const newSections = [...sections];
        const targetSection = newSections[sectionIdx];

        // 1. Defend against missing products array asset properties
        if (!targetSection.products || !Array.isArray(targetSection.products)) {
            targetSection.products = [];
        }

        const currentProducts = targetSection.products;
        const nextIdIndex = currentProducts.length + 1;

        // 2. Build the structural schema entity element payload matching your request
        const newProduct: ProductDNA = {
            id: `E${nextIdIndex}`,
            name: 'NEW ARCHIVE PIECE',
            price: '0000',
            img: '',
            description: 'Premium curated fashion component text block.',
            warning_text: 'ATTENTION: RUNWAY RELEASE SPECIFIC // LAUNDRY CARE: DRY CLEAN ONLY',
            sizes: ['M', 'L'],
            colors: [{ name: 'Default Black', img: '' }]
        };

        // 3. Update states and automatically lock open accordion panels to reveal changes
        targetSection.products = [...currentProducts, newProduct];
        setSections(newSections);

        // Force open both the parent section and the new product sheet form
        setActiveSectionId(targetSection.id);
        setActiveProductId(`${targetSection.id}-${newProduct.id}`);
    };

    const removeProductElement = (sectionIdx: number, productID: string) => {
        const newSections = [...sections];
        newSections[sectionIdx].products = newSections[sectionIdx].products.filter(p => p.id !== productID);
        // Normalize sequence indices to keep standard E1, E2 order intact
        newSections[sectionIdx].products = newSections[sectionIdx].products.map((p, idx) => ({
            ...p,
            id: `E${idx + 1}`
        }));
        setSections(newSections);
        setActiveProductId(null);
    };

    const updateProductField = (sectionIdx: number, productIdx: number, field: keyof ProductDNA, value: any) => {
        const newSections = [...sections];
        newSections[sectionIdx].products[productIdx] = {
            ...newSections[sectionIdx].products[productIdx],
            [field]: value
        };
        setSections(newSections);
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-white italic tracking-widest animate-pulse">LOADING_CORE_DNA_ENVIRONMENT...</div>;

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white p-6 md:p-12 font-mono selection:bg-white selection:text-black">
            {/* Header Module */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/10 pb-8 gap-6">
                <div>
                    <h1 className="text-xl md:text-2xl tracking-[0.4em] font-black uppercase text-white">AURHOUSE // ARCHITECTURE MATRIX</h1>
                    <p className="text-[10px] text-white/40 tracking-[0.2em] mt-2">WIRING PARADIGM OVERRIDE ACTIVE</p>
                </div>
                <button onClick={onClose} className="px-6 py-3 border border-white text-white text-[10px] uppercase font-black tracking-widest hover:bg-white hover:text-black transition-all duration-300">EXIT_DASHBOARD</button>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* LEFT SYSTEM STREAM: LAYOUT CORE INTERFACES */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Hero Layout */}
                    <section className="bg-white/[0.02] border border-white/10 p-6 space-y-4">
                        <h3 className="text-[10px] tracking-widest text-white/50 uppercase font-bold flex items-center gap-2"><ImageIcon size={14} /> HERO_DNA_SETTING</h3>
                        <div className="space-y-3">
                            <input value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} className="w-full bg-black/60 border border-white/10 p-3 text-xs outline-none focus:border-white/40 font-sans tracking-wide" placeholder="Hero Main Headline" />
                            <input value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} className="w-full bg-black/60 border border-white/10 p-3 text-xs outline-none focus:border-white/40 font-mono text-white/60" placeholder="Hero Subtitle" />
                            <input value={hero.image_url} onChange={(e) => setHero({ ...hero, image_url: e.target.value })} className="w-full bg-black/60 border border-white/10 p-3 text-[10px] outline-none focus:border-white/40" placeholder="Hero Image asset asset path URL" />
                        </div>
                    </section>

                    {/* Philosophy Expression */}
                    <section className="bg-white/[0.02] border border-white/10 p-6 space-y-4">
                        <h3 className="text-[10px] tracking-widest text-white/50 uppercase font-bold flex items-center gap-2"><Type size={14} /> PHILOSOPHY_GLOBAL_DNA</h3>
                        <textarea value={quote.text} onChange={(e) => setQuote({ ...quote, text: e.target.value })} className="w-full bg-black/60 border border-white/10 p-3 text-xs outline-none focus:border-white/40 h-20 resize-none italic leading-relaxed" placeholder="Brand Statement Line" />
                    </section>

                    {/* Editorial Banners Row */}
                    <section className="bg-white/[0.02] border border-white/10 p-6 space-y-4">
                        <h3 className="text-[10px] tracking-widest text-white/50 uppercase font-bold flex items-center gap-2"><Layers size={14} /> EDITORIAL_BANNER_ASSETS</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {banners.map((banner, idx) => (
                                <div key={idx} className="space-y-1">
                                    <label className="text-[8px] text-white/40 uppercase">Panel {idx + 1} Source</label>
                                    <input value={banner.img} onChange={(e) => { const n = [...banners]; n[idx].img = e.target.value; setBanners(n); }} className="w-full bg-black/40 border border-white/10 p-2 text-[9px] outline-none focus:border-white" />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Global Master Save Action */}
                    <button onClick={saveDNA} className="w-full py-6 bg-white text-black font-black text-xs tracking-[0.5em] hover:bg-white/90 transition-all flex items-center justify-center gap-3 border border-transparent shadow-2xl">
                        <Save size={16} /> SYNC_ENTIRE_MATRIX
                    </button>
                </div>

                {/* RIGHT SYSTEM STREAM: NESTED STRUCTURE AND PRODUCT OVERLAY ELEMENTS */}
                <div className="lg:col-span-7 space-y-6">
                    <section className="bg-white/[0.02] border border-white/10 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[10px] tracking-widest text-white/50 font-bold uppercase flex items-center gap-2"><Layout size={14} /> SITE_SECTION_MAPPER</h3>
                            <button onClick={() => setSections([...sections, { id: `s-${Date.now()}`, title: 'COLLECTION BUCKET', subtitle: 'REDACTED SUBTITLE', products: [] }])} className="text-[10px] border border-white/30 px-3 py-1 bg-white/5 hover:bg-white hover:text-black transition-all font-bold">+</button>
                        </div>

                        <div className="space-y-4">
                            {sections.map((s, sIdx) => (
                                <div key={s.id} className={`border border-white/10 transition-colors ${activeSectionId === s.id ? 'bg-white/[0.02]' : 'bg-transparent'}`}>
                                    {/* Section Block Main Label Accordion Line Trigger */}
                                    <div className="flex justify-between items-center p-4 bg-white/[0.01] cursor-pointer hover:bg-white/[0.03]" onClick={() => setActiveSectionId(activeSectionId === s.id ? null : s.id)}>
                                        <div className="flex-1 grid grid-cols-2 gap-4 mr-4" onClick={(e) => e.stopPropagation()}>
                                            <input value={s.title} onChange={(e) => { const n = [...sections]; n[sIdx].title = e.target.value; setSections(n); }} className="bg-transparent text-xs font-black tracking-widest outline-none uppercase border-b border-transparent focus:border-white/20" placeholder="Section Header Title" />
                                            <input value={s.subtitle} onChange={(e) => { const n = [...sections]; n[sIdx].subtitle = e.target.value; setSections(n); }} className="bg-transparent text-[10px] text-white/50 outline-none uppercase border-b border-transparent focus:border-white/20" placeholder="Subtitle Context" />
                                        </div>
                                        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => addProductElement(sIdx)} className="text-[9px] bg-white text-black px-2 py-0.5 font-bold hover:bg-white/80" title="Append Product element Item">Add Item</button>
                                            <button onClick={() => setSections(sections.filter(item => item.id !== s.id))} className="text-red-400 hover:text-red-500"><Trash2 size={13} /></button>
                                        </div>
                                    </div>

                                    {/* Expanded Product Control Section Area */}
                                    {activeSectionId === s.id && (
                                        <div className="p-4 border-t border-white/10 bg-black/40 space-y-4">
                                            <div className="text-[9px] text-white/40 uppercase tracking-widest border-b border-white/5 pb-2">Active Child Elements // Product DNA Configurations:</div>

                                            {(!s.products || s.products.length === 0) ? (
                                                <div className="text-[10px] italic text-white/30 p-2">NO PRODUCTS DEFINED UNDER THIS COLLECTION STREAM CODES.</div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {s.products.map((p, pIdx) => (
                                                        <div key={p.id} className="border border-white/5 bg-black/80">
                                                            {/* Nested product subheader bar element option */}
                                                            <div className="flex justify-between items-center px-4 py-2 bg-white/[0.02] cursor-pointer" onClick={() => setActiveProductId(activeProductId === `${s.id}-${p.id}` ? null : `${s.id}-${p.id}`)}>
                                                                <span className="text-[10px] font-bold text-white/80 flex items-center gap-2"><Shirt size={10} /> {p.id}: {p.name || 'UNNAMED PIECE'}</span>
                                                                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                                                    <span className="text-[9px] text-white/40 font-mono">₹{p.price}</span>
                                                                    <button onClick={() => removeProductElement(sIdx, p.id)} className="text-white/30 hover:text-red-400"><X size={12} /></button>
                                                                </div>
                                                            </div>

                                                            {/* Deep Form Field Configurations Overlay */}
                                                            {activeProductId === `${s.id}-${p.id}` && (
                                                                <div className="p-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                                                    {/* Left Block Controls */}
                                                                    <div className="space-y-3">
                                                                        <div>
                                                                            <label className="text-[8px] text-white/40 block uppercase mb-1">Item Title Name</label>
                                                                            <input value={p.name} onChange={(e) => updateProductField(sIdx, pIdx, 'name', e.target.value.toUpperCase())} className="w-full bg-white/5 p-2 text-xs border border-white/10 outline-none font-bold" />
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-[8px] text-white/40 block uppercase mb-1">Price Configuration (INR)</label>
                                                                            <input value={p.price} onChange={(e) => updateProductField(sIdx, pIdx, 'price', e.target.value)} className="w-full bg-white/5 p-2 text-xs border border-white/10 outline-none font-mono" />
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-[8px] text-white/40 block uppercase mb-1">Primary Grid Preview Image Asset URL</label>
                                                                            <input value={p.img} onChange={(e) => updateProductField(sIdx, pIdx, 'img', e.target.value)} className="w-full bg-white/5 p-2 text-[10px] border border-white/10 outline-none" />
                                                                        </div>
                                                                        <div>
                                                                            <label className="text-[8px] text-red-400 block uppercase mb-1 flex items-center gap-1"><AlertTriangle size={10} /> Critical Warning Context Placement Label</label>
                                                                            <input value={p.warning_text} onChange={(e) => updateProductField(sIdx, pIdx, 'warning_text', e.target.value.toUpperCase())} className="w-full bg-red-950/20 p-2 text-[10px] border border-red-500/20 outline-none text-red-300 font-bold" />
                                                                        </div>
                                                                    </div>

                                                                    {/* Right Block Controls (Deep Array Variants: Colors & Sizes) */}
                                                                    <div className="space-y-3">
                                                                        <div>
                                                                            <label className="text-[8px] text-white/40 block uppercase mb-1">Detailed Description Copy</label>
                                                                            <textarea value={p.description} onChange={(e) => updateProductField(sIdx, pIdx, 'description', e.target.value)} className="w-full bg-white/5 p-2 text-[10px] border border-white/10 outline-none h-14 resize-none leading-tight" />
                                                                        </div>

                                                                        {/* Sizes Component Tokenization Array Logic String Input Splits */}
                                                                        <div>
                                                                            <div className="flex justify-between items-center mb-1">
                                                                                <label className="text-[8px] text-white/40 block uppercase">Sizing Array Tokens (Comma Separated)</label>
                                                                                <span className="text-[8px] text-white/20">Current: {p.sizes?.length || 0} items</span>
                                                                            </div>
                                                                            <input
                                                                                type="text"
                                                                                // Keeps state changes smooth and editable by displaying a fallback string structure cleanly
                                                                                defaultValue={p.sizes ? p.sizes.join(', ') : ''}
                                                                                onBlur={(e) => {
                                                                                    // Commits split values to the database state securely only when the user clicks away or completes typing
                                                                                    const tokens = e.target.value
                                                                                        .split(',')
                                                                                        .map(t => t.trim().toUpperCase())
                                                                                        .filter(t => t !== '');
                                                                                    updateProductField(sIdx, pIdx, 'sizes', tokens);
                                                                                }}
                                                                                onKeyDown={(e) => {
                                                                                    // Allows hitting Enter to save changes instantly
                                                                                    if (e.key === 'Enter') {
                                                                                        const target = e.target as HTMLInputElement;
                                                                                        const tokens = target.value
                                                                                            .split(',')
                                                                                            .map(t => t.trim().toUpperCase())
                                                                                            .filter(t => t !== '');
                                                                                        updateProductField(sIdx, pIdx, 'sizes', tokens);
                                                                                        alert("Size elements buffered. Click COMMIT_TO_DNA to save permanently.");
                                                                                    }
                                                                                }}
                                                                                className="w-full bg-white/5 p-2 text-[10px] border border-white/10 outline-none font-bold tracking-widest text-white focus:border-white"
                                                                                placeholder="S, M, L, XL"
                                                                            />
                                                                        </div>

                                                                        {/* Advanced Multi-Color Matrix Matching Form Element Nodes Array */}
                                                                        <div className="space-y-1.5">
                                                                            <div className="flex justify-between items-center">
                                                                                <label className="text-[8px] text-white/40 uppercase font-bold block">Dynamic Color Mapping & Swatch Images</label>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        const updatedColors = [...(p.colors || []), { name: 'New Color', img: '' }];
                                                                                        updateProductField(sIdx, pIdx, 'colors', updatedColors);
                                                                                    }}
                                                                                    className="text-[7px] border border-white/20 px-1.5 py-0.5 hover:bg-white hover:text-black"
                                                                                >
                                                                                    + Add Variant
                                                                                </button>
                                                                            </div>
                                                                            <div className="max-h-24 overflow-y-auto space-y-1.5 border border-white/5 p-2 bg-black/40">
                                                                                {(!p.colors || p.colors.length === 0) ? (
                                                                                    <div className="text-[8px] italic text-white/20">No active colorways specified.</div>
                                                                                ) : p.colors.map((color, cIdx) => (
                                                                                    <div key={cIdx} className="grid grid-cols-12 gap-1 items-center">
                                                                                        <input
                                                                                            value={color.name}
                                                                                            onChange={(e) => {
                                                                                                const updatedColors = [...p.colors];
                                                                                                updatedColors[cIdx].name = e.target.value;
                                                                                                updateProductField(sIdx, pIdx, 'colors', updatedColors);
                                                                                            }}
                                                                                            className="col-span-4 bg-white/5 p-1 text-[9px] border border-white/10 outline-none"
                                                                                            placeholder="Color Title"
                                                                                        />
                                                                                        <input
                                                                                            value={color.img}
                                                                                            onChange={(e) => {
                                                                                                const updatedColors = [...p.colors];
                                                                                                updatedColors[cIdx].img = e.target.value;
                                                                                                updateProductField(sIdx, pIdx, 'colors', updatedColors);
                                                                                            }}
                                                                                            className="col-span-7 bg-white/5 p-1 text-[8px] border border-white/10 outline-none font-mono text-white/50"
                                                                                            placeholder="Dedicated Color Asset Path URL"
                                                                                        />
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                const updatedColors = p.colors.filter((_, idx) => idx !== cIdx);
                                                                                                updateProductField(sIdx, pIdx, 'colors', updatedColors);
                                                                                            }}
                                                                                            className="col-span-1 text-red-400 hover:text-red-500 text-center text-[10px]"
                                                                                        >
                                                                                            ×
                                                                                        </button>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default SdnAdmin;