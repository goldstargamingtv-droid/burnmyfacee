'use client';

import { useState } from 'react';

export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);
  const [facts, setFacts] = useState('');
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setError('');
    } else {
      setError('Upload a valid image (JPG/PNG/GIF).');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const roastMe = async () => {
    if (!preview) {
      setError('Upload a photo first!');
      return;
    }
    setLoading(true);
    setError('');
    setRoast('');

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: preview, facts }),
      });
      if (!res.ok) throw new Error('Roast failed');
      const data = await res.json();
      setRoast(data.roast || 'Grok bailed—your face is too much even for AI.');
    } catch (e) {
      setError('Roast timed out—try a smaller photo or refresh.');
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-6xl md:text-8xl font-black flame-gradient mb-4">
          BURN MY FACE
        </h1>
        <p className="text-xl mb-8 text-gray-300">
          Upload a selfie + facts. Grok destroys you. Share the pain.
        </p>

        {/* Upload Zone */}
        <div
          className="upload-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="mx-auto max-h-64 rounded-xl shadow-2xl" />
          ) : (
            <div>
              <p className="text-2xl mb-2">📸 Drop your ugly mug here or click</p>
              <p className="text-gray-400">Supports JPG, PNG, GIF</p>
            </div>
          )}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            className="hidden"
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Facts */}
        <textarea
          value={facts}
          onChange={(e) => setFacts(e.target.value)}
          placeholder="Optional: ammo for Grok (e.g., '30yo virgin, bad tattoos, cries at Disney')"
          className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl focus:border-red-500 focus:outline-none mb-6 text-lg placeholder-gray-500 resize-none"
          rows={3}
          maxLength={200}
        />

        {/* Roast Button */}
        <button onClick={roastMe} disabled={loading || !preview} className="roast-btn mb-6">
          {loading ? '🔥 ROASTING...' : 'ROAST ME 🔥'}
        </button>

        {/* Result */}
        {roast && (
          <div className="result-box">
            <h3 className="text-2xl font-bold mb-4 text-orange-500">Your Roast:</h3>
            <p className="text-lg whitespace-pre-wrap mb-4">{roast}</p>
            <button
              onClick={() => navigator.clipboard.writeText(roast) && alert('Copied! Share the L.')}
              className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Copy & Share
            </button>
          </div>
        )}

        <p className="mt-12 text-gray-500 text-sm">Powered by Grok AI • Victims today: 0 (soon to change)</p>
      </div>
    </main>
  );
}
