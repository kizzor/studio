import React, { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";
import { Plus, Trash2, Save, ImageIcon, Type, Layout, ShoppingBag, BarChart3, CreditCard, Box } from 'lucide-react';

const SdnAdmin = ({ onClose }: { onClose: () => void }) => {
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState<'design' | 'orders' | 'gateways'>('design');

    // Core Data Schema State Mount Points
    const [sections, setSections] = useState<any[]>([]);
    const [hero, setHero] = useState<any>({ title: '', subtitle: '', image_url: '' });
    const [quote, setQuote] = useState<any>({ text: '', author: '' });
    const [banners, setBanners] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [gateways, setGateways] = useState<any>({ stripe_enabled: false, stripe_key: '', razorpay_enabled: false, cod_enabled: true });

    // Accordion Expansion & Inner WooCommerce Sub-Tab States
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    const [activeProductId, setActiveProductId] = useState<string | null>(null);
    const [productSubTabs, setProductSubTabs] = useState<{ [key: string]: 'general' | 'inventory' | 'shipping' | 'variants' }>({});

    useEffect(() => {
        fetchMasterData();
    }, []);

    const fetchMasterData = async () => {
        setLoading(true);
        const { data: config } = await supabase.from('site_config').select('*').eq('id', 1).single();
        if (config) {
            setSections(config.dynamic_sections || []);
            setHero(config.hero_config || { title: '', subtitle: '', image_url: '' });
            setQuote(config.quote_config || { text: '', author: '' });
            setBanners(config.banners_config || []);
            setGateways(config.payment_gateways || { stripe_enabled: false, stripe_key: '', razorpay_enabled: false, cod_enabled: true });
        }
        const { data: orderLogs } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (orderLogs) setOrders(orderLogs);
        setLoading(false);
    };

    const saveMasterSettings = async () => {
        const { error } = await supabase
            .from('site_config')
            .upsert({
                id: 1,
                dynamic_sections: sections,
                hero_config: hero,
                quote_config: quote,
                banners_config: banners,
                payment_gateways: gateways,
                updated_at: new Date()
            });

        if (!error) {
            alert("✨ MASTER CONFIGURATION WITH WOOCOMMERCE INVENTORY TRACKING CORES SYNCED");
        } else {
            alert(`DATA WRITING ABORTED: ${error.message}`);
        }
    };

    // Deep Mutation Engine Helpers for Nested Product DNA Field Properties
    const updateProductField = (sIdx: number, pIdx: number, key: string, value: any) => {
        const updated = [...sections];
        updated[sIdx].products[pIdx] = {
            ...updated[sIdx].products[pIdx],
            [key]: value
        };
        setSections(updated);
    };

    const updateProductDimension = (sIdx: number, pIdx: number, dimKey: string, value: string) => {
        const updated = [...sections];
        const currentDims = updated[sIdx].products[pIdx].dimensions || { length: '', width: '', height: '' };
        updated[sIdx].products[pIdx].dimensions = {
            ...currentDims,
            [dimKey]: value
        };
        setSections(updated);
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-white tracking-widest animate-pulse">COMPILING_E_COMMERCE_SYSTEM_CONSOLE...</div>;

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white p-6 md:p-12 font-mono selection:bg-white selection:text-black">
            {/* Header Core Module */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 border-b border-white/10 pb-8 gap-6">
                <div>
                    <h1 className="text-xl md:text-2xl tracking-[0.4em] font-black text-white">AURHOUSE // ENTERPRISE CONSOLE</h1>
                    <p className="text-[10px] text-white/40 tracking-[0.2em] mt-2">NATIVE HIGH-SPEED STORE ENGINE SYSTEM ACTIVE</p>
                </div>

                <div className="flex flex-wrap gap-2 bg-white/[0.02] border border-white/5 p-1.5">
                    <button onClick={() => setCurrentTab('design')} className={`px-4 py-2 text-[9px] uppercase font-black tracking-widest transition-all ${currentTab === 'design' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}>Layout Matrix</button>
                    <button onClick={() => setCurrentTab('orders')} className={`px-4 py-2 text-[9px] uppercase font-black tracking-widest transition-all relative ${currentTab === 'orders' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}>Order Log System ({orders.length})</button>
                    <button onClick={() => setCurrentTab('gateways')} className={`px-4 py-2 text-[9px] uppercase font-black tracking-widest transition-all ${currentTab === 'gateways' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}>Gateways & Payments</button>
                    <button onClick={onClose} className="px-4 py-2 text-[9px] uppercase font-black bg-red-950 text-red-200 border border-red-900/30">Exit Session</button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* VIEWPORT TAB 1: DESIGN & INTEGRATED PRODUCT SHEET FIELDS */}
                {currentTab === 'design' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* LEFT STRIP Panels */}
                        <div className="lg:col-span-4 space-y-6">
                            <section className="bg-white/[0.02] border border-white/10 p-5 space-y-4">
                                <h3 className="text-[10px] tracking-widest text-white/50 uppercase font-bold flex items-center gap-2"><ImageIcon size={13} /> HERO_DNA_SETTING</h3>
                                <input value={hero.title || ''} onChange={(e) => setHero({ ...hero, title: e.target.value })} className="w-full bg-black/60 border border-white/10 p-2.5 text-xs text-white outline-none" placeholder="Hero Main Headline" />
                                <input value={hero.image_url || ''} onChange={(e) => setHero({ ...hero, image_url: e.target.value })} className="w-full bg-black/60 border border-white/10 p-2.5 text-[10px] text-white/60 outline-none" placeholder="Hero Background Image URL" />
                            </section>

                            <section className="bg-white/[0.02] border border-white/10 p-5 space-y-4">
                                <h3 className="text-[10px] tracking-widest text-white/50 uppercase font-bold flex items-center gap-2"><Type size={13} /> BRAND_PHILOSOPHY</h3>
                                <textarea value={quote.text || ''} onChange={(e) => setQuote({ ...quote, text: e.target.value })} className="w-full bg-black/60 border border-white/10 p-2.5 text-xs h-20 resize-none italic text-white outline-none" />
                            </section>

                            <button onClick={saveMasterSettings} className="w-full py-5 bg-white text-black font-black text-xs tracking-[0.4em] hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                                <Save size={14} /> SYNC_SYSTEM_MATRIX
                            </button>
                        </div>

                        {/* RIGHT STRIP: SECTIONS & DYNAMIC WOOCOMMERCE CORES CONTAINER */}
                        <div className="lg:col-span-8 space-y-4">
                            <div className="bg-white/[0.02] border border-white/10 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-[10px] tracking-widest text-white/50 font-bold uppercase flex items-center gap-2"><Layout size={13} /> DYNAMIC_SECTIONS_DNA</h3>
                                    <button onClick={() => setSections([...sections, { id: `s-${Date.now()}`, title: 'NEW CATALOG GRID', subtitle: 'COLLECTION SUBSET', products: [] }])} className="text-[10px] border border-white/30 px-3 py-1 font-bold hover:bg-white hover:text-black transition-all">+</button>
                                </div>

                                <div className="space-y-4">
                                    {sections.map((s, sIdx) => (
                                        <div key={s.id} className={`border border-white/10 ${activeSectionId === s.id ? 'bg-white/[0.01]' : ''}`}>
                                            {/* Header Section Bar with Text Inputs for Inline Title Mutation Editing */}
                                            <div className="flex justify-between items-center p-3 bg-white/[0.02] cursor-pointer" onClick={() => setActiveSectionId(activeSectionId === s.id ? null : s.id)}>
                                                <div className="flex-1 grid grid-cols-2 gap-4 mr-4" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="text"
                                                        value={s.title || ''}
                                                        onChange={(e) => {
                                                            const updatedSections = [...sections];
                                                            updatedSections[sIdx].title = e.target.value.toUpperCase();
                                                            setSections(updatedSections);
                                                        }}
                                                        className="bg-transparent text-xs font-black tracking-widest uppercase border-b border-white/10 focus:border-white outline-none py-1 text-white font-mono"
                                                        placeholder="MUTABLE SECTION NAME"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={s.subtitle || ''}
                                                        onChange={(e) => {
                                                            const updatedSections = [...sections];
                                                            updatedSections[sIdx].subtitle = e.target.value;
                                                            setSections(updatedSections);
                                                        }}
                                                        className="bg-transparent text-[10px] text-white/40 border-b border-white/5 focus:border-white outline-none py-1"
                                                        placeholder="Section Subtitle"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                                    <button onClick={() => {
                                                        const n = [...sections];
                                                        if (!n[sIdx].products) n[sIdx].products = [];
                                                        n[sIdx].products.push({
                                                            id: `E${n[sIdx].products.length + 1}`, name: 'NEW ARCHIVE INSTANCE', price: '0', sale_price: '', sku: `SKU-${Date.now().toString().slice(-4)}`, stock_qty: 10, manage_stock: true, weight: '', dimensions: { length: '', width: '', height: '' }, tax_class: 'standard', img: '', description: '', warning_text: '', sizes: ['M'], colors: []
                                                        });
                                                        setSections(n);
                                                        setActiveSectionId(s.id);
                                                    }} className="text-[8px] bg-white text-black px-2 py-1 font-bold uppercase tracking-wider hover:bg-white/80">Add Item</button>
                                                    <button onClick={() => setSections(sections.filter(i => i.id !== s.id))} className="text-white/30 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                                                </div>
                                            </div>

                                            {/* Products Sub-Accordion Processing Module */}
                                            {activeSectionId === s.id && (
                                                <div className="p-4 border-t border-white/10 bg-black/40 space-y-3">
                                                    {(!s.products || s.products.length === 0) ? (
                                                        <div className="text-[9px] italic text-white/20 p-2">NO PRODUCTS RECORDED IN THIS FLOW REGISTRY.</div>
                                                    ) : s.products.map((p: any, pIdx: number) => {
                                                        const pKey = `${s.id}-${p.id}`;
                                                        const activeSubTab = productSubTabs[pKey] || 'general';

                                                        return (
                                                            <div key={p.id} className="border border-white/5 bg-black">
                                                                <div className="flex justify-between items-center px-3 py-2 bg-white/[0.01] cursor-pointer" onClick={() => setActiveProductId(activeProductId === pKey ? null : pKey)}>
                                                                    <span className="text-[10px] font-bold text-white/80">[{p.id}] {p.name || 'UNNAMED PIECE'}</span>
                                                                    <span className="text-[9px] font-mono text-white/40">₹{p.price} {p.sku ? `// ${p.sku}` : ''}</span>
                                                                </div>

                                                                {activeProductId === pKey && (
                                                                    <div className="border-t border-white/5 grid grid-cols-12 text-xs">
                                                                        {/* WooCommerce Dashboard Category Style Tab Control Selectors */}
                                                                        <div className="col-span-12 md:col-span-3 border-r border-white/5 bg-white/[0.01] flex md:flex-col text-[9px] uppercase tracking-wider font-bold">
                                                                            <button type="button" onClick={() => setProductSubTabs({ ...productSubTabs, [pKey]: 'general' })} className={`p-2.5 text-left w-full border-b border-white/5 ${activeSubTab === 'general' ? 'bg-white text-black' : 'text-white/60'}`}>$ General Price</button>
                                                                            <button type="button" onClick={() => setProductSubTabs({ ...productSubTabs, [pKey]: 'inventory' })} className={`p-2.5 text-left w-full border-b border-white/5 ${activeSubTab === 'inventory' ? 'bg-white text-black' : 'text-white/60'}`}>📦 Inventory Stock</button>
                                                                            <button type="button" onClick={() => setProductSubTabs({ ...productSubTabs, [pKey]: 'shipping' })} className={`p-2.5 text-left w-full border-b border-white/5 ${activeSubTab === 'shipping' ? 'bg-white text-black' : 'text-white/60'}`}>🚛 Shipping Dims</button>
                                                                            <button type="button" onClick={() => setProductSubTabs({ ...productSubTabs, [pKey]: 'variants' })} className={`p-2.5 text-left w-full border-b border-white/5 ${activeSubTab === 'variants' ? 'bg-white text-black' : 'text-white/60'}`}>⚙️ Attributes Set</button>
                                                                        </div>

                                                                        {/* Embedded Sub-Tab Viewport Workspaces */}
                                                                        <div className="col-span-12 md:col-span-9 p-4 space-y-3 bg-black/60">

                                                                            {activeSubTab === 'general' && (
                                                                                <div className="grid grid-cols-2 gap-3">
                                                                                    <div className="col-span-2">
                                                                                        <label className="text-[8px] text-white/40 block uppercase mb-1">Product Display Name</label>
                                                                                        <input type="text" value={p.name || ''} onChange={(e) => updateProductField(sIdx, pIdx, 'name', e.target.value.toUpperCase())} className="w-full bg-white/5 p-2 text-xs border border-white/10 text-white outline-none" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="text-[8px] text-white/40 block uppercase mb-1">Regular Price (INR)</label>
                                                                                        <input type="text" value={p.price || ''} onChange={(e) => updateProductField(sIdx, pIdx, 'price', e.target.value)} className="w-full bg-white/5 p-2 text-xs border border-white/10 text-white outline-none font-mono" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="text-[8px] text-white/40 block uppercase mb-1">Sale Price (INR)</label>
                                                                                        <input type="text" value={p.sale_price || ''} onChange={(e) => updateProductField(sIdx, pIdx, 'sale_price', e.target.value)} className="w-full bg-white/5 p-2 text-xs border border-white/10 text-white outline-none font-mono" placeholder="No discount active" />
                                                                                    </div>
                                                                                    <div className="col-span-2">
                                                                                        <label className="text-[8px] text-white/40 block uppercase mb-1">Grid Image File Source path</label>
                                                                                        <input type="text" value={p.img || ''} onChange={(e) => updateProductField(sIdx, pIdx, 'img', e.target.value)} className="w-full bg-white/5 p-2 text-[10px] border border-white/10 text-white/70 outline-none font-mono" />
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {activeSubTab === 'inventory' && (
                                                                                <div className="space-y-3">
                                                                                    <div className="grid grid-cols-2 gap-3">
                                                                                        <div>
                                                                                            <label className="text-[8px] text-white/40 block uppercase mb-1">Unique Ledger SKU Code</label>
                                                                                            <input type="text" value={p.sku || ''} onChange={(e) => updateProductField(sIdx, pIdx, 'sku', e.target.value.toUpperCase())} className="w-full bg-white/5 p-2 text-xs border border-white/10 text-white font-mono outline-none" />
                                                                                        </div>
                                                                                        <div>
                                                                                            <label className="text-[8px] text-white/40 block uppercase mb-1">Stock Quantity Count</label>
                                                                                            <input type="number" value={p.stock_qty !== undefined ? p.stock_qty : 0} onChange={(e) => updateProductField(sIdx, pIdx, 'stock_qty', parseInt(e.target.value) || 0)} className="w-full bg-white/5 p-2 text-xs border border-white/10 text-white font-mono outline-none" />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {activeSubTab === 'shipping' && (
                                                                                <div className="space-y-3">
                                                                                    <div>
                                                                                        <label className="text-[8px] text-white/40 block uppercase mb-1">Weight Unit Metric (KG)</label>
                                                                                        <input type="text" value={p.weight || ''} onChange={(e) => updateProductField(sIdx, pIdx, 'weight', e.target.value)} className="w-full bg-white/5 p-2 text-xs border border-white/10 text-white outline-none font-mono" placeholder="0.00" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="text-[8px] text-white/40 block uppercase mb-2">Dimensions Matrix Mapping (L × W × H) (CM)</label>
                                                                                        <div className="grid grid-cols-3 gap-2">
                                                                                            <input type="text" value={p.dimensions?.length || ''} onChange={(e) => updateProductDimension(sIdx, pIdx, 'length', e.target.value)} className="bg-white/5 p-2 border border-white/10 text-xs font-mono text-center text-white" placeholder="Length" />
                                                                                            <input type="text" value={p.dimensions?.width || ''} onChange={(e) => updateProductDimension(sIdx, pIdx, 'width', e.target.value)} className="bg-white/5 p-2 border border-white/10 text-xs font-mono text-center text-white" placeholder="Width" />
                                                                                            <input type="text" value={p.dimensions?.height || ''} onChange={(e) => updateProductDimension(sIdx, pIdx, 'height', e.target.value)} className="bg-white/5 p-2 border border-white/10 text-xs font-mono text-center text-white" placeholder="Height" />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {activeSubTab === 'variants' && (
                                                                                <div className="space-y-3">
                                                                                    <div>
                                                                                        <label className="text-[8px] text-white/40 block uppercase mb-1">Detailed Editorial Text Description</label>
                                                                                        <textarea value={p.description || ''} onChange={(e) => updateProductField(sIdx, pIdx, 'description', e.target.value)} className="w-full bg-white/5 p-2 text-[10px] border border-white/10 text-white outline-none h-12 resize-none" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="text-[8px] text-red-400 block uppercase mb-1">Critical Frontend Warning Notice Banner</label>
                                                                                        <input type="text" value={p.warning_text || ''} onChange={(e) => updateProductField(sIdx, pIdx, 'warning_text', e.target.value.toUpperCase())} className="w-full bg-red-950/10 p-2 text-[10px] border border-red-500/20 text-red-300 font-bold outline-none" />
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="text-[8px] text-white/40 block uppercase mb-1">Sizing Matrix Tokens (Comma Separated)</label>
                                                                                        <input type="text" defaultValue={p.sizes ? p.sizes.join(', ') : ''} onBlur={(e) => {
                                                                                            const tokens = e.target.value.split(',').map(t => t.trim().toUpperCase()).filter(t => t !== '');
                                                                                            updateProductField(sIdx, pIdx, 'sizes', tokens);
                                                                                        }} className="w-full bg-white/5 p-2 text-[10px] border border-white/10 font-bold tracking-widest text-white outline-none" placeholder="S, M, L, XL" />
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* VIEWPORT TAB 2: TRANSACTION INVENTORY LOGS (REAL-TIME SALES METRICS) */}
                {currentTab === 'orders' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white/[0.02] border border-white/10 p-6 flex items-center justify-between">
                                <div><p className="text-[10px] text-white/40 uppercase tracking-widest">Gross Captured Volume</p><h2 className="text-2xl font-sans font-black tracking-tight mt-1 text-white">₹{orders.filter(o => o.payment_status === 'paid').reduce((acc, current) => acc + Number(current.total || 0), 0)}</h2></div>
                                <BarChart3 size={23} className="text-white/20" />
                            </div>
                            <div className="bg-white/[0.02] border border-white/10 p-6 flex items-center justify-between">
                                <div><p className="text-[10px] text-white/40 uppercase tracking-widest">Active Processing Acquisitions</p><h2 className="text-2xl font-sans font-black tracking-tight mt-1 text-white">{orders.filter(o => o.fulfillment_status === 'unfulfilled').length} orders</h2></div>
                                <Box size={23} className="text-white/20" />
                            </div>
                            <div className="bg-white/[0.02] border border-white/10 p-6 flex items-center justify-between">
                                <div><p className="text-[10px] text-white/40 uppercase tracking-widest">Fulfillment Rate Ratio</p><h2 className="text-2xl font-sans font-black tracking-tight mt-1 text-white">{orders.length > 0 ? Math.round((orders.filter(o => o.fulfillment_status === 'delivered').length / orders.length) * 100) : 0}%</h2></div>
                                <ShoppingBag size={23} className="text-white/20" />
                            </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/10 p-5">
                            <h3 className="text-[10px] tracking-widest text-white/50 uppercase font-bold mb-4">LIVE COMPONENT ORDERS LOGSHEET</h3>
                            {orders.length === 0 ? (
                                <div className="text-center p-12 text-xs italic text-white/30">AWAITING TRANSACTIONS SYSTEM EVENTS FLOW PATHS...</div>
                            ) : (
                                <div className="space-y-3">
                                    {orders.map((order) => (
                                        <div key={order.id} className="border border-white/5 bg-black/40 p-4 grid grid-cols-1 xl:grid-cols-12 gap-4 items-center text-xs">
                                            <div className="xl:col-span-4">
                                                <span className="text-[9px] text-white/30 font-mono block">{order.id}</span>
                                                <span className="font-bold text-white block mt-1">{order.customer_email}</span>
                                            </div>
                                            <div className="xl:col-span-4">
                                                <span className="font-black text-white font-mono">Total Volume Amount: ₹{order.total}</span>
                                            </div>
                                            <div className="xl:col-span-2">
                                                <select value={order.payment_status} onChange={async (e) => { await supabase.from('orders').update({ payment_status: e.target.value }).eq('id', order.id); fetchMasterData(); }} className="w-full bg-black border border-white/10 p-2 text-[10px] outline-none font-bold tracking-widest text-white">
                                                    <option value="pending">PENDING_CLEAR</option>
                                                    <option value="paid">CAPTURE_SUCCESS</option>
                                                    <option value="failed">DENIED_REVOKED</option>
                                                </select>
                                            </div>
                                            <div className="xl:col-span-2">
                                                <select value={order.fulfillment_status} onChange={async (e) => { await supabase.from('orders').update({ fulfillment_status: e.target.value }).eq('id', order.id); fetchMasterData(); }} className="w-full bg-black border border-white/10 p-2 text-[10px] outline-none font-bold tracking-widest text-white">
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

                {/* VIEWPORT TAB 3: GATEWAY ENDPOINT CONTROLLERS */}
                {currentTab === 'gateways' && (
                    <div className="max-w-xl bg-white/[0.02] border border-white/10 p-8 space-y-6">
                        <h3 className="text-[10px] tracking-widest text-white/50 uppercase font-bold flex items-center gap-2"><CreditCard size={14} /> FINANCIAL GATEWAYS INTEGRATIONS GATE</h3>
                        <div className="border-t border-white/10 pt-6 space-y-6">
                            <div className="flex justify-between items-center bg-black/40 p-4 border border-white/5">
                                <div><p className="text-xs font-bold text-white">STRIPE DIRECT CHANNEL</p></div>
                                <input type="checkbox" checked={gateways.stripe_enabled} onChange={(e) => setGateways({ ...gateways, stripe_enabled: e.target.checked })} className="w-4 h-4 accent-white cursor-pointer" />
                            </div>
                            {gateways.stripe_enabled && (
                                <div className="space-y-1 pl-4 border-l border-white/10">
                                    <label className="text-[8px] text-white/40 uppercase">Stripe Public Publishable API Key</label>
                                    <input type="text" value={gateways.stripe_key || ''} onChange={(e) => setGateways({ ...gateways, stripe_key: e.target.value })} className="w-full bg-black border border-white/10 p-2 text-[10px] text-white font-mono outline-none" placeholder="pk_live_..." />
                                </div>
                            )}
                            <div className="flex justify-between items-center bg-black/40 p-4 border border-white/5">
                                <div><p className="text-xs font-bold text-white">CASH ON DELIVERY (COD)</p></div>
                                <input type="checkbox" checked={gateways.cod_enabled} onChange={(e) => setGateways({ ...gateways, cod_enabled: e.target.checked })} className="w-4 h-4 accent-white cursor-pointer" />
                            </div>
                        </div>
                        <button onClick={saveMasterSettings} className="w-full py-4 bg-white text-black font-black text-xs tracking-[0.4em] hover:bg-white/90 transition-all flex items-center justify-center gap-2 mt-2">
                            <Save size={13} /> SAVE_GATEWAY_CONFIG
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SdnAdmin;