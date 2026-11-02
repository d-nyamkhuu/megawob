// Publishing studio design for the block editor: page artwork (hero, feature strip, preview) laid out in the
// editor grid next to the live block cards and inspector.
(function () {
  'use strict';
  const featureIcons = [
    '<path d="M29 4a10 10 0 0 0-12 12L3 30a4 4 0 0 0 6 6l14-14A10 10 0 0 0 36 10l-7 7-6-6z"/>',
    '<path d="M20 2 4 8v12c0 10 16 18 16 18s16-8 16-18V8z"/><path d="m12 19 6 6 11-13" fill="none" stroke="#102c4c" stroke-width="4"/>',
    '<path d="m8 7-5 13v14h6v-5h22v5h6V20L32 7zm3 4h18l3 10H8zm-2 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm28 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>',
  ];

  env.widget({
    task: 'use-site-builder',
    site: 'design-use-site-builder-blockedit-03',
    name: 'design',
    split: 'train',
    scenarios: ['blockedit'],
    template: 'use-site-builder/studio',
    design: {
      parts: {
        // Artwork belongs to the page preview; all editable blocks stay the template's own.
        rendered: (base, S) => (ctx) => {
          base(ctx);
          const el = ctx.util.el;
          const hero = el('section', 'memphis-hero', null);
          const heroCopy = el('div', 'memphis-hero-copy', hero);
          el('h1', '', heroCopy, 'Road Ready\nfor What’s Next');
          el('p', '', heroCopy, 'Trusted auto care for every mile.');
          const service = el('button', 'memphis-service', heroCopy, 'SCHEDULE SERVICE');
          service.type = 'button';
          service.addEventListener('click', () => env.log('decoy', { label: 'Schedule service' }));
          el('div', 'memphis-linked', hero, 'Image 2');
          const features = el('div', 'memphis-features', null);
          const artwork = el('div', 'memphis-feature-art', features);
          for (const [index, text] of ['Quality\nService', 'Certified\nTechnicians', 'All Makes\n& Models'].entries()) {
            const feature = el('div', '', artwork);
            el('span', '', feature).innerHTML = `<svg viewBox="0 0 40 40" aria-hidden="true" fill="currentColor">${featureIcons[index]}</svg>`;
            el('strong', '', feature, text);
          }
          el('strong', 'memphis-feature-title', features, '4. Features');
          el('span', 'memphis-feature-subtitle', features, 'Icons + Text');
          const preview = el('div', 'memphis-preview', null);
          el('div', '', preview, 'Image 2');
          S.els.app.prepend(hero, features, preview);
        },
        paint: (base, S) => (m) => {
          base(m);
          const caption = S.st.inspectName;
          if (caption) caption.textContent = caption.textContent.replace(/^Inspector\s*\/\s*/i, 'Block Properties — ');
          const status = S.els.status;
          if (/^Status:\s*Draft$/i.test(status.textContent.trim())) status.textContent = 'Unpublished changes';
        },
      },
    },
  });
})();
