// Analyzer View Component - Natural Language Feeling Matcher

import { renderFlagSVG } from '../utils/svgRenderer.js';

export function renderAnalyzerView(state) {
  const { currentInput = '', results = [], isAnalyzing = false } = state;

  const samplePrompts = [
    "I am attracted to women and non-binary people, but only after forming a deep emotional bond.",
    "I don't experience sexual attraction, but I love romantic relationships and cuddles.",
    "My gender identity changes over time. Some days I feel like a boy, other days non-binary or a girl.",
    "I am attracted to people of all genders regardless of their gender identity.",
    "I feel sexual attraction very rarely and weakly, mostly I feel asexual.",
    "I enjoy reading erotic fiction and romantic fantasies, but I don't want to participate in real life sex.",
    "I am a man who experiences romantic and sexual attraction to other men."
  ];

  const traitChips = [
    { label: "Emotional Bond First", text: "I can only feel attraction after forming a deep emotional bond." },
    { label: "No Sexual Attraction", text: "I feel no sexual attraction to anyone." },
    { label: "No Romantic Crushes", text: "I don't experience romantic attraction or crushes." },
    { label: "Attracted to Women", text: "I am attracted to women and feminine people." },
    { label: "Attracted to Men", text: "I am attracted to men and masculine people." },
    { label: "Attracted to All Genders", text: "I am attracted to people of all genders regardless of gender." },
    { label: "Gender Shifts / Fluid", text: "My gender identity is fluid and shifts over time." },
    { label: "Neither Boy nor Girl", text: "My gender is outside male and female binary." },
    { label: "Fantasies Only (Ace)", text: "I like romantic/sexual fantasies in fiction but not in real life." }
  ];

  return `
    <div class="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      <!-- Hero Header section -->
      <div class="text-center space-y-3 pt-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <span>Client-Side Semantic Search</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Describe How You Feel
        </h2>
        <p class="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Type your attraction, gender experience, or feelings in plain language to discover potential flags, identities, and microlabels.
        </p>
      </div>

      <!-- Natural Text Input Box -->
      <div class="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
        <div class="flex items-center justify-between mb-2">
          <label for="feeling-input" class="text-xs font-bold uppercase tracking-wider text-slate-400">
            Express Your Feeling
          </label>
          <span class="text-[11px] text-slate-500">Type freely or select a prompt below</span>
        </div>

        <div class="relative">
          <textarea
            id="feeling-input"
            rows="4"
            class="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm sm:text-base resize-none transition-all leading-relaxed"
            placeholder="e.g. 'I am attracted to women and enbies, but I never feel physical attraction unless I am very close friends first...'"
          >${currentInput}</textarea>
          
          <div class="absolute bottom-3 right-3 flex items-center gap-2">
            ${currentInput ? `
              <button id="clear-input-btn" class="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors">
                Clear
              </button>
            ` : ''}
            <button id="analyze-btn" class="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2">
              <span>Analyze Feeling</span>
            </button>
          </div>
        </div>

        <!-- Trait Quick Selectors -->
        <div class="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
          <p class="text-xs font-semibold text-slate-400">Quick attribute selectors:</p>
          <div class="flex flex-wrap gap-2">
            ${traitChips.map(chip => `
              <button
                class="trait-chip-btn text-xs px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-purple-950/50 text-slate-300 hover:text-purple-200 border border-slate-800 hover:border-purple-500/40 transition-all text-left"
                data-text="${chip.text}"
              >
                ${chip.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Sample Prompts Carousel -->
        <div class="mt-4 pt-3 flex items-center justify-between text-xs text-slate-500">
          <span class="font-medium text-slate-400">Example prompts:</span>
        </div>
        <div class="mt-2 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          ${samplePrompts.map((prompt, idx) => `
            <button
              class="sample-prompt-btn flex-shrink-0 max-w-xs text-xs px-3 py-2 rounded-xl bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-left transition-all line-clamp-2"
              data-prompt="${prompt.replace(/"/g, '&quot;')}"
            >
              "${prompt}"
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Results Display Section -->
      <div id="results-section" class="space-y-6">
        ${renderResultsSection(results, isAnalyzing, currentInput)}
      </div>

    </div>
  `;
}

function renderResultsSection(results, isAnalyzing, currentInput) {
  if (isAnalyzing) {
    return `
      <div class="text-center py-16 space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800">
        <div class="inline-block animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"></div>
        <h3 class="text-base font-bold text-white">Analyzing your input...</h3>
        <p class="text-slate-400 text-xs">Matching semantic traits against the identity database...</p>
      </div>
    `;
  }

  if (!currentInput && (!results || results.length === 0)) {
    return `
      <div class="text-center py-12 px-4 rounded-2xl bg-slate-900/30 border border-slate-800/60 space-y-2">
        <h3 class="text-base font-bold text-slate-300">Ready to explore flags</h3>
        <p class="text-slate-400 text-xs max-w-md mx-auto">
          Type how you feel above, or click one of the quick attribute chips to discover matching sexual orientations, romantic identities, and gender flags.
        </p>
      </div>
    `;
  }

  if (results && results.length === 0) {
    return `
      <div class="text-center py-12 px-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
        <h3 class="text-base font-bold text-slate-200">No exact matches found</h3>
        <p class="text-slate-400 text-xs max-w-md mx-auto">
          Try expanding your description or using broader terms like "attracted to women", "emotional bond", "no sexual attraction", or "fluid".
        </p>
      </div>
    `;
  }

  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between px-1">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <span>Matched Flags & Identities</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">
            ${results.length} result${results.length > 1 ? 's' : ''}
          </span>
        </h3>
        <span class="text-xs text-slate-400">Hover or click stripes to view color symbolism</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${results.map(result => renderMatchCard(result)).join('')}
      </div>
    </div>
  `;
}

