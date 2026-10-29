// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      // Keep the design's application identity present in every instruction mode.
      // Preserve the original title draw when this branch used to render a generic brand.
      let title = 'Files';
      if (display !== 'header' || nav) rng.pick(TITLES);
      const brand = util.el('div', 'ref-brand', header, 'Files');
      brand.dataset.role = 'brand';
      const controls = util.el('div', 'aero-window-controls', header);
      for (const [name, path] of [['Minimize', 'M5 13h10v2H5z'], ['Maximize', 'M5 5h10v10H5zM7 8v5h6V8z'], ['Close', 'M5 5l10 10m0-10L5 15']]) {
        const button = util.el('button', 'aero-window-button', controls);
        button.type = 'button'; button.title = name; button.setAttribute('aria-label', name);
        button.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="${path}" fill="${name === 'Close' ? 'none' : '#fff'}" stroke="${name === 'Close' ? '#fff' : '#536a7b'}" stroke-width="${name === 'Close' ? 2 : 1}"/></svg>`;
        button.addEventListener('click', () => env.log('window-control', { label: name }));
      }
      Object.assign(_c, { brand, header, title });
    },
    'frame.instruction': (base, S) => function (_c) {
      base(_c);
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'fm-inspector', body);
      const identity = util.el('div', 'fm-inspector-identity', inspector);
      const folderIcon = util.el('span', 'fm-folder-icon', identity);
      folderIcon.innerHTML = `<svg width="88" height="100" viewBox="0 0 88 100" aria-hidden="true"><defs><linearGradient id="inspector-gold" x2="1" y2=".3"><stop stop-color="#fff2a1"/><stop offset=".45" stop-color="#edcf64"/><stop offset="1" stop-color="#c49b38"/></linearGradient><linearGradient id="inspector-edge"><stop stop-color="#f7e89a"/><stop offset="1" stop-color="#b79031"/></linearGradient></defs><ellipse cx="45" cy="86" rx="34" ry="9" fill="#7d8389" opacity=".16"/><path d="M10 5l53 8 2 67-17 12-39-9z" fill="url(#inspector-edge)" stroke="#d1b65e"/><path d="M17 11l43 9v57l-13 10-30-10z" fill="#fff4ba"/><path d="M8 5l30 9 1 78L8 78z" fill="url(#inspector-gold)" stroke="#d3b75f"/><path d="M38 14l25 2v65L39 92z" fill="url(#inspector-gold)"/><path d="M10 7l26 9v72L11 77z" fill="none" stroke="#fff5b8"/><path d="M60 61l9 3v18l-8 5z" fill="#f3d570" stroke="#c4aa58"/><path d="M65 66l4 1v12l-4 3z" fill="#7caed2"/></svg>`;
      const folder = util.el('div', 'fm-folder-copy', identity);
      util.el('strong', '', folder, 'Folder');
      util.el('span', '', folder, 'File folder');
      const properties = util.el('div', 'fm-properties', inspector);
      for (const [key, value] of [['Date modified:', '—'], ['Type:', 'File folder'],
        ['Size:', '—'], ['Contains:', '—']]) {
        const row = util.el('div', 'fm-property', properties);
        util.el('span', '', row, key);
        util.el('span', '', row, value);
      }
      Object.assign(_c, { folder, identity, inspector, properties, stage });
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      document.querySelector('.ref-foot-text')?.remove();
      const foot = document.querySelector('.ref-foot');
      if (foot && !foot.querySelector('button, a')) foot.remove();
    },
  };

  env.site({
    name: 'design-use-file-manager-range-05',
    template: 'site/base',
    design: { parts },
  });
})();
