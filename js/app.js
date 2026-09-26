// Main Application Controller & State Management

import { renderHeader } from './components/Header.js';
import { renderAnalyzerView } from './components/AnalyzerView.js';
import { renderEncyclopediaView } from './components/EncyclopediaView.js';
import { renderGuideView } from './components/GuideView.js';
import { renderFlagModal } from './components/FlagModal.js';
import { NaturalLanguageMatcher } from './nlp/ragEngine.js';
import { FLAGS_DATA, FLAG_CATEGORIES } from './data/flagsData.js';

class App {
  constructor() {
    this.matcher = new NaturalLanguageMatcher(FLAGS_DATA);

    this.state = {
      activeView: 'analyzer',
      analyzer: {
        currentInput: '',
        results: [],
        isAnalyzing: false
      },
      encyclopedia: {
        searchQuery: '',
        selectedCategory: FLAG_CATEGORIES.ALL
      },
      modalFlagId: null,
      mobileMenuOpen: false
    };

    this.init();
  }

  init() {
    this.render();
    this.attachGlobalListeners();
  }

  render() {
    const root = document.getElementById('app-root');
    if (!root) return;

    let viewContent = '';
    switch (this.state.activeView) {
      case 'analyzer':
        viewContent = renderAnalyzerView(this.state.analyzer);
        break;
      case 'encyclopedia':
        viewContent = renderEncyclopediaView(this.state.encyclopedia);
        break;
      case 'guide':
        viewContent = renderGuideView();
        break;
      default:
        viewContent = renderAnalyzerView(this.state.analyzer);
    }

    const modalContent = this.state.modalFlagId
      ? renderFlagModal(this.state.modalFlagId, () => this.closeModal(), (id) => this.openModal(id))
      : '';

    root.innerHTML = `
      <div class="site-shell min-h-screen text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
        <div class="site-backlight" aria-hidden="true"></div>
        <div class="ambient-particles" aria-hidden="true"></div>
        ${renderHeader(this.state.activeView)}
        
        <main class="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-8">
          ${viewContent}
        </main>

        <footer class="border-t border-white/10 py-6 text-center text-xs text-slate-500 space-y-1 bg-slate-950/45 backdrop-blur-sm">
          <p class="font-semibold text-slate-400">PrideMatch — LGBT+ Orientation & Flag Educational Finder</p>
          <p>Designed for inclusive education, self-discovery, and pride flag celebration.</p>
        </footer>

        ${modalContent}
      </div>
    `;

    this.attachViewListeners();
  }