function renderMatchCard(matchResult) {
  const { item, confidence, reasons } = matchResult;
  const numStripes = item.stripes.length;

  return `
    <div class="group relative bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-5 shadow-xl transition-all duration-200 flex flex-col justify-between">
      
      <div>
        <!-- Flag Header & Confidence Badge -->
        <div class="flex items-start justify-between gap-3 mb-3">
          <div>
            <span class="text-[10px] font-bold tracking-wider uppercase text-purple-400">${item.category}</span>
            <h4 class="text-xl font-extrabold text-white group-hover:text-purple-300 transition-colors">
              ${item.name}
            </h4>
          </div>
          <div class="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
            <span>${confidence}% Match</span>
          </div>
        </div>

        <!-- Perfectly Scaled Pure SVG Vector Flag Graphic -->
        <div class="my-4 space-y-2">
          <div class="relative w-full aspect-[3/2] rounded-xl overflow-hidden border border-slate-700/60 shadow-md bg-slate-950 p-2 flex items-center justify-center">
            ${renderFlagSVG(item)}
          </div>

          <!-- Color Symbolism Hover Bar -->
          <div class="relative h-7 w-full flex flex-col cursor-pointer border border-slate-700/50 rounded-lg shadow-inner">
            ${item.stripes.map((stripe, idx) => {
              const isTop = idx === 0;
              const isBottom = idx === numStripes - 1;
              const roundedClass = isTop ? 'rounded-t-[6px]' : isBottom ? 'rounded-b-[6px]' : '';

              return `
                <div
                  class="flag-stripe-bar flex-1 relative group/stripe transition-all hover:brightness-110 ${roundedClass}"
                  style="background-color: ${stripe.color}"
                  data-color="${stripe.color}"
                  data-label="${stripe.label}"
                  data-meaning="${stripe.meaning.replace(/"/g, '&quot;')}"
                  data-flag-id="${item.id}"
                >
                  <div class="opacity-0 group-hover/stripe:opacity-100 pointer-events-none absolute left-1/2 -translate-x-1/2 -top-10 z-50 bg-slate-950 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-2xl border border-purple-500/50 whitespace-nowrap transition-all duration-150">
                    <span class="font-bold text-purple-300">${stripe.label}:</span> <span>${stripe.meaning}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          
          <p id="stripe-info-${item.id}" class="text-[11px] text-slate-400 text-center font-medium transition-colors">
            Hover or click any stripe color above to view its symbolism
          </p>
        </div>

        <!-- Short Description -->
        <p class="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
          ${item.shortDesc}
        </p>

        <!-- NLP Match Explanation -->
        <div class="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 mb-4 space-y-1.5">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
            Why this matched:
          </div>
          <ul class="text-xs text-slate-300 space-y-1">
            ${reasons.length > 0
              ? reasons.map(r => `<li class="flex items-start gap-1.5"><span class="text-purple-400">•</span> <span>${r}</span></li>`).join('')
              : `<li class="flex items-start gap-1.5"><span class="text-purple-400">•</span> <span>Matches general semantic keywords in your input.</span></li>`
            }
          </ul>
        </div>
      </div>

      <!-- Footer Buttons & SAM tags -->
      <div class="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <div class="flex flex-wrap gap-1">
          ${item.sam && item.sam.map(s => `
            <span class="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              ${s.toUpperCase()}
            </span>
          `).join('')}
        </div>

        <button
          class="view-flag-detail-btn px-3 py-1.5 text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/50 rounded-lg transition-all flex items-center gap-1"
          data-flag-id="${item.id}"
        >
          <span>Inspect Flag Details</span>
          <span>→</span>
        </button>
      </div>

    </div>
  `;
}
