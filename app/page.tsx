'use client';

import { useState } from 'react';

export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);
  const [facts, setFacts] = useState('');
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const roastMe = async () => {
    if (!preview) return;
    setLoading(true);
    setRoast('');

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: preview, facts }),
      });

      const data = await res.json();
      setRoast(data.roast || 'Grok took one look and needed therapy.');
    } catch (e) {
      setRoast('API error — try again in a sec.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">

        {/* FIRE TITLE */}
        <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-8">
          BURN MY FACE
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12">
          Drop a selfie. Spill the tea. Get absolutely destroyed by Grok.
        </p>

        {/* DRAG & DROP ZONE */}
        <div
          className="relative border-4 border-dashed border-red-600 rounded-3xl p-12 mb-8 cursor-pointer hover:border-orange-500 transition-all bg-gray-950/50 backdrop-blur"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => document.getElementById('file')?.click()}
        >
          {preview ? (
            <img src={preview} alt="Your face" className="mx-auto max-h-96 rounded-2xl shadow-2xl" />
          ) : (
            <div className="text-gray-500">
              <p className="text-3xl mb-4">Drop your mug here</p>
              <p className="text-lg">or click to upload · JPG/PNG/GIF</p>
            </div>
          )}
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
        </div>

        {/* FACTS BOX
        <textarea
          value={facts}
          onChange={(e) => setFacts(e.target.value)}
          placeholder="Optional ammo for Grok (e.g. '30, lives with mom, cries at Pixar movies')"
          className="w-full max-w-xl p-5 rounded-2xl bg-gray-900 border border-gray-800 focus:border-red-600 focus:outline-none text-lg resize-none mb-8 placeholder-gray-600"
          rows={3}
        />

        {/* ROAST BUTTON */}
        <button
          onClick={roastMe}
          disabled={loading || !preview}
          className="w-full max-w-xl py-6 text-3xl font-bold rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 transform hover:scale-105 transition-all shadow-2xl"
        >
          {loading ? 'ROASTING...' : 'ROAST ME'}
        </button>

        {/* RESULT */}
        {roast && (
          <div className="mt-12 p-8 bg-gray-900/80 rounded-3xl border border-red-800 max-w-3xl">
            <p className="text-2xl leading-relaxed whitespace-pre-wrap">{roast}</p>
            <button
              onClick={() => navigator.clipboard.writeText(roast)}
              className="mt-6 px-8 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
            >
              Copy & Share This Roast
            </button>
          </div>
        )}

        <p className="mt-16 text-gray-600 text-sm">
          Powered by Grok • No feelings were spared in the making of this app
        </p>
      </div>
    </main>
  );
}
