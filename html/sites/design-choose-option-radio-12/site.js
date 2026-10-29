(function () {
  'use strict';
  const C = {
    site: 'design-choose-option-radio-12',
    appTitle: 'ShopEasy - Order Form',
    tabs: ['Home', 'Insert', 'View', 'Tools', 'Help'],
    heading: 'Place Your Order',
    hint: 'Review your order details and select a delivery option.',
  };
  const I = {
    doc: '<svg viewBox="0 0 40 48"><path d="M7 2h20l9 9v35H7z" fill="#fff" stroke="#8a9bb0" stroke-width="2"/><path d="M27 2v9h9" fill="#dde6f0" stroke="#8a9bb0" stroke-width="2"/></svg>',
    open: '<svg viewBox="0 0 44 40"><path d="M3 8h13l4 4h18v24H3z" fill="#e8b84a" stroke="#a87c1c" stroke-width="1.5"/><path d="M20 12l3-6h18l-3 8" fill="#ebcf89" stroke="#a58a50" stroke-width="1.5"/><path d="M3 36l6-18h34l-6 18z" fill="#f7d77a" stroke="#a87c1c" stroke-width="1.5"/><path d="M10 20h30M6 34l5-12" stroke="#fff2cc" stroke-width="1.5" fill="none"/></svg>',
    save: '<svg viewBox="0 0 44 44"><path d="M4 4h32l4 4v32H4z" fill="#2d63b8" stroke="#183f80" stroke-width="2"/><rect x="11" y="4" width="20" height="13" fill="#e8eef8"/><rect x="10" y="25" width="24" height="15" fill="#fff"/></svg>',
    print:
      '<svg viewBox="0 0 44 44"><rect x="10" y="2" width="24" height="18" fill="#fff" stroke="#8a97a6" stroke-width="1.5"/><rect x="2" y="17" width="40" height="23" rx="3" fill="#a3afbd" stroke="#8895a3" stroke-width="1.5"/><path d="M4 20h36v6H4" fill="#ced7e0"/><rect x="9" y="31" width="26" height="12" fill="#e6eaf0" stroke="#7f8a96"/><path d="M13 35h18M13 38h18" stroke="#99a4b0"/><circle cx="36" cy="28" r="1.5" fill="#688a98"/></svg>',
    cut: '<svg viewBox="0 0 40 44"><path d="M10 3l16 28M30 3L14 31" stroke="#8c96a3" stroke-width="3"/><circle cx="12" cy="36" r="5" fill="none" stroke="#8c96a3" stroke-width="3"/><circle cx="28" cy="36" r="5" fill="none" stroke="#8c96a3" stroke-width="3"/></svg>',
    copy: '<svg viewBox="0 0 44 44"><path d="M4 2h20l6 6v26H4z" fill="#fff" stroke="#7c8ea6" stroke-width="1.5"/><path d="M24 2v6h6M8 10h12M8 14h16M8 18h16M8 22h16M8 26h16" stroke="#8fb7db" fill="none"/><path d="M16 12h18l6 6v24H16z" fill="#fff" stroke="#7c8ea6" stroke-width="1.5"/><path d="M34 12v6h6M21 23h14M21 27h14M21 31h14M21 35h14M21 39h14" stroke="#8fb7db" fill="none"/></svg>',
    paste:
      '<svg viewBox="0 0 40 44"><rect x="4" y="6" width="26" height="34" rx="2" fill="#d9b16b" stroke="#8e723e" stroke-width="1.5"/><rect x="7" y="9" width="20" height="28" fill="#f5dfb4"/><path d="M11 9V4h4V2h5v2h4v5z" fill="#b6bec7" stroke="#637386" stroke-width="1.5"/><path d="M16 16h14l6 6v20H16z" fill="#fff" stroke="#7c8ea6" stroke-width="1.5"/><path d="M30 16v6h6M20 26h12M20 30h12M20 34h12M20 38h12" stroke="#8fb7db" fill="none"/></svg>',
    find: '<svg viewBox="0 0 44 44"><circle cx="26" cy="17" r="12" fill="#cfe4f8" stroke="#2b4f80" stroke-width="3"/><path d="M17 26L5 40" stroke="#27384f" stroke-width="6" stroke-linecap="round"/></svg>',
    spell:
      '<svg viewBox="0 0 44 48"><text x="2" y="18" font-size="18" font-weight="700" font-family="Arial" fill="#034f9e">ABC</text><path d="M8 32l9 10 22-25-19 19-9-7z" fill="#3298e0" stroke="#155593" stroke-width="1.5"/><path d="M9 32l8 8 20-22" fill="none" stroke="#75c0f3" stroke-width="1"/></svg>',
    prev: '<svg viewBox="0 0 44 48"><path d="M5 2h21l10 10v32H5z" fill="#fff" stroke="#6b7f99" stroke-width="1.5"/><path d="M26 2v10h10M9 16h17M9 20h17M9 24h17M9 28h17M9 32h17M9 36h17" stroke="#8fb7db" fill="none"/><circle cx="24" cy="29" r="11" fill="#cfe4f8" stroke="#2b4f80" stroke-width="3"/><path d="M32 38l8 8" stroke="#27384f" stroke-width="5" stroke-linecap="round"/><path d="M18 24q2-4 7-4M34 38l5 5" fill="none" stroke="#d4e8f7" stroke-width="1.5"/></svg>',
    cart: '<svg viewBox="0 0 64 64"><path d="M3 4h9l10 39h31M18 43l-3 8h39" fill="none" stroke="#748ba8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 14h45l-6 24H21z" fill="#e5edf5" stroke="#657d99" stroke-width="3"/><path d="M18 22h39M20 30h35M26 15l3 23M36 15l1 23M47 15l-2 23" stroke="#8197b1" stroke-width="2.5"/><circle cx="21" cy="57" r="5" fill="#637b99"/><circle cx="49" cy="57" r="5" fill="#637b99"/><circle cx="20" cy="56" r="2" fill="#a9bed3"/><circle cx="48" cy="56" r="2" fill="#a9bed3"/></svg>',
    info: '<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="#2f78d0" stroke="#1d4f95" stroke-width="2"/><rect x="19" y="18" width="6" height="16" fill="#fff"/><circle cx="22" cy="12" r="3.5" fill="#fff"/></svg>',
    app: '<svg viewBox="0 0 44 44"><path d="M4 4h32l4 4v32H4z" fill="#2d63b8" stroke="#183f80" stroke-width="2"/><rect x="11" y="4" width="20" height="13" fill="#e8eef8"/><rect x="10" y="25" width="24" height="15" fill="#fff"/></svg>',
  };
  // Local vector artwork: shaded materials and document rulings, with no external assets.
  Object.keys(I).forEach((key) => {
    let svg = I[key];
    const defs =
      '<defs><linearGradient id="blue-' +
      key +
      '" x2="0" y2="1"><stop stop-color="#79b7ee"/><stop offset=".45" stop-color="#267aca"/><stop offset=".5" stop-color="#0750a3"/><stop offset="1" stop-color="#328ad6"/></linearGradient><linearGradient id="paper-' +
      key +
      '" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#dceafa"/></linearGradient><linearGradient id="gold-' +
      key +
      '" x2="0" y2="1"><stop stop-color="#fff1b4"/><stop offset=".5" stop-color="#f4d382"/><stop offset="1" stop-color="#d8aa50"/></linearGradient><radialGradient id="glass-' +
      key +
      '" cx=".35" cy=".25"><stop stop-color="#fff"/><stop offset=".65" stop-color="#e3f2ff"/><stop offset="1" stop-color="#8fbada"/></radialGradient></defs>';
    svg = svg
      .replace(/(<svg[^>]*>)/, '$1' + defs)
      .replaceAll('fill="#2d63b8"', 'fill="url(#blue-' + key + ')"')
      .replaceAll('fill="#2f78d0"', 'fill="url(#blue-' + key + ')"')
      .replaceAll('fill="#fff"', 'fill="url(#paper-' + key + ')"')
      .replaceAll('fill="#f7d77a"', 'fill="url(#gold-' + key + ')"')
      .replaceAll('fill="#cfe4f8"', 'fill="url(#glass-' + key + ')"');
    if (key === 'doc')
      svg = svg.replace(
        '</svg>',
        '<path d="M11 16h20M11 20h20M11 24h20M11 28h20M11 32h20M11 36h20M11 40h20" stroke="#aac4dd" stroke-width="1"/></svg>',
      );
    if (key === 'save' || key === 'app')
      svg = svg.replace(
        '</svg>',
        '<path d="M13 29h17M13 33h17M13 37h17" stroke="#8099b5"/><rect x="25" y="6" width="4" height="9" fill="#1764ae"/><path d="M6 7v30" stroke="#79bded" stroke-width="2"/></svg>',
      );
    if (key === 'prev')
      svg = svg.replace('</svg>', '<path d="M11 15h15M11 18h11M11 21h4M11 37h12M11 40h16" stroke="#8eb5d8"/></svg>');
    I[key] = svg;
  });
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const win = u.el('div', 'ds-win', document.body);
      const tb = u.el('div', 'ds-title', win);
      u.el('span', 'ds-appicon', tb).innerHTML = I.app;
      u.el('span', 'ds-ttext', tb, C.appTitle);
      const wb = u.el('div', 'ds-wbtns', tb);
      u.el('span', 'ds-wb', wb, '▁');
      u.el('span', 'ds-wb', wb, '▢');
      u.el('span', 'ds-wb ds-x', wb, '✕');
      const tabs = u.el('div', 'ds-tabs', win);
      C.tabs.forEach((t, i) => u.el('span', 'ds-tab' + (i === 0 ? ' on' : ''), tabs, t));
      const rib = u.el('div', 'ds-ribbon', win);
      const group = (name, items, cls) => {
        const g = u.el('div', 'ds-group ' + (cls || ''), rib);
        const row = u.el('div', 'ds-items', g);
        items.forEach((it) => {
          if (it === '|') {
            u.el('span', 'ds-sep', row);
            return;
          }
          const b = u.el('div', 'ds-btn' + (it[2] ? ' off' : ''), row);
          u.el('span', 'ds-ico', b).innerHTML = I[it[1]];
          const l = u.el('span', 'ds-bl', b);
          l.textContent = it[0];
        });
        u.el('div', 'ds-gname', g, name);
        return g;
      };
      group('File', [['New Order', 'doc'], ['Open', 'open'], ['Save', 'save'], '|', ['Print', 'print', 1]]);
      group('Edit', [
        ['Cut', 'cut', 1],
        ['Copy', 'copy'],
        ['Paste', 'paste'],
      ]);
      group('Review', [
        ['Find', 'find'],
        ['Spelling', 'spell'],
      ]);
      const act = group('Actions', [['Preview', 'prev']], 'ds-actions');
      const body = u.el('div', 'ds-body', win);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const head = u.el('div', 'ds-brief', main);
      const h = u.el('div', 'ds-h', head);
      u.el('span', 'ds-cart', h).innerHTML = I.cart;
      u.el('h1', '', h, C.heading);
      if (ctx.display === 'header') u.el('div', 'ds-instruction', head, ctx.instruction);
      if (ctx.display === 'panel') {
        const note = u.el('aside', 'ds-task-panel', head);
        u.el('strong', '', note, 'Task');
        u.el('div', 'ds-panel-instruction', note, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', main);
      if (ctx.display === 'toast') {
        const n = u.el('aside', 'ds-toast', content);
        u.el('div', 'ds-instruction', n, ctx.instruction);
        content.insertBefore(n, main);
      }
      const endR = ctx.rng.fork('chrome/end');
      const placement = endR.pick(['footer', 'footer', 'footer', 'ribbon', 'ribbon', 'link']);
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabel = endR.bool(0.5) ? 'Submit' : labelOf(endR.pick(labels));
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideR.bool(0.3)) {
        const options = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length)
          collide = { label: labelOf(collideR.pick(options)), where: collideR.pick(['ribbon', 'footer']) };
      }
      const decoy = (parent, text, isCollide) => {
        const b = u.el('button', 'ds-xtra' + (isCollide ? ' ds-pq' : ''), parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      const endButton = (parent, cls, text) => {
        const b = u.el(cls === 'ds-end-link' ? 'a' : 'button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;
      if (!ctx.finish && placement === 'ribbon') submit = endButton(rib, 'ds-ribbon-end', endLabel);
      if (collide && collide.where === 'ribbon') decoy(rib, collide.label, true);
      const foot = u.el('footer', 'ds-footer', win);
      u.el('span', 'ds-info', foot).innerHTML = I.info;
      u.el('span', 'ds-hint', foot, C.hint);
      const pv = u.el('button', 'ds-prev', foot, 'Preview Order');
      pv.type = 'button';
      if (!ctx.finish && placement === 'footer') submit = endButton(foot, 'ds-submit', endLabel);
      if (!ctx.finish && placement === 'link') submit = endButton(foot, 'ds-end-link', endLabel);
      if (collide && collide.where === 'footer') decoy(foot, collide.label, true);
      const reset = u.el('button', 'ds-reset', foot, 'Cancel');
      reset.type = 'button';
      reset.addEventListener('click', () => {
        stage.querySelectorAll('input[type=radio]').forEach((el) => (el.checked = false));
      });
      const sb = u.el('div', 'ds-status', win);
      u.el('span', '', sb, 'Ready');
      const z = u.el('span', 'ds-zoom', sb);
      u.el('span', '', z, '100%');
      u.el('span', 'ds-zm', z, '−');
      u.el('span', 'ds-track', z).appendChild(document.createElement('i'));
      u.el('span', 'ds-zm', z, '+');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
