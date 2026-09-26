// Flag Detail Modal Component

import { FLAGS_DATA } from '../data/flagsData.js';
import { renderFlagSVG } from '../utils/svgRenderer.js';

export function renderFlagModal(flagId, onClose, onSelectRelated) {
  const flag = FLAGS_DATA.find(f => f.id === flagId);
  if (!flag) return '';

  return `
    <div id="flag-modal-overlay" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      <div class="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Modal Header with Official Pure Vector SVG Flag Banner -->
        <div class="relative w-full aspect-[3/2] max-h-56 bg-slate-950 p-3 flex items-center justify-center border-b border-slate-800">
          ${renderFlagSVG(flag)}

          <!-- Close Button -->
          <button id="close-modal-btn" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-950 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700/50 backdrop-blur transition-all">
            ✕
          </button>
        </div>

        <!-- Scrollable Modal Body -->
        <div class="p-6 overflow-y-auto space-y-6 scrollbar-thin">
          
          <div>
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="text-xs font-bold uppercase tracking-wider text-purple-400">${flag.category}</span>
              <span class="text-xs text-slate-500 font-mono">${flag.id}</span>
            </div>
            <h3 class="text-2xl font-extrabold text-white">${flag.name}</h3>
            <p class="text-slate-300 text-xs sm:text-sm leading-relaxed mt-2">
              ${flag.description}
            </p>
          </div>

          <!-- Symbol Description if present -->
          ${flag.symbolDescription ? `
            <div class="bg-purple-950/30 border border-purple-800/40 rounded-xl p-3 text-xs text-purple-200">
              <span class="font-bold text-white">Center Emblem Note:</span> ${flag.symbolDescription}
            </div>
          ` : ''}

          <!-- Color Stripe Meaning Breakdown -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">
              Color Symbolism Breakdown
            </h4>
            
            <div class="grid grid-cols-1 gap-2">
              ${flag.stripes.map(s => `
                <div class="flex items-center gap-3 p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                  <div class="w-8 h-8 rounded-lg border border-slate-700 flex-shrink-0 shadow" style="background-color: ${s.color}"></div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-white">${s.label}</span>
                      <span class="text-[10px] text-slate-500 font-mono">${s.color}</span>
                    </div>
                    <p class="text-xs text-slate-400 mt-0.5">${s.meaning}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Flag History & Origin -->
          ${flag.origin ? `
            <div class="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 space-y-1">
              <h4 class="text-xs font-bold text-slate-300">
                History & Origin
              </h4>
              <p class="text-xs text-slate-400 leading-relaxed">${flag.origin}</p>
            </div>
          ` : ''}

          <!-- Related Flags & Microlabels -->
          ${flag.related && flag.related.length > 0 ? `
            <div class="space-y-2">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Related Identities</h4>
              <div class="flex flex-wrap gap-2">
                ${flag.related.map(relId => {
                  const relFlag = FLAGS_DATA.find(f => f.id === relId);
                  if (!relFlag) return '';
                  return `
                    <button
                      class="related-flag-btn text-xs px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-purple-950/50 text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center gap-1.5"
                      data-flag-id="${relFlag.id}"
                    >
                      <div class="w-2.5 h-2.5 rounded-full" style="background-color: ${relFlag.stripes[0].color}"></div>
                      <span>${relFlag.name}</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

        </div>

        <!-- Footer -->
        <div class="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span class="text-xs text-slate-500">Educational resource • PrideMatch</span>
          <button id="modal-close-bottom-btn" class="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-colors">
            Close
          </button>
        </div>

      </div>

    </div>
  `;
}
