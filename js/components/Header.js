// Header and Navigation Component

export function renderHeader(activeView = 'analyzer', onNavigate, onSearch) {
  return `
    <header class="sticky top-0 z-40 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        <!-- Logo & Title -->
        <div class="flex items-center gap-3 cursor-pointer group" id="nav-logo">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 p-[1.5px] shadow-sm group-hover:scale-105 transition-transform duration-200">
            <div class="w-full h-full bg-slate-950 rounded-[9.5px] flex items-center justify-center">
              <svg class="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
              </svg>
            </div>
          </div>
          <div>
            <h1 class="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              PrideMatch
            </h1>
            <p class="text-[10px] text-slate-400 font-medium tracking-wide">Identity & Flag Explorer</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
          <button id="nav-analyzer" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeView === 'analyzer'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }">
            Feeling Analyzer
          </button>
          
          <button id="nav-encyclopedia" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeView === 'encyclopedia'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }">
            Flag Encyclopedia
          </button>

          <button id="nav-guide" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeView === 'guide'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }">
            SAM & Flag Guide
          </button>
        </nav>

        <!-- Right Action Button & Mobile Menu Trigger -->
        <div class="flex items-center gap-2">
          <button id="quick-quiz-btn" class="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-slate-800 text-slate-200 border border-slate-700/60 rounded-lg hover:bg-slate-700/60 transition-colors">
            <span>Try Sample Input</span>
          </button>

          <!-- Mobile Nav Menu -->
          <div class="flex md:hidden">
            <button id="mobile-menu-toggle" class="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Dropdown -->
      <div id="mobile-nav-dropdown" class="hidden md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-2">
        <button id="mobile-nav-analyzer" class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeView === 'analyzer' ? 'bg-purple-600 text-white' : 'text-slate-300'}">Feeling Analyzer</button>
        <button id="mobile-nav-encyclopedia" class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeView === 'encyclopedia' ? 'bg-purple-600 text-white' : 'text-slate-300'}">Flag Encyclopedia</button>
        <button id="mobile-nav-guide" class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeView === 'guide' ? 'bg-purple-600 text-white' : 'text-slate-300'}">SAM & Flag Guide</button>
      </div>
    </header>
  `;
}
