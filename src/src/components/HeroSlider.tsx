import { useState, useEffect } from 'react';
import './HeroSlider.css';

const FALLBACK_IMAGES = [
    "https://img.magnific.com/free-photo/drone-flying-mountain-landscape_23-2151978666.jpg?semt=ais_test_b&w=740&q=80",
    "https://t3.ftcdn.net/jpg/05/03/21/22/360_F_503212228_a0AR42cnAoOZvr3opwpR1HDfe0okGxFj.jpg",
    "https://static.vecteezy.com/system/resources/thumbnails/056/699/882/small/a-black-and-orange-drone-flying-in-the-dark-photo.jpg",
    "https://img.magnific.com/free-photo/quadcopter-flying-nature_231208-10459.jpg?semt=ais_hybrid&w=740&q=80",
    "https://images.stockcake.com/public/7/d/c/7dccce1e-25aa-4305-ab2f-5eb442eb29bd/hovering-camera-drone-stockcake.jpg",
    "https://static.vecteezy.com/system/resources/previews/058/329/090/non_2x/a-high-tech-drone-captured-in-motion-inside-an-underground-tunnel-showcasing-advanced-technology-and-industrial-aesthetics-photo.jpg"
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
        <div className="relative w-full h-[65vh] sm:h-[75vh] md:h-[85vh] lg:h-screen overflow-hidden">
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
                    className="text-[6px] md:text-[8px] lg:text-[10px]"
                    style={{
                        letterSpacing: '0.4em',
                        textTransform: 'uppercase',
                        opacity: 0.9,
                        fontWeight: 700,
                        marginBottom: 8,
                        color: '#fdfdf0'
                    }}
                >
                    COLLECTION 2026
                </span>

                <h2
                    className="text-[28px] sm:text-[36px] md:text-[56px] lg:text-[72px] xl:text-[92px]"
                    style={{
                        lineHeight: 1,
                        margin: 0,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em',
                        marginBottom: 20,
                        color: '#fdfdf0'
                    }}
                >
                    GadgetsHub NC
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