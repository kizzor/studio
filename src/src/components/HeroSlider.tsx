import { useState, useEffect } from 'react';
import './HeroSlider.css';

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=2000"
];

const WOO_BASE = 'https://shop.turbolucent.xyz/wp-json/wc/v3';
const CK = 'ck_cc517a39cca39a046456dce78a9c222b679374bb';
const CS = 'cs_c5d998c37fb8335687cc6e066c8a1a8ea61a80bd';

export const HeroSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [images, setImages] = useState<string[]>(FALLBACK_IMAGES);

    useEffect(() => {
        const loadImages = async () => {
            try {
                const sep = `?`;
                const resp = await fetch(`${WOO_BASE}/products?per_page=100${sep}consumer_key=${CK}&consumer_secret=${CS}`);
                if (!resp.ok) return;
                const products = await resp.json();
                const collected: string[] = [];
                for (const p of products) {
                    if (p.images && p.images.length > 0) {
                        for (const img of p.images) {
                            const src = typeof img === 'string' ? img : img?.src;
                            if (src && !collected.includes(src)) collected.push(src);
                        }
                    }
                }
                if (collected.length > 0) setImages(collected.slice(0, 5));
            } catch {
                // keep fallback images
            }
        };
        loadImages();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="relative w-full h-[calc(100vh-15px)] md:h-screen overflow-hidden">
            {/* Sliding background */}
            <div
                className="absolute inset-0 transition-all duration-1000 ease-in-out bg-cover bg-center"
                style={{ backgroundImage: `url(${images[currentIndex]})` }}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3))' }} />

            {/* Text + buttons layered over hero */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-6 md:px-12">
                <span
                    style={{
                        fontSize: '10px',
                        letterSpacing: '0.4em',
                        textTransform: 'uppercase',
                        opacity: 0.9,
                        fontWeight: 700,
                        marginBottom: 12,
                        color: '#fdfdf0'
                    }}
                >
                    COLLECTION 2026
                </span>

                <h2
                    style={{
                        fontSize: 'clamp(48px, 6vw, 92px)',
                        lineHeight: 1,
                        margin: 0,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em',
                        marginBottom: 28,
                        color: '#fdfdf0'
                    }}
                >
                    AURHOUSE
                </h2>

                <div className="flex flex-row md:items-center md:justify-center gap-6 flex-wrap">
                    <button

                        onClick={() => {

                            // Anchor to the first category grid (App.tsx sets id for each grid)
                            const firstSectionEl = document.querySelector('[data-category-grid-id]') as HTMLElement | null;
                            const firstSectionId = firstSectionEl?.getAttribute('data-category-grid-id');
                            if (firstSectionId) {
                                document.getElementById(firstSectionId)?.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                // fallback: scroll past hero
                                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                            }
                        }}
                        style={{
                            padding: '14px 28px',
                            border: '1px solid rgba(253, 253, 240, 1)',
                            background: 'transparent',
                            color: '#fdfdf0',
                            textTransform: 'uppercase',
                            fontWeight: 800,
                            letterSpacing: '0.2em',
                            cursor: 'pointer',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
                        }}
                    >
                        Shop Now
                    </button>

                    <button
                        onClick={() => {
                            document.getElementById('hero-quote')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#fdfdf0',
                            textTransform: 'uppercase',
                            fontWeight: 800,
                            letterSpacing: '0.2em',
                            cursor: 'pointer',
                            paddingBottom: 6,
                            borderBottom: '1px solid rgba(253, 253, 240, 0.35)'
                        }}
                    >
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
};