  switchView(viewName) {
    this.state.activeView = viewName;
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openModal(flagId) {
    this.state.modalFlagId = flagId;
    this.render();
  }

  closeModal() {
    this.state.modalFlagId = null;
    this.render();
  }

  runAnalysis(text) {
    this.state.analyzer.currentInput = text;
    this.state.analyzer.isAnalyzing = true;
    this.render();

    setTimeout(() => {
      const { matches } = this.matcher.analyze(text);
      this.state.analyzer.results = matches;
      this.state.analyzer.isAnalyzing = false;
      this.render();

      // Smooth scroll to results
      const resultsElem = document.getElementById('results-section');
      if (resultsElem) {
        resultsElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 250);
  }

  attachGlobalListeners() {
    // Live stripe hover listener to update description line underneath flag
    document.addEventListener('mouseover', (e) => {
      const stripe = e.target.closest('.flag-stripe-bar');
      if (stripe) {
        const flagId = stripe.dataset.flagId;
        const label = stripe.dataset.label;
        const meaning = stripe.dataset.meaning;
        const infoElem = document.getElementById(`stripe-info-${flagId}`);
        if (infoElem && label && meaning) {
          infoElem.innerHTML = `<span class="font-bold text-purple-300">${label}:</span> ${meaning}`;
        }
      }
    });

    // Delegated click listener for header & mobile menu
    document.addEventListener('click', (e) => {
      if (e.target.closest('#nav-logo')) this.switchView('analyzer');
      if (e.target.closest('#nav-analyzer') || e.target.closest('#mobile-nav-analyzer')) this.switchView('analyzer');
      if (e.target.closest('#nav-encyclopedia') || e.target.closest('#mobile-nav-encyclopedia')) this.switchView('encyclopedia');
      if (e.target.closest('#nav-guide') || e.target.closest('#mobile-nav-guide')) this.switchView('guide');

      if (e.target.closest('#quick-quiz-btn')) {
        this.switchView('analyzer');
        this.runAnalysis("I only feel attraction after forming a deep emotional bond, and I like women and non-binary people.");
      }

      if (e.target.closest('#mobile-menu-toggle')) {
        const dropdown = document.getElementById('mobile-nav-dropdown');
        if (dropdown) dropdown.classList.toggle('hidden');
      }

      // Modal close handlers
      if (e.target.closest('#close-modal-btn') || e.target.closest('#modal-close-bottom-btn')) {
        this.closeModal();
      }
      if (e.target.id === 'flag-modal-overlay') {
        this.closeModal();
      }

      // Related flag click in modal
      const relBtn = e.target.closest('.related-flag-btn');
      if (relBtn) {
        const flagId = relBtn.dataset.flagId;
        this.openModal(flagId);
      }

      // View flag detail button
      const detailBtn = e.target.closest('.view-flag-detail-btn');
      if (detailBtn) {
        const flagId = detailBtn.dataset.flagId;
        this.openModal(flagId);
      }
    });
  }

  attachViewListeners() {
    if (this.state.activeView === 'analyzer') {
      const textInput = document.getElementById('feeling-input');
      const analyzeBtn = document.getElementById('analyze-btn');
      const clearBtn = document.getElementById('clear-input-btn');

      if (textInput) {
        textInput.addEventListener('input', (e) => {
          this.state.analyzer.currentInput = e.target.value;
        });

        textInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && e.ctrlKey) {
            this.runAnalysis(textInput.value);
          }
        });
      }

      if (analyzeBtn && textInput) {
        analyzeBtn.addEventListener('click', () => {
          this.runAnalysis(textInput.value);
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          this.state.analyzer.currentInput = '';
          this.state.analyzer.results = [];
          this.render();
        });
      }

      // Sample prompts click
      document.querySelectorAll('.sample-prompt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const prompt = btn.dataset.prompt;
          this.runAnalysis(prompt);
        });
      });

      // Trait chips click
      document.querySelectorAll('.trait-chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const traitText = btn.dataset.text;
          const current = this.state.analyzer.currentInput;
          const updated = current ? `${current} ${traitText}` : traitText;
          this.runAnalysis(updated);
        });
      });
    }

    if (this.state.activeView === 'encyclopedia') {
      const searchInput = document.getElementById('encyclopedia-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.state.encyclopedia.searchQuery = e.target.value;
          // Partial update: only re-render the flags grid, not the whole page
          // so the search input keeps focus and cursor position
          this._updateEncyclopediaGrid();
        });
      }

      document.querySelectorAll('.encyclopedia-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.state.encyclopedia.selectedCategory = btn.dataset.category;
          // Full render needed to update active tab styles
          this.render();
        });
      });
    }
  }

  _updateEncyclopediaGrid() {
    const { searchQuery, selectedCategory } = this.state.encyclopedia;

    const filteredFlags = FLAGS_DATA.filter(flag => {
      const matchesCategory = selectedCategory === FLAG_CATEGORIES.ALL ||
        flag.category === selectedCategory ||
        (flag.categories && flag.categories.includes(selectedCategory));
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        flag.name.toLowerCase().includes(q) ||
        flag.description.toLowerCase().includes(q) ||
        flag.tags.some(t => t.toLowerCase().includes(q)) ||
        flag.stripes.some(s => s.label.toLowerCase().includes(q) || s.meaning.toLowerCase().includes(q))
      );
    });

    const grid = document.getElementById('encyclopedia-flags-grid');
    if (!grid) return;

    if (filteredFlags.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
          <h3 class="text-base font-bold text-slate-300">No flags found for "${searchQuery}"</h3>
          <p class="text-xs text-slate-500">Try a different search term or clear to browse all flags.</p>
        </div>`;
      return;
    }

    grid.innerHTML = filteredFlags.map(flag => `
      <div class="group bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
        <div>
          <div class="w-full aspect-[3/2] relative border-b border-slate-800/80 group-hover:scale-[1.01] transition-transform duration-300 bg-slate-950 p-2 flex items-center justify-center">
            <img src="${flag.imageUrl}" alt="${flag.name} Flag" class="w-full h-full object-contain rounded-lg shadow-sm" loading="lazy" onerror="this.style.display='none'" />
          </div>
          <div class="p-5 space-y-3">
            <div>
              <span class="text-[10px] font-bold tracking-wider uppercase text-purple-400">${flag.category}</span>
              <h3 class="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">${flag.name}</h3>
            </div>
            <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed">${flag.shortDesc}</p>
            <div class="flex items-center gap-1.5 pt-1">
              <span class="text-[10px] text-slate-400 font-medium">Colors:</span>
              <div class="flex items-center gap-1">
                ${flag.stripes.map(s => `<div class="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-sm" style="background-color: ${s.color}" title="${s.label}"></div>`).join('')}
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 pt-0 border-t border-slate-800/60 mt-2">
          <button class="view-flag-detail-btn w-full py-2 bg-slate-800/80 hover:bg-purple-600 text-slate-200 hover:text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5" data-flag-id="${flag.id}">
            <span>Inspect Stripe Meanings &amp; Details</span><span>→</span>
          </button>
        </div>
      </div>
    `).join('');
  }
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
