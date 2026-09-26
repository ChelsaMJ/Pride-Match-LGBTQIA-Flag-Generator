// Educational Guide Component - SAM (Split Attraction Model) & Flag Meaning Guide

export function renderGuideView() {
  return `
    <div class="max-w-4xl mx-auto space-y-10 animate-fadeIn">
      
      <!-- Header -->
      <div class="text-center space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
          <span>Educational Pride Guide</span>
        </div>
        <h2 class="text-3xl font-extrabold text-white tracking-tight">
          Understanding Orientations & Pride Flags
        </h2>
        <p class="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          Learn about the Split Attraction Model (SAM), microlabels, and recurring flag color symbolism in the LGBTQ+ community.
        </p>
      </div>

      <!-- Section 1: The Split Attraction Model (SAM) -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
        <div class="border-b border-slate-800 pb-4">
          <h3 class="text-xl font-bold text-white">The Split Attraction Model (SAM)</h3>
          <p class="text-xs text-slate-400 mt-1">Differentiating attraction modalities for clearer self-understanding</p>
        </div>

        <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">
          Many people assume sexual and romantic attraction are always aligned. However, for millions of people (especially within the Asexual and Aromantic spectrums), attraction can be experienced as <strong>distinct, separate modalities</strong>:
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <h4 class="font-bold text-pink-400 text-xs sm:text-sm">Sexual Attraction</h4>
            <p class="text-xs text-slate-400 leading-normal">
              Desire to initiate or engage in physical sexual intimacy with a specific person.
            </p>
          </div>

          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <h4 class="font-bold text-emerald-400 text-xs sm:text-sm">Romantic Attraction</h4>
            <p class="text-xs text-slate-400 leading-normal">
              Desire for romantic emotional partnership, falling in love, or dating someone.
            </p>
          </div>

          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <h4 class="font-bold text-yellow-400 text-xs sm:text-sm">Aesthetic Attraction</h4>
            <p class="text-xs text-slate-400 leading-normal">
              Appreciating someone’s beauty or appearance without desiring sex or romance.
            </p>
          </div>

          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <h4 class="font-bold text-cyan-400 text-xs sm:text-sm">Sensual & Platonic Attraction</h4>
            <p class="text-xs text-slate-400 leading-normal">
              Desire for non-sexual physical affection (hugs, cuddling) or deep friendship bonds.
            </p>
          </div>
        </div>

        <div class="bg-purple-950/30 border border-purple-800/40 rounded-xl p-4 text-xs text-purple-200">
          <strong>Example:</strong> Someone might identify as <em>Bi-romantic Asexual</em> — meaning they fall in love with people of multiple genders (Bi-romantic), but experience little to no physical sexual attraction (Asexual).
        </div>
      </div>

      <!-- Section 2: Why Are There So Many Flags & Microlabels? -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div class="border-b border-slate-800 pb-4">
          <h3 class="text-xl font-bold text-white">Why Microlabels & Specific Flags Exist</h3>
          <p class="text-xs text-slate-400 mt-1">Precision in identity helps individuals find community</p>
        </div>

        <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">
          Human identity is nuanced. Broad categories don't always capture specific experiences such as:
        </p>
        <ul class="list-disc list-inside text-xs sm:text-sm text-slate-400 space-y-2">
          <li><strong>Conditional attraction:</strong> E.g. <em>Demisexuality</em> (attraction only after a deep emotional connection).</li>
          <li><strong>Fluidity over time:</strong> E.g. <em>Abrosexuality</em> or <em>Genderfluid</em>.</li>
          <li><strong>Non-binary attraction directions:</strong> Terms like <em>Trixic</em> (non-binary attracted to women) or <em>Toric</em> (non-binary attracted to men).</li>
        </ul>
        <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">
          Microlabels and unique flags are tools for self-discovery, validating personal experiences, and helping people find peers who share similar perspectives.
        </p>
      </div>

      <!-- Section 3: Universal Flag Stripe Color Meaning Cheat-Sheet -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
        <div class="border-b border-slate-800 pb-4">
          <h3 class="text-xl font-bold text-white">Pride Flag Color Symbolism Reference</h3>
          <p class="text-xs text-slate-400 mt-1">Common recurring meanings across different pride flags</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div class="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div class="w-6 h-6 rounded-lg bg-[#800080] flex-shrink-0"></div>
            <div>
              <span class="font-bold text-white">Purple</span>
              <p class="text-slate-400">Community, ace spectrum, fluid gender, royalty.</p>
            </div>
          </div>

          <div class="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div class="w-6 h-6 rounded-lg bg-[#3DA542] flex-shrink-0"></div>
            <div>
              <span class="font-bold text-white">Green</span>
              <p class="text-slate-400">Aromantic spectrum, nature, non-binary neutrality.</p>
            </div>
          </div>

          <div class="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div class="w-6 h-6 rounded-lg bg-[#FFF433] flex-shrink-0"></div>
            <div>
              <span class="font-bold text-white">Yellow</span>
              <p class="text-slate-400">Genders beyond binary, intersex autonomy, joy.</p>
            </div>
          </div>

          <div class="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div class="w-6 h-6 rounded-lg bg-[#000000] flex-shrink-0"></div>
            <div>
              <span class="font-bold text-white">Black</span>
              <p class="text-slate-400">Asexuality, agender/absence, solidarity.</p>
            </div>
          </div>

          <div class="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div class="w-6 h-6 rounded-lg bg-[#FF218C] flex-shrink-0"></div>
            <div>
              <span class="font-bold text-white">Pink / Rose</span>
              <p class="text-slate-400">Femininity, romantic love, attraction to women.</p>
            </div>
          </div>

          <div class="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div class="w-6 h-6 rounded-lg bg-[#21B1FF] flex-shrink-0"></div>
            <div>
              <span class="font-bold text-white">Blue / Teal</span>
              <p class="text-slate-400">Masculinity, serenity, attraction to men.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}
