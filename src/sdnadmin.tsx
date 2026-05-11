import React, { useState } from 'react';

export default function SdnAdmin({ onClose }: { onClose: () => void }) {
    const [isNight, setIsNight] = useState(true); // Default to Night Mode
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");

    return (
        <div className={`min-h-screen font-mono transition-colors duration-500 ${isNight ? 'bg-[#0a0a0a] text-[#f0f0f0]' : 'bg-white text-black'}`}>
            {/* Header */}
            <div className={`flex justify-between p-8 border-b ${isNight ? 'border-zinc-800' : 'border-black'}`}>
                <div className="flex gap-4 items-center">
                    <h1 className="text-sm font-bold tracking-[0.2em]">SUPER DNA ADMIN // ARCHIVE</h1>
                    <button
                        onClick={() => setIsNight(!isNight)}
                        className={`text-[10px] px-2 py-1 border ${isNight ? 'border-zinc-700 hover:bg-zinc-800' : 'border-gray-200 hover:bg-gray-100'}`}
                    >
                        {isNight ? 'MODE: NIGHT' : 'MODE: DAY'}
                    </button>
                </div>
                <button onClick={onClose} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest ${isNight ? 'bg-white text-black' : 'bg-black text-white'}`}>
                    EXIT_SESSION
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-12">
                {/* System Injection Column */}
                <div className={`p-8 border ${isNight ? 'border-zinc-800 bg-zinc-900/30' : 'border-gray-100 bg-gray-50/50'}`}>
                    <h2 className="text-xs font-bold mb-8 underline decoration-2 underline-offset-8 uppercase tracking-widest">SYSTEM_INJECTION</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] opacity-50 block mb-2">PRODUCT_NAME</label>
                            <input
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className={`w-full bg-transparent border-b pb-2 outline-none focus:border-blue-500 transition-colors ${isNight ? 'border-zinc-700' : 'border-black'}`}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] opacity-50 block mb-2">UNIT_PRICE</label>
                            <input
                                type="text"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className={`w-full bg-transparent border-b pb-2 outline-none focus:border-blue-500 transition-colors ${isNight ? 'border-zinc-700' : 'border-black'}`}
                            />
                        </div>
                        <button className={`w-full py-4 mt-4 text-xs font-bold transition-all ${isNight ? 'bg-zinc-100 text-black hover:bg-white' : 'bg-black text-white hover:opacity-80'}`}>
                            SYNC_TO_ARCHIVE
                        </button>
                    </div>
                </div>

                {/* Active Inventory Column */}
                <div className={`p-8 border ${isNight ? 'border-zinc-800 bg-zinc-900/30' : 'border-gray-100 bg-gray-50/50'}`}>
                    <h2 className="text-xs font-bold mb-8 underline decoration-2 underline-offset-8 uppercase tracking-widest">ACTIVE_INVENTORY</h2>
                    <p className="text-xs italic opacity-40">Waiting for database bridge...</p>
                </div>
            </div>
        </div>
    );
}