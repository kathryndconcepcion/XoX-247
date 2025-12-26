
import React, { useState, useCallback } from 'react';
import { BannerStyle, BannerConfig, GeneratedBanner } from './types';
import { generateBannerImage } from './services/geminiService';
import BannerSlot from './components/BannerSlot';

const BANNER_CONFIGS: BannerConfig[] = [
  {
    id: 'cyber',
    style: BannerStyle.CYBER,
    title: 'Futuristic Neon Cyber',
    description: 'Dark gradient, neon pink/blue accents, 3D icons, particle effects.'
  },
  {
    id: 'minimal',
    style: BannerStyle.MINIMAL,
    title: 'Minimal Flat Design',
    description: 'Light gray background, geometric icons, clean typography.'
  },
  {
    id: 'luxury',
    style: BannerStyle.LUXURY,
    title: 'Luxury Gold / Premium',
    description: 'Dark metallic theme, gold accents, premium serif fonts.'
  },
  {
    id: 'cartoon',
    style: BannerStyle.CARTOON,
    title: 'Cartoon / Playful',
    description: 'Bright colorful background, bold rounded fonts, engaging style.'
  }
];

const App: React.FC = () => {
  const [banners, setBanners] = useState<Record<string, GeneratedBanner>>(() => {
    const initial: Record<string, GeneratedBanner> = {};
    BANNER_CONFIGS.forEach(config => {
      initial[config.id] = { configId: config.id, imageUrl: null, status: 'idle' };
    });
    return initial;
  });

  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  const handleGenerate = useCallback(async (configId: string) => {
    const config = BANNER_CONFIGS.find(c => c.id === configId);
    if (!config) return;

    setBanners(prev => ({
      ...prev,
      [configId]: { ...prev[configId], status: 'loading', error: undefined }
    }));

    try {
      const url = await generateBannerImage(config.style);
      setBanners(prev => ({
        ...prev,
        [configId]: { ...prev[configId], status: 'success', imageUrl: url }
      }));
    } catch (err) {
      setBanners(prev => ({
        ...prev,
        [configId]: { 
          ...prev[configId], 
          status: 'error', 
          error: err instanceof Error ? err.message : 'Unknown error' 
        }
      }));
    }
  }, []);

  const handleGenerateAll = async () => {
    setIsGeneratingAll(true);
    // Use Promise.all for faster execution or sequential for stability
    // Let's do parallel with a slight delay between requests for reliability
    const tasks = BANNER_CONFIGS.map(async (config) => {
      await handleGenerate(config.id);
    });
    await Promise.all(tasks);
    setIsGeneratingAll(false);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Navigation / Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-xl tracking-tighter">
              XOX
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">Banner Architect</h1>
              <p className="text-xs text-slate-400 font-medium">9:16 Vertical Promotional Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col text-right mr-4">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Policy Compliance</span>
              <span className="text-[11px] text-green-500 font-semibold flex items-center justify-end gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Safe Visuals Enabled
              </span>
            </div>
            <button
              onClick={handleGenerateAll}
              disabled={isGeneratingAll}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all ${
                isGeneratingAll 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] shadow-lg shadow-blue-900/30'
              }`}
            >
              {isGeneratingAll ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                  </svg>
                  Generate All Styles
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BANNER_CONFIGS.map(config => (
            <BannerSlot
              key={config.id}
              config={config}
              banner={banners[config.id]}
              onGenerate={handleGenerate}
            />
          ))}
        </div>

        {/* Info Footer */}
        <section className="mt-16 bg-slate-800/40 rounded-3xl p-8 border border-slate-700/50">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Design Guidelines</h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Our automated banner generation adheres to strict social media advertising policies. We exclude all forms of physical currency, 
              gambling outcome claims, or misleading financial promises. Each design focuses on the entertainment aspect of gaming 
              across four key categories: Live, Slots, Sports, and Arcade.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                <div className="text-blue-500 font-bold mb-1">9:16 AR</div>
                <p className="text-xs text-slate-500">Perfectly optimized for Reels, Stories, and TikTok placement.</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                <div className="text-blue-500 font-bold mb-1">XOX247 Core</div>
                <p className="text-xs text-slate-500">Unified branding across all styles with consistent CTA placement.</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                <div className="text-blue-500 font-bold mb-1">Policy Safe</div>
                <p className="text-xs text-slate-500">Includes mandatory 18+ warnings and responsible play messaging.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-12 text-center text-slate-600 text-[10px] uppercase tracking-[0.2em] font-medium">
        &copy; {new Date().getFullYear()} XOX247 Creative Suite | Powered by Gemini 2.5 Pro Image
      </footer>
    </div>
  );
};

export default App;
