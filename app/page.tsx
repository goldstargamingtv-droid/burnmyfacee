'use client';

import { useState } from 'react';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [facts, setFacts] = useState('');
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRoast = async () => {
    if (!image) return;
    setLoading(true);
    const res = await fetch('/api/roast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, facts }),
    });
    const data = await res.json();
    setRoast(data.roast);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-8">BURN MY FACE</h1>
      <p className="text-xl mb-8">Upload a selfie and get roasted by AI</p>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      {image && <img src={image} alt="Preview" className="max-w-xs mb-4 rounded" />}
      <textarea
        value={facts}
        onChange={(e) => setFacts(e.target.value)}
        placeholder="Optional facts (e.g., 'I'm 30 and still live with my parents')"
        className="w-full max-w-md p-2 bg-gray-800 border border-gray-600 rounded mb-4"
      />
      <button onClick={handleRoast} disabled={loading || !image} className="px-6 py-3 bg-red-600 rounded disabled:opacity-50">
        {loading ? 'Roasting...' : 'ROAST ME 🔥'}
      </button>
      {roast && <p className="mt-8 text-lg max-w-2xl">{roast}</p>}
    </main>
  );
}
