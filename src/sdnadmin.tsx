import React from 'react';

export default function SdnAdmin({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-[9999] bg-white p-12 overflow-y-auto font-mono text-[11px] text-black">
            <div className="flex justify-between items-center mb-12 border-b border-black pb-6">
                <h1 className="text-xl font-black uppercase tracking-tighter">SUPER DNA ADMIN // ARCHIVE</h1>
                <button
                    onClick={() => { window.history.pushState({}, "", "/"); onClose(); }}
                    className="px-6 py-2 bg-black text-white font-bold uppercase"
                >
                    Exit_Session
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="p-8 border border-black/10 bg-zinc-50">
                    <h2 className="font-black mb-4 underline uppercase">System_Injection</h2>
                    <div className="space-y-4">
                        <input placeholder="PRODUCT_NAME" className="w-full border-b border-black/20 py-2 focus:outline-none bg-transparent" />
                        <input placeholder="UNIT_PRICE" className="w-full border-b border-black/20 py-2 focus:outline-none bg-transparent" />
                        <button className="w-full py-4 bg-black text-white font-bold uppercase mt-4">Sync_to_Archive</button>
                    </div>
                </div>
                <div className="p-8 border border-black/10">
                    <h2 className="font-black mb-4 underline uppercase">Active_Inventory</h2>
                    <p className="opacity-40 italic">Waiting for database bridge...</p>
                </div>
            </div>
        </div>
    );
}