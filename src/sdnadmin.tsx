import React, { useState, useEffect } from 'react';
import { supabase } from "./supabaseClient";
import { Plus, Trash2, Save, X, Image as ImageIcon, Type, Layout } from 'lucide-react';

const SdnAdmin = ({ onClose }: { onClose: () => void }) => {
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState<any[]>([]);
    const [hero, setHero] = useState<any>({ title: '', subtitle: '', image_url: '' });
    const [quote, setQuote] = useState<any>({ text: '', author: '' });
    const [banners, setBanners] = useState<any[]>([]);

    useEffect(() => {
        fetchDNA();
    }, []);

    const fetchDNA = async () => {
        setLoading(true);
        const { data } = await supabase.from('site_config').select('*').single();
        if (data) {
            setSections(data.dynamic_sections || []);
            setHero(data.hero_config || { title: '', subtitle: '', image_url: '' });
            setQuote(data.quote_config || { text: '', author: '' });
            setBanners(data.banners_config || []);
        }
        setLoading(false);
    };

    const saveDNA = async () => {
        // We use upsert so that if Row 1 is missing, it creates it.
        // If it exists, it updates it.
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
            alert("SITE DNA SYNCHRONIZED");
        } else {
            console.error("Full Error Object:", error);
            alert(`SYNC ERROR: ${error.message} - ${error.details}`);
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-white italic">LOADING_DNA...</div>;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-mono">
            {/* Header */}
            <div className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-white/10 pb-8">
                <div>
                    <h1 className="text-xl tracking-[0.5em] font-black uppercase">AURHOUSE // ADMIN</h1>
                    <p className="text-[10px] text-white/30 mt-2">GLOBAL CONFIGURATION OVERRIDE</p>
                </div>
                <button onClick={onClose} className="px-8 py-3 bg-white text-black text-[10px] font-bold hover:bg-lemon transition-colors">EXIT_SESSION</button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Visual DNA */}
                <div className="lg:col-span-7 space-y-12">
                    {/* Hero Config */}
                    <section className="bg-white/5 border border-white/10 p-8 space-y-6">
                        <h3 className="text-[10px] tracking-widest text-white/40 flex items-center gap-2"><ImageIcon size={14} /> HERO_DNA</h3>
                        <input
                            value={hero.title}
                            onChange={(e) => setHero({ ...hero, title: e.target.value })}
                            className="w-full bg-transparent border-b border-white/20 py-2 text-2xl font-light outline-none focus:border-white"
                            placeholder="Hero Main Title"
                        />
                        <input
                            value={hero.image_url}
                            onChange={(e) => setHero({ ...hero, image_url: e.target.value })}
                            className="w-full bg-transparent border-b border-white/20 py-2 text-[10px] outline-none focus:border-white"
                            placeholder="Hero Image URL"
                        />
                    </section>

                    {/* Quote Config */}
                    <section className="bg-white/5 border border-white/10 p-8 space-y-6">
                        <h3 className="text-[10px] tracking-widest text-white/40 flex items-center gap-2"><Type size={14} /> PHILOSOPHY_DNA</h3>
                        <textarea
                            value={quote.text}
                            onChange={(e) => setQuote({ ...quote, text: e.target.value })}
                            className="w-full bg-transparent border-b border-white/20 py-4 text-lg italic outline-none focus:border-white h-24"
                            placeholder="Philosophy Text"
                        />
                    </section>

                    {/* Banners Config */}
                    <section className="bg-white/5 border border-white/10 p-8 space-y-6">
                        <h3 className="text-[10px] tracking-widest text-white/40 mb-4 uppercase italic">// EDITORIAL_BANNERS</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {banners.map((banner: any, idx: number) => (
                                <div key={idx} className="space-y-2">
                                    <label className="text-[8px] text-white/30 uppercase">Banner {idx + 1} Image</label>
                                    <input
                                        value={banner.img}
                                        onChange={(e) => {
                                            const newBanners = [...banners];
                                            newBanners[idx].img = e.target.value;
                                            setBanners(newBanners);
                                        }}
                                        className="w-full bg-black/40 border border-white/10 p-3 text-[9px] outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Structure DNA */}
                <div className="lg:col-span-5 space-y-12">
                    <section className="bg-white/5 border border-white/10 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[10px] tracking-widest text-white/40 flex items-center gap-2"><Layout size={14} /> SECTION_DNA</h3>
                            <button
                                onClick={() => setSections([...sections, { id: `s-${Date.now()}`, title: 'New Category', subtitle: 'Subtitle' }])}
                                className="text-[10px] border border-white/20 px-3 py-1 hover:bg-white/10"
                            >
                                +
                            </button>
                        </div>

                        <div className="space-y-6">
                            {sections.map((s, idx) => (
                                <div key={s.id} className="group relative border-l border-white/10 pl-4 py-2">
                                    <input
                                        value={s.title}
                                        onChange={(e) => {
                                            const newSections = [...sections];
                                            newSections[idx].title = e.target.value;
                                            setSections(newSections);
                                        }}
                                        className="bg-transparent text-sm block w-full outline-none mb-1 uppercase font-bold"
                                    />
                                    <input
                                        value={s.subtitle}
                                        onChange={(e) => {
                                            const newSections = [...sections];
                                            newSections[idx].subtitle = e.target.value;
                                            setSections(newSections);
                                        }}
                                        className="bg-transparent text-[10px] text-white/40 block w-full outline-none uppercase"
                                    />
                                    <button
                                        onClick={() => setSections(sections.filter(item => item.id !== s.id))}
                                        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-red-500 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Master Save Button */}
                    <button
                        onClick={saveDNA}
                        className="w-full py-8 bg-white text-black font-black text-xs tracking-[0.5em] hover:bg-lemon transition-all flex items-center justify-center gap-4"
                    >
                        <Save size={18} /> COMMIT_TO_DNA
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SdnAdmin;