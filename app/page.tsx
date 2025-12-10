'use client';

import { useState } from 'react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [facts, setFacts] = useState('');
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setError('');
    } else {
      setError('Please upload a valid image file.');
    }
  };

  const handleRoast = async () => {
    if (!selectedFile) {
      setError('Upload a photo first!');
      return;
    }
    setLoading(true);
    setError('');
    setRoast('');

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('facts', facts);

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Roast failed—try again!');
      const data = await res.json();
      setRoast(data.roast);
    } catch (err) {
      setError('Something went wrong—check your connection or try a different photo.');
    }
    setLoading(false);
  };

  const shareRoast = () => {
    if (navigator.share) {
      navigator.share({ title: 'Get roasted!', text: roast, url: window.location.href });
    } else {
      navigator.clipboard.writeText(roast);
      alert('Roast copied to clipboard—share away!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4 text-center">
        BURN MY FACE
      </h1>
      <p className="text-lg md:text-xl mb-8 text-gray-300 text-center max-w-md">
        Drop your worst selfie and optional tea—Grok will destroy you in seconds. Guaranteed viral.
      </p>

      {/* Drag & Drop Upload */}
      <div 
        className="border-2 border-dashed border-red-500 rounded-2xl p-8 mb-6 cursor-pointer hover:border-orange-500 transition-all w-full max-w-md text-center bg-gray-800 hover:bg-gray-700"
        onClick={() => document.getElementById('fileInput')?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file?.type.startsWith('image/')) handleFileChange({ target: { files: [file] } } as any);
        }}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="max-w-full max-h-64 rounded-xl mx-auto mb-2" />
        ) : (
          <div className="text-gray-400">
            <p className="text-2xl mb-2">📸 Drop your mug here or click</p>
            <p className="text-sm">Supports JPG, PNG, GIF</p>
          </div>
        )}
        <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </div>

      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

      {/* Facts Textarea */}
      <textarea
        value={facts}
        onChange={(e) => setFacts(e.target.value)}
        placeholder="Spill the tea (optional): '30yo gamer, bad haircut, owns 12 cats'—make it brutal"
        className="w-full max-w-md p-4 rounded-xl bg-gray-800 border border-gray-600 focus:border-red-500 focus:outline-none mb-6 resize-none h-20 text-white placeholder-gray-500"
        maxLength={200}
      />

      {/* Roast Button */}
      <button
        onClick={handleRoast}
        disabled={loading || !selectedFile}
        className="w-full max-w-md py-4 px-6 text-xl font-bold rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all mb-6"
      >
        {loading ? '🔥 Cooking your roast...' : `ROAST ME ${!selectedFile ? '(Upload first)' : ''}`}
      </button>

      {/* Result */}
      {roast && (
        <div className="w-full max-w-2xl bg-gray-800 rounded-2xl p-6 border border-red-800 mb-6">
          <h3 className="text-2xl font-bold mb-4 text-orange-400">Your Destruction:</h3>
          <p className="text-lg leading-relaxed whitespace-pre-wrap mb-4">{roast}</p>
          <button
            onClick={shareRoast}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Share Roast on X/TikTok
          </button>
        </div>
      )}

      <p className="text-gray-500 text-sm mt-8 text-center">
        Powered by Grok AI • Already roasted 0 victims (it'll update soon)
      </p>
    </div>
  );
}
