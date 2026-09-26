// Customizer View Component - Hybrid Flag Builder & Exporter

import { FLAGS_DATA } from '../data/flagsData.js';

export function renderCustomizerView(customState) {
  const {
    stripes = [
      { color: '#D60270', label: 'Top Stripe' },
      { color: '#9B4F96', label: 'Middle Stripe' },
      { color: '#0038A8', label: 'Bottom Stripe' }
    ],
    symbol = 'None',
    customTitle = 'My Custom Pride Flag'
  } = customState;

  const presetSymbols = ['None', 'Heart', 'Spade', 'Infinity', 'Star', 'Venus', 'Mars', 'Trans Symbol'];

  return `
    <div class="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      
      <!-- Section Header -->
      <div class="text-center space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
          <span>Flag Customizer & Exporter</span>
        </div>
        <h2 class="text-3xl font-extrabold text-white tracking-tight">
          Blend Your Custom Pride Flag
        </h2>
        <p class="text-slate-400 text-sm max-w-xl mx-auto">
          Mix identities, add custom stripes, select emblems, and export high-resolution PNG or SVG flag images.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Flag Preview Canvas Card -->
        <div class="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-white text-base">Live Flag Preview</h3>
            <span class="text-xs text-slate-400">Ratio 3:2</span>
          </div>

          <!-- Canvas container -->
          <div class="relative w-full aspect-[3/2] rounded-xl overflow-hidden shadow-2xl border border-slate-700/60 flex flex-col group">
            <div id="flag-canvas-render" class="w-full h-full flex flex-col relative">
              ${stripes.map(s => `
                <div class="flex-1 w-full transition-colors" style="background-color: ${s.color}"></div>
              `).join('')}

              ${symbol && symbol !== 'None' ? `
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-950/80 text-xl sm:text-2xl font-bold flex items-center justify-center border-2 border-white/20 shadow-2xl backdrop-blur-sm text-white">
                    ${getSymbolCharacter(symbol)}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Flag Title Input -->
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">Flag Name / Label:</label>
            <input
              type="text"
              id="custom-flag-title"
              value="${customTitle}"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <!-- Download Action Buttons -->
          <div class="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="download-png-btn"
              class="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Export High-Res PNG</span>
            </button>

            <button
              id="download-svg-btn"
              class="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <span>Export SVG Vector</span>
            </button>
          </div>
        </div>

        <!-- Flag Controls & Preset Loader -->
        <div class="lg:col-span-5 space-y-6">
          
          <!-- Preset Flag Loader -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Load Flag Preset</h4>
            <select id="preset-flag-select" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none">
              <option value="">-- Choose a Flag to Load --</option>
              ${FLAGS_DATA.map(f => `<option value="${f.id}">${f.name}</option>`).join('')}
            </select>
          </div>

          <!-- Stripe Editor -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Stripe Colors (${stripes.length})</h4>
              <div class="flex items-center gap-2">
                <button id="add-stripe-btn" class="px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600 text-purple-200 text-xs font-medium rounded-lg border border-purple-500/30">
                  + Add Stripe
                </button>
              </div>
            </div>

            <div class="space-y-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
              ${stripes.map((s, idx) => `
                <div class="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <input
                    type="color"
                    class="stripe-color-picker w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    value="${s.color}"
                    data-index="${idx}"
                  />
                  <input
                    type="text"
                    class="stripe-label-input flex-1 bg-transparent text-xs text-slate-200 focus:outline-none"
                    value="${s.color.toUpperCase()}"
                    data-index="${idx}"
                  />
                  ${stripes.length > 2 ? `
                    <button class="remove-stripe-btn text-slate-500 hover:text-red-400 p-1 text-xs" data-index="${idx}">
                      ✕
                    </button>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Symbol Badge Selector -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Center Emblem Symbol</h4>
            <div class="grid grid-cols-4 gap-2">
              ${presetSymbols.map(sym => `
                <button
                  class="symbol-select-btn px-2 py-2 rounded-xl text-xs font-medium border transition-all ${
                    symbol === sym
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }"
                  data-symbol="${sym}"
                >
                  ${sym}
                </button>
              `).join('')}
            </div>
          </div>

        </div>

      </div>

    </div>
  `;
}

function getSymbolCharacter(symName) {
  switch (symName) {
    case 'Heart': return '♥';
    case 'Spade': return '♠';
    case 'Infinity': return '∞';
    case 'Star': return '★';
    case 'Venus': return '♀';
    case 'Mars': return '♂';
    case 'Trans Symbol': return '⚧';
    default: return '';
  }
}
