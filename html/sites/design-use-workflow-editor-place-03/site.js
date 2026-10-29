// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        const row = util.el('div', 'ref-ov-row', box);
        const btn = (label, how, primary) => {
          if (word && K.button[label]) label = word(K.button[label]);
          const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
          b.type = 'button';
          b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
          return b;
        };
        let dismiss;
        if (kind === 'cookie') {
          if (rng.bool(0.5)) btn('Settings', null, false);
          btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
          dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
        } else if (kind === 'promo') {
          dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
          btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
        } else if (kind === 'banner') {
          dismiss = btn('Dismiss', 'close', false);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        const end = document.querySelector('[data-role="submit"]');
        const endRect = end && end.getBoundingClientRect();
        const lowerInset = endRect && endRect.top > window.innerHeight / 2 ? window.innerHeight - endRect.top + 12 : 18;
        if (kind === 'cookie' || kind === 'chat') el.style.bottom = lowerInset + 'px';
        if (kind === 'banner' || kind === 'promo') {
          el.style.top = document.querySelector('.os-toolbar').getBoundingClientRect().bottom + 'px';
          if (kind === 'promo') el.style.bottom = lowerInset + 'px';
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, nav, rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || nav) rng.pick(TITLES); // retain the scaffold's existing title draw
        const brand = util.el('div', 'ref-brand', header, 'Relayboard');
        const emblem = util.el('span', 'desk-emblem', brand);
        emblem.innerHTML =
          '<svg viewBox="0 0 36 36" fill="none" stroke="#eedaa4" stroke-width="2"><path d="M14 12 9 24m9-10 8 11M12 27h13"/><circle cx="17" cy="9" r="6"/><circle cx="8" cy="28" r="5"/><circle cx="28" cy="28" r="5"/></svg>';
        brand.dataset.role = 'brand';
        Object.assign(_c, { brand, emblem, header });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const menu = util.el('nav', 'os-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Workflow', 'Tools', 'Help']) util.el('span', '', menu, item);
        const toolbar = util.el('div', 'os-toolbar', document.body);
        for (const [icon, label] of [
          ['▤', 'New'],
          ['📂', 'Open'],
          ['↶', 'Undo'],
          ['↷', 'Redo'],
          ['⌕', 'Zoom In'],
          ['⌕', 'Zoom Out'],
          ['▣', 'Fit'],
          ['●', 'Validate'],
          ['▶', 'Run'],
        ]) {
          const item = util.el('div', 'os-tool', toolbar);
          item.dataset.tool = label;
          const glyph = util.el('span', `os-tool-icon os-tool-${label.toLowerCase().replaceAll(' ', '-')}`, item);
          const shapes = {
            'New':
              '<path d="M5 2h12l6 6v23H5z" fill="#edf8ff" stroke="#6085a1"/><path d="M17 2v7h6M8 12v16" fill="none" stroke="#adc4d3"/>',
            'Open':
              '<path d="M2 8h10l3 4h16l-3 18H2z" fill="#eab455" stroke="#ae7f2c"/><path d="M3 5h10l3 4h13v5H3z" fill="#fff1c3" stroke="#b99950"/><path d="M5 12h26l-4 17H2z" fill="#ffd37b" stroke="#c5973c"/>',
            'Undo': '<path d="M12 5v5C29-1 36 25 18 29v-7c10-4 3-15-6-8v5L2 12z" fill="#62b5ee" stroke="#2477b7"/>',
            'Redo': '<path d="M21 5v5C4-1-3 25 15 29v-7C5 18 12 7 21 14v5l10-7z" fill="#aac7dc" stroke="#7e9db6"/>',
            'Zoom In':
              '<circle cx="13" cy="12" r="9" fill="#f9ffff" stroke="#516d81" stroke-width="2.5"/><path d="m20 20 10 10" stroke="#384652" stroke-width="5"/><path d="M7 12h12m-6-6v12" stroke="#386e99" stroke-width="2"/>',
            'Zoom Out':
              '<circle cx="13" cy="12" r="9" fill="#f9ffff" stroke="#516d81" stroke-width="2.5"/><path d="m20 20 10 10" stroke="#384652" stroke-width="5"/><path d="M7 12h12" stroke="#386e99" stroke-width="2"/>',
            'Fit':
              '<rect x="3" y="2" width="27" height="29" rx="2" fill="#fff" stroke="#8192a0"/><g fill="#b8d0e0" stroke="#5f7c91"><rect x="8" y="7" width="5" height="6"/><rect x="21" y="9" width="5" height="6"/><rect x="15" y="22" width="5" height="5"/><path d="M12 11h6v14m0-13h5" fill="none"/></g>',
            'Validate':
              '<circle cx="16" cy="16" r="14" fill="#74ad46" stroke="#3c7227" stroke-width="2"/><path d="m8 16 6 6L25 9" fill="none" stroke="#fff" stroke-width="3"/>',
            'Run': '<path d="m5 2 25 14L5 30z" fill="#75b64d" stroke="#4b8137" stroke-width="2"/>',
          };
          glyph.innerHTML = '<svg viewBox="0 0 34 34" aria-hidden="true">' + shapes[label] + '</svg>';
          util.el('span', '', item, label);
        }
        // The title and inspector replace the cloned portal navigation visually.
        // Its seeded draws and handlers above and below remain intact.
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, menu, toolbar });
      },
  };

  env.site({
    name: 'design-use-workflow-editor-place-03',
    template: 'site/base',
    design: { parts },
  });
})();
