
import React from 'react';
import { BannerConfig, GeneratedBanner } from '../types';

interface BannerSlotProps {
  config: BannerConfig;
  banner: GeneratedBanner;
  onGenerate: (configId: string) => void;
}

const BannerSlot: React.FC<BannerSlotProps> = ({ config, banner, onGenerate }) => {
  const isLoading = banner.status === 'loading';

  return (
    <div className="flex flex-col bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-all group">
      {/* Header Info */}
      <div className="p-4 border-b border-slate-700 bg-slate-800/50">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
          {config.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1">{config.description}</p>
      </div>

      {/* Preview Area */}
      <div className="relative aspect-[9/16] bg-slate-900 flex flex-col items-center justify-center p-4">
        {banner.status === 'idle' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto border border-slate-700 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <button
              onClick={() => onGenerate(config.id)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-colors shadow-lg shadow-blue-900/20 active:scale-95"
            >
              Generate Banner
            </button>
          </div>
        )}

        {isLoading && (
          <div className="text-center space-y-4 animate-pulse">
            <div className="relative w-16 h-16 mx-auto">
               <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-blue-400 font-medium text-sm">Crafting {config.title}...</p>
          </div>
        )}

        {banner.status === 'success' && banner.imageUrl && (
          <img 
            src={banner.imageUrl} 
            alt={config.title} 
            className="w-full h-full object-cover rounded-lg shadow-2xl"
          />
        )}

        {banner.status === 'error' && (
          <div className="text-center p-4">
            <div className="text-red-400 mb-2">⚠️</div>
            <p className="text-red-400 text-xs mb-4">{banner.error || 'Failed to generate'}</p>
            <button
              onClick={() => onGenerate(config.id)}
              className="px-4 py-2 border border-slate-600 hover:border-slate-400 rounded-lg text-xs"
            >
              Retry
            </button>
          </div>
        )}

        {/* Action Overlay for Success */}
        {banner.status === 'success' && banner.imageUrl && (
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-2">
            <a
              href={banner.imageUrl}
              download={`xox247-${config.id}.png`}
              className="px-4 py-2 bg-white text-slate-900 rounded-lg text-xs font-bold hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PNG
            </a>
            <button
              onClick={() => onGenerate(config.id)}
              className="p-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
              title="Regenerate"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerSlot;
