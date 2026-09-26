// Encyclopedia View Component - Filterable Flag Library

import { FLAG_CATEGORIES, FLAGS_DATA } from '../data/flagsData.js';
import { renderFlagSVG } from '../utils/svgRenderer.js';

export function renderEncyclopediaView(state) {
  const { searchQuery = '', selectedCategory = FLAG_CATEGORIES.ALL } = state;

  // Filter flags logic
  const filteredFlags = FLAGS_DATA.filter(flag => {
    const matchesCategory = selectedCategory === FLAG_CATEGORIES.ALL ||
      flag.category === selectedCategory ||
      (flag.categories && flag.categories.includes(selectedCategory));
    
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const matchesName = flag.name.toLowerCase().includes(q);
    const matchesDesc = flag.description.toLowerCase().includes(q);
    const matchesTag = flag.tags.some(t => t.toLowerCase().includes(q));
    const matchesColor = flag.stripes.some(s => s.label.toLowerCase().includes(q) || s.meaning.toLowerCase().includes(q));

    return matchesName || matchesDesc || matchesTag || matchesColor;
  });

  const categoriesList = Object.values(FLAG_CATEGORIES);

  return `
    <div class="max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <span>Flag & Orientation Catalog</span>
          </div>
          <h2 class="text-3xl font-extrabold text-white tracking-tight">
            Flag Encyclopedia
          </h2>
          <p class="text-slate-400 text-sm mt-1">
            Explore ${FLAGS_DATA.length}+ pride flags, their stripe meanings, origins, and spectrum connections.
          </p>
        </div>

        <!-- Search Bar -->
        <div class="relative w-full md:w-80">
          <input
            type="text"
            id="encyclopedia-search"
            value="${searchQuery}"
            placeholder="Search flag name, color, or tag..."
            class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
          <svg class="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        ${categoriesList.map(cat => `
          <button
            class="encyclopedia-cat-btn flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }"
            data-category="${cat}"
          >
            ${cat}
          </button>
        `).join('')}
      </div>

      <div id="encyclopedia-flags-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${filteredFlags.length > 0 ? filteredFlags.map(flag => renderEncyclopediaCard(flag)).join('') : `
          <div class="col-span-full text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
            <h3 class="text-base font-bold text-slate-300">No flags found under "${selectedCategory}"</h3>
            <p class="text-xs text-slate-500">Try switching categories or clearing your search term.</p>
          </div>
        `}
      </div>

    </div>
  `;
}

function renderEncyclopediaCard(flag) {
  return `
    <div class="group bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
      
      <div>
        <!-- Perfectly Scaled Pure Vector SVG Flag Container (3:2 Aspect Ratio) -->
        <div class="w-full aspect-[3/2] relative border-b border-slate-800/80 group-hover:scale-[1.01] transition-transform duration-300 bg-slate-950 p-2 flex items-center justify-center">
          ${renderFlagSVG(flag)}
        </div>

        <!-- Content -->
        <div class="p-5 space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-[10px] font-bold tracking-wider uppercase text-purple-400">${flag.category}</span>
              <h3 class="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                ${flag.name}
              </h3>
            </div>
          </div>

          <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            ${flag.shortDesc}
          </p>

          <!-- Stripe Count & Color pills -->
          <div class="flex items-center gap-1.5 pt-1">
            <span class="text-[10px] text-slate-400 font-medium">Colors:</span>
            <div class="flex items-center gap-1">
              ${flag.stripes.map(s => `
                <div class="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-sm" style="background-color: ${s.color}" title="${s.label}"></div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Action -->
      <div class="p-4 pt-0 border-t border-slate-800/60 mt-2">
        <button
          class="view-flag-detail-btn w-full py-2 bg-slate-800/80 hover:bg-purple-600 text-slate-200 hover:text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          data-flag-id="${flag.id}"
        >
          <span>Inspect Stripe Meanings & Details</span>
          <span>→</span>
        </button>
      </div>

    </div>
  `;
}
