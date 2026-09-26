// Vector & Local Image Flag Renderer Engine - Reliable & High Definition

export function renderFlagSVG(flag) {
  if (!flag) return '';

  const width = 300;
  const height = 200;
  const stripes = flag.stripes || [
    { color: '#7C3AED' }, { color: '#FFFFFF' }, { color: '#06B6D4' }
  ];
  const numStripes = stripes.length;
  const stripeHeight = height / numStripes;

  let svgBody = '';
  stripes.forEach((stripe, i) => {
    svgBody += `<rect x="0" y="${i * stripeHeight}" width="${width}" height="${stripeHeight + 0.5}" fill="${stripe.color}" />\n`;
  });

  const fallbackSvgMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="w-full h-full rounded-lg shadow-sm">
      ${svgBody}
    </svg>
  `;

  if (flag.imageUrl) {
    return `
      <img
        src="${flag.imageUrl}"
        alt="${flag.name} Flag"
        class="w-full h-full object-contain rounded-lg shadow-sm"
        loading="lazy"
        onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='block';"
      />
      <div style="display:none" class="w-full h-full">
        ${fallbackSvgMarkup}
      </div>
    `;
  }

  return fallbackSvgMarkup;
}
