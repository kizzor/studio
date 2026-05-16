import React, { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";
import { Plus, Trash2, Save, ImageIcon, Type, Layout, ShoppingBag, AlertTriangle, Layers, Shirt, BarChart3, CreditCard, Box } from 'lucide-react';

interface ColorVariant {
    name: string;
    img: string;
}

interface ProductDNA {
    // Ensure all properties are defined as they are used in the UI
    // and expected by the `updateProductField` function.
    // Adding optional properties for robustness if not all are always present.
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
    const [currentTab, setCurrentTab] = useState<'design' | 'orders' | 'gateways'>('design');

    // Core Schema states 
    const [sections, setSections] = useState<SectionDNA[]>([]);
    const [hero, setHero] = useState<any>({ title: '', subtitle: '', image_url: '' });
    const [quote, setQuote] = useState<any>({ text: '', author: '' });
    const [banners, setBanners] = useState<any[]>([]);

    // --- WOOCOMMERCE EQUIVALENT FEATURE STATES ---
    const [orders, setOrders] = useState<any[]>([]);
    const [gateways, setGateways] = useState<any>({ stripe_enabled: false, stripe_key: '', razorpay_enabled: false, cod_enabled: true });

    // Expansion controls state hooks for dashboard navigation cleanly
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    const [activeProductId, setActiveProductId] = useState<string | null>(null);

    useEffect(() => {
        fetchMasterData();
    }, []);

    const fetchMasterData = async () => {
        setLoading(true);
        // 1. Fetch Layout Design and Payment Gateway Matrix Shapes
        const { data: config } = await supabase.from('site_config').select('*').eq('id', 1).single();
        if (config) {
            setSections(config.dynamic_sections || []);
            setHero(config.hero_config || { title: '', subtitle: '', image_url: '' });
            setQuote(config.quote_config || { text: '', author: '' });
            setBanners(config.banners_config || []);
            setGateways(config.payment_gateways || { stripe_enabled: false, stripe_key: '', razorpay_enabled: false, cod_enabled: true });
        }

        // 2. WooCommerce Feature: Live Transaction Orders Stream Fetch
        const { data: orderLogs } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (orderLogs) setOrders(orderLogs);

        setLoading(false);
    };

    const saveMasterSettings = async () => {
        const { error } = await supabase
            .from('site_config')
            .upsert({
                id: 1, // Keep it fixed to ID 1
                dynamic_sections: sections,
                hero_config: hero,
                quote_config: quote,
                banners_config: banners,
                payment_gateways: gateways,
                updated_at: new Date()
            });

        if (!error) {
            alert("✨ ARCHIVE MANAGEMENT MATRIX AND RECEPTACLES SYNCHRONIZED SUCCESSFULLY");
        } else {
            console.error(error);
            alert(`CRITICAL ERROR COMPILED: ${error.message}`);
        }
    };

    const updateOrderStatus = async (orderId: string, field: string, value: string) => {
        const { error } = await supabase.from('orders').update({ [field]: value }).eq('id', orderId);
        if (!error) {
            alert("ORDER PROFILE TOKEN MUTATED");
            fetchMasterData();
        }
    };

    // Deep Mutation Engine Helpers
    const addProductElement = (sectionIdx: number) => {
        const newSections = [...sections];
        const currentProducts = newSections[sectionIdx].products || [];
        const nextIdIndex = currentProducts.length + 1;

        const newProduct: ProductDNA = {
            id: `E${nextIdIndex}`,
            name: 'NEW ARCHIVE PIECE',
            price: '0000',
            img: '',
            description: 'Premium curated fashion component text block.',
            warning_text: 'ATTENTION: RUNWAY RELEASE SPECIFIC // HANDWASH ONLY',
            sizes: ['M', 'L'],
            colors: [{ name: 'Default Black', img: '' }]
        };

        newSections[sectionIdx].products = [...currentProducts, newProduct];
        setSections(newSections);
        setActiveProductId(newProduct.id);
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

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-white italic tracking-widest animate-pulse">COMPILING_COMMERCE_LEDGER_ENVIRONMENT...</div>;

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white p-6 md:p-12 font-mono selection:bg-white selection:text-black">
            {/* Header Module */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 border-b border-white/10 pb-8 gap-6">
                <div>
                    <h1 className="text-xl md:text-2xl tracking-[0.4em] font-black text-white">AURHOUSE // ENTERPRISE CONSOLE</h1>
                    <p className="text-[10px] text-white/40 tracking-[0.2em] mt-2">NATIVE HIGH-SPEED STORE ENGINE SYSTEM ACTIVE</p>
                </div>

                {/* WooCommerce Tab Multi-Route Navigation Bar */}
                <div className="flex flex-wrap gap-2 bg-white/[0.02] border border-white/5 p-1.5">
                    <button onClick={() => setCurrentTab('design')} className={`px-4 py-2 text-[9px] uppercase font-black tracking-widest transition-all ${currentTab === 'design' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}>Layout Matrix</button>
                    <button onClick={() => setCurrentTab('orders')} className={`px-4 py-2 text-[9px] uppercase font-black tracking-widest transition-all relative ${currentTab === 'orders' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}>
                        Order Log System ({orders.length})
                    </button>
                    <button onClick={() => setCurrentTab('gateways')} className={`px-4 py-2 text-[9px] uppercase font-black tracking-widest transition-all ${currentTab === 'gateways' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}>Gateways & Payments</button>
                    <button onClick={onClose} className="px-4 py-2 text-[9px] uppercase font-black bg-red-950 text-red-200 border border-red-900/30">Exit Session</button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* TAB SYSTEM VIEWPORTS 1: DESIGN OVERRIDE NODE */}
                {currentTab === 'design' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-5 space-y-8">
                            <section className="bg-white/[0.02] border border-white/10 p-6 space-y-4">
                                <h3 className="text-[10px] tracking-widest text-white/50 uppercase font-bold flex items-center gap-2"><ImageIcon size={14} /> HERO_DNA_SETTING</h3>
                                <input value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} className="w-full bg-black/60 border border-white/10 p-3 text-xs outline-none focus:border-white/40 font-sans tracking-wide text-white" placeholder="Hero Main Headline" />
                                <input value={hero.image_url} onChange={(e) => setHero({ ...hero, image_url: e.target.value })} className="w-full bg-black/60 border border-white/10 p-3 text-[10px] outline-none" placeholder="Hero Background Image URL string" />
                            </section>
                            <section className="bg-white/[0.02] border border-white/10 p-6 space-y-4">
                                <h3 className="text-[10px] tracking-widest text-white/50 uppercase font-bold flex items-center gap-2"><Type size={14} /> BRAND_PHILOSOPHY</h3>
                                <textarea value={quote.text} onChange={(e) => setQuote({ ...quote, text: e.target.value })} className="w-full bg-black/60 border border-white/10 p-3 text-xs outline-none focus:border-white/40 h-20 resize-none italic leading-relaxed" placeholder="Brand Statement Line" />
                            </section>
                            <button onClick={saveMasterSettings} className="w-full py-6 bg-white text-black font-black text-xs tracking-[0.5em] hover:bg-white/90 transition-all flex items-center justify-center gap-3">
                                <Save size={16} /> SYNC_SYSTEM_MATRIX
                            </button>
                        </div>

                        <div className="lg:col-span-7 space-y-4">
                            <section className="bg-white/[0.02] border border-white/10 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-[10px] tracking-widest text-white/50 font-bold uppercase flex items-center gap-2"><Layout size={14} /> DYNAMIC_SECTIONS_DNA</h3>
                                    <button onClick={() => setSections([...sections, { id: `s-${Date.now()}`, title: 'NEW CATALOG GRID', subtitle: 'COLLECTION SUBSET', products: [] }])} className="text-[10px] border border-white/30 px-3 py-1 font-bold">+</button>
                                </div>
                                <div className="space-y-4">
                                    {sections.map((s, sIdx) => (
                                        <div key={s.id} className="border border-white/10">
                                            <div className="flex justify-between items-center p-4 bg-white/[0.01] cursor-pointer" onClick={() => setActiveSectionId(activeSectionId === s.id ? null : s.id)}>
                                                <span className="text-xs font-black tracking-widest uppercase">{s.title || 'UNNAMED REGION'}</span>
                                                <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const n = [...sections];

                                                            // Safety initialization: If products field is missing or null, build it instantly
                                                            if (!n[sIdx].products || !Array.isArray(n[sIdx].products)) {
                                                                n[sIdx].products = [];
                                                            }

                                                            const nextIndex = n[sIdx].products.length + 1;

                                                            // Append the standardized Product DNA layout object safely
                                                            n[sIdx].products.push({
                                                                id: `E${nextIndex}`,
                                                                name: 'NEW ARCHIVE INSTANCE',
                                                                price: '0000',
                                                                img: '',
                                                                description: 'Premium curated fashion component text block.',
                                                                warning_text: 'ATTENTION: RUNWAY RELEASE SPECIFIC // LAUNDRY CARE: DRY CLEAN ONLY',
                                                                sizes: ['M', 'L'],
                                                                colors: [{ name: 'Default Black', img: '' }]
                                                            });

                                                            setSections(n);

                                                            // Automatically pop open the newly generated element sheet view input forms
                                                            setActiveSectionId(s.id);
                                                            setActiveProductId(`${s.id}-E${nextIndex}`);
                                                        }}
                                                        className="text-[9px] bg-white text-black px-3 py-1 font-bold tracking-widest uppercase border border-transparent hover:bg-white/80 transition-colors"
                                                    >
                                                        Add Item
                                                    </button>
                                                    <button onClick={() => setSections(sections.filter(i => i.id !== s.id))} className="text-red-400"><Trash2 size={13} /></button>
                                                </div>
                                            </div>
                                            {activeSectionId === s.id && (
                                                <div className="p-4 border-t border-white/10 bg-black/40 space-y-2">
                                                    {s.products?.map((p: any, pIdx: number) => (
                                                        <div key={p.id} className="border border-white/5 bg-black p-3 text-xs space-y-2">
                                                            <div className="font-bold flex justify-between">
                                                                <span>{p.id}: {p.name}</span>
                                                                <span>₹{p.price}</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 pt-2">
                                                                <input value={p.name} onChange={(e) => { const n = [...sections]; n[sIdx].products[pIdx].name = e.target.value.toUpperCase(); setSections(n); }} className="bg-white/5 p-2 border border-white/10 text-[10px] uppercase text-white" placeholder="Product Name" />
                                                                <input value={p.price} onChange={(e) => { const n = [...sections]; n[sIdx].products[pIdx].price = e.target.value; setSections(n); }} className="bg-white/5 p-2 border border-white/10 text-[10px] text-white" placeholder="Price" />
                                                                <input value={p.img} onChange={(e) => { const n = [...sections]; n[sIdx].products[pIdx].img = e.target.value; setSections(n); }} className="bg-white/5 p-2 border border-white/10 text-[10px] col-span-2 text-white" placeholder="Image URL String" />
                                                                <input value={p.warning_text} onChange={(e) => { const n = [...sections]; n[sIdx].products[pIdx].warning_text = e.target.value.toUpperCase(); setSections(n); }} className="bg-red-950/20 p-2 border border-red-500/20 text-[10px] col-span-2 text-red-300 font-bold" placeholder="Runway Warning Text Label Placement" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {/* End of products.map */}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                )}

                {/* TAB SYSTEM VIEWPORTS 2: LIVE ORDERS ARCHIVE LEDGER SHEET */}
                {currentTab === 'orders' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white/[0.02] border border-white/10 p-6 flex items-center justify-between">
                                <div><p className="text-[10px] text-white/40 uppercase tracking-widest">Gross Captured Volume</p><h2 className="text-2xl font-sans font-black tracking-tight mt-1 text-white">₹{orders.filter(o => o.payment_status === 'paid').reduce((acc, current) => acc + Number(current.total), 0)}</h2></div>
                                <BarChart3 size={24} className="text-white/20" />
                            </div>
                            <div className="bg-white/[0.02] border border-white/10 p-6 flex items-center justify-between">
                                <div><p className="text-[10px] text-white/40 uppercase tracking-widest">Active Processing Acquisitions</p><h2 className="text-2xl font-sans font-black tracking-tight mt-1 text-white">{orders.filter(o => o.fulfillment_status === 'unfulfilled').length} orders</h2></div>
                                <Box size={24} className="text-white/20" />
                            </div>
                            <div className="bg-white/[0.02] border border-white/10 p-6 flex items-center justify-between">
                                <div><p className="text-[10px] text-white/40 uppercase tracking-widest">Fulfillment Rate Ratio</p><h2 className="text-2xl font-sans font-black tracking-tight mt-1 text-white">{orders.length > 0 ? Math.round((orders.filter(o => o.fulfillment_status === 'delivered').length / orders.length) * 100) : 0}%</h2></div>
                                <ShoppingBag size={24} className="text-white/20" />
                            </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/10 p-6">
                            <h3 className="text-[10px] tracking-widest text-white/50 uppercase font-bold mb-6">LIVE COMPONENT ORDERS LOGSHEET</h3>
                            {orders.length === 0 ? (
                                <div className="text-center p-12 text-xs italic text-white/30">AWAITING SYSTEM TRANSACTION EVENTS FLOW PATHS...</div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.id} className="border border-white/5 bg-black/40 p-5 grid grid-cols-1 xl:grid-cols-12 gap-6 items-center text-xs">
                                            <div className="xl:col-span-3">
                                                <p className="font-mono text-white/40 text-[9px] uppercase">Acquisition Token Key</p>
                                                <p className="font-bold tracking-wider text-white font-mono mt-1 text-[11px]">{order.id.slice(0, 18)}...</p>
                                                <p className="text-[9px] text-white/30 font-mono mt-1">{new Date(order.created_at).toLocaleString()}</p>
                                            </div>
                                            <div className="xl:col-span-3">
                                                <p className="font-mono text-white/40 text-[9px] uppercase">Acquisition Target Customer</p>
                                                <p className="font-bold text-white mt-1">{order.customer_email}</p>
                                            </div>
                                            <div className="xl:col-span-2">
                                                <p className="font-mono text-white/40 text-[9px] uppercase">Purchased Items</p>
                                                <p className="font-black text-white font-mono mt-1">₹{order.total}</p>
                                            </div>
                                            <div className="xl:col-span-2">
                                                <label className="text-[8px] text-white/40 block uppercase mb-1">Financial State Ledger</label>
                                                <select value={order.payment_status} onChange={(e) => updateOrderStatus(order.id, 'payment_status', e.target.value)} className={`w-full bg-black border p-2 text-[10px] outline-none font-bold tracking-widest ${order.payment_status === 'paid' ? 'text-green-400 border-green-900/40 bg-green-950/10' : 'text-amber-400 border-amber-900/40 bg-amber-950/10'}`}>
                                                    <option value="pending" className="text-amber-400">PENDING_CLEAR</option>
                                                    <option value="paid" className="text-green-400">CAPTURE_SUCCESS</option>
                                                    <option value="failed" className="text-red-400">DENIED_REVOKED</option>
                                                </select>
                                            </div>
                                            <div className="xl:col-span-2">
                                                <label className="text-[8px] text-white/40 block uppercase mb-1">Logistics Extraction</label>
                                                <select value={order.fulfillment_status} onChange={(e) => updateOrderStatus(order.id, 'fulfillment_status', e.target.value)} className={`w-full bg-black border p-2 text-[10px] outline-none font-bold tracking-widest ${order.fulfillment_status === 'delivered' ? 'text-blue-400 border-blue-900/40 bg-blue-950/10' : 'text-white/60 border-white/10'}`}>
                                                    <option value="unfulfilled">STATIONARY_HOLD</option>
                                                    <option value="shipped">TRANSIT_EXTRACT</option>
                                                    <option value="delivered">DELIVERED_HANDSHAKE</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB SYSTEM VIEWPORTS 3: CORE PAYMENT GATEWAY WEBHOOK HUB INTEGRATIONS */}
                {currentTab === 'gateways' && (
                    <div className="max-w-xl bg-white/[0.02] border border-white/10 p-8 space-y-6">
                        <h3 className="text-[10px] tracking-widest text-white/50 uppercase font-bold flex items-center gap-2"><CreditCard size={14} /> FINANCIAL GATEWAYS INTEGRATIONS GATE</h3>
                        <p className="text-[10px] text-white/40 leading-relaxed uppercase">// Map transaction endpoints directly to your custom frontend payment pipeline handlers without third-party template bloat.</p>
                        <div className="border-t border-white/10 pt-6 space-y-6">
                            <div className="flex justify-between items-center bg-black/40 p-4 border border-white/5">
                                <div><p className="text-xs font-bold text-white">STRIPE DIRECT CHANNEL</p><p className="text-[9px] text-white/40 mt-1">Accept International Visa, Mastercard, and Credit Cards</p></div>
                                <input type="checkbox" checked={gateways.stripe_enabled} onChange={(e) => setGateways({ ...gateways, stripe_enabled: e.target.checked })} className="w-4 h-4 accent-white cursor-pointer" />
                            </div>
                            {gateways.stripe_enabled && (
                                <div className="space-y-1 pl-4 border-l border-white/10">
                                    <label className="text-[8px] text-white/40 uppercase">Stripe Public Publishable API Key</label>
                                    <input type="text" value={gateways.stripe_key} onChange={(e) => setGateways({ ...gateways, stripe_key: e.target.value })} className="w-full bg-black border border-white/10 p-2.5 text-[10px] font-mono text-white/80" placeholder="pk_live_..." />
                                </div>
                            )}
                            <div className="flex justify-between items-center bg-black/40 p-4 border border-white/5">
                                <div><p className="text-xs font-bold text-white">RAZORPAY DIGITAL INTERFACE</p><p className="text-[9px] text-white/40 mt-1">Native UPI, NetBanking, and Domestic Cards Wallet Integration</p></div>
                                <input type="checkbox" checked={gateways.razorpay_enabled} onChange={(e) => setGateways({ ...gateways, razorpay_enabled: e.target.checked })} className="w-4 h-4 accent-white cursor-pointer" />
                            </div>
                            <div className="flex justify-between items-center bg-black/40 p-4 border border-white/5">
                                <div><p className="text-xs font-bold text-white">CASH ON DELIVERY (COD)</p><p className="text-[9px] text-white/40 mt-1">Bypass payment steps and immediately log order to pending registry</p></div>
                                <input type="checkbox" checked={gateways.cod_enabled} onChange={(e) => setGateways({ ...gateways, cod_enabled: e.target.checked })} className="w-4 h-4 accent-white cursor-pointer" />
                            </div>
                        </div>
                        <button onClick={saveMasterSettings} className="w-full py-5 bg-white text-black font-black text-xs tracking-[0.4em] hover:bg-white/90 transition-all flex items-center justify-center gap-2 mt-4">
                            <Save size={14} /> SAVE_GATEWAY_CONFIG
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SdnAdmin;