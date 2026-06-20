import { useState, useEffect } from 'react';
import './HeroSlider.css';


// Replace these URLs with your actual WordPress media URLs
const images = [
    "http://aurhouse-backend.local/wp-content/uploads/2026/05/cvb.jpg",
    "http://aurhouse-backend.local/wp-content/uploads/2026/05/astestyc.png",
    "http://aurhouse-backend.local/wp-content/uploads/2026/05/131c2a41a7f9a5c628df5d1e3833facb.jpg"
];

export const HeroSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Changes image every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-screen overflow-hidden">
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