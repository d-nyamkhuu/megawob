(function () {
  'use strict';
  const C = { 'site': 'design-choose-option-radio-06' };
  const ICON = {
    New: '<path d="M12 6h18l10 10v30H12z" fill="#eef" stroke="#4a4a8c" stroke-width="2"/><path d="M30 6v10h10" fill="#aab" stroke="#4a4a8c" stroke-width="2"/>',
    Open: '<path d="M6 14h14l4 4h18v24H6z" fill="#5b5bb0" stroke="#33337a" stroke-width="2"/><path d="M10 42l6-16h30l-6 16z" fill="#9aa0e8" stroke="#33337a" stroke-width="2"/>',
    Save: '<rect x="9" y="7" width="34" height="38" rx="3" fill="#4747a8" stroke="#2a2a70" stroke-width="2"/><rect x="16" y="9" width="20" height="12" fill="#e8e8ff"/><rect x="16" y="30" width="20" height="14" fill="#9aa0e8"/>',
    Customer:
      '<circle cx="26" cy="14" r="8" fill="#8b86c8" stroke="#33337a" stroke-width="2"/><path d="M8 40l18-14 18 14-18 6z" fill="#b8b8e8" stroke="#33337a" stroke-width="2"/>',
    Items:
      '<path d="M26 6l18 9v20l-18 10-18-10V15z" fill="#a8a8d8" stroke="#33337a" stroke-width="2"/><path d="M8 15l18 9 18-9M26 24v21" stroke="#33337a" stroke-width="2" fill="none"/>',
    Shipping:
      '<rect x="4" y="12" width="26" height="22" fill="#6b69b8" stroke="#2a2a70" stroke-width="2"/><path d="M30 18h10l8 8v8H30z" fill="#9a98dc" stroke="#2a2a70" stroke-width="2"/><circle cx="14" cy="38" r="4" fill="#333"/><circle cx="38" cy="38" r="4" fill="#333"/>',
    Payment:
      '<rect x="4" y="12" width="44" height="28" rx="3" fill="#5b5bb0" stroke="#2a2a70" stroke-width="2"/><rect x="4" y="18" width="44" height="6" fill="#222266"/><rect x="10" y="30" width="14" height="5" fill="#cfd0ff"/>',
    Find: '<circle cx="21" cy="21" r="13" fill="#dfe0ff" stroke="#4747a8" stroke-width="4"/><path d="M31 31l14 14" stroke="#33337a" stroke-width="6"/>',
    Reports:
      '<rect x="9" y="6" width="34" height="40" rx="2" fill="#4747a8" stroke="#2a2a70" stroke-width="2"/><path d="M15 16h22M15 24h22M15 32h22M15 40h22" stroke="#dfe0ff" stroke-width="3"/>',
    Preferences:
      '<circle cx="26" cy="26" r="16" fill="#5b5bb0" stroke="#2a2a70" stroke-width="2"/><circle cx="26" cy="26" r="16" fill="none" stroke="#5b5bb0" stroke-width="8" stroke-dasharray="6 6"/><circle cx="26" cy="26" r="6" fill="#d8d8ec"/>',
    Help: '<text x="26" y="42" text-anchor="middle" font-size="46" font-weight="bold" fill="#4747a8" font-family="sans-serif">?</text>',
  };
  const sculpt = {
    New: '<path d="M10 5h25l9 10v34H10z" fill="url(#face)" stroke="#373762"/><path d="M35 5v10h9" fill="#dad8ff" stroke="#53517b"/><path d="M14 9h18M14 19h25M14 23h25M14 27h25M14 31h25M14 35h25M14 39h25M14 43h25" stroke="#d4d0fc"/><path d="M11 6h23M11 6v42" stroke="white"/>',
    Open: '<path d="M6 44V15l5-6h12l5 6h18l-4 29z" fill="url(#face)" stroke="#302f55"/><path d="M6 44l9-23h34l-10 23z" fill="url(#dark)" stroke="#302f55"/><path d="M7 43l9-21h31M7 16l5-6h10" stroke="#f1eaff" fill="none"/><path d="M28 20l7-8h9l-8 8" fill="#c7c7e8" stroke="#575477"/>',
    Save: '<path d="M8 7l4-3h32l3 4v39H8z" fill="url(#dark)" stroke="#282844"/><path d="M12 6h29v18H12z" fill="url(#face)" stroke="#292952"/><path d="M17 6h16v16H17z" fill="#dfdcfa"/><path d="M29 7h5v12h-5z" fill="#5e568f"/><path d="M13 32h28v13H13z" fill="url(#face)" stroke="#292952"/><path d="M21 35h7v9h-7z" fill="#dedcf6" stroke="#393360"/><path d="M9 9v35M13 5h28" stroke="#e6e4ff"/>',
    Customer:
      '<path d="M8 34l24-12 13 8-4 17-18-5z" fill="url(#face)" stroke="#555078"/><path d="M32 23l13 7-4 17-10-9z" fill="url(#dark)" stroke="#51476e"/><path d="M15 33l5-10h14l6 8-13 7z" fill="url(#face)" stroke="#555078"/><circle cx="27" cy="12" r="9" fill="url(#face)" stroke="#595475"/><path d="M20 9q2-6 9-4M9 34l15 8M18 30l8 5" fill="none" stroke="#faf0ff"/>',
    Items:
      '<path d="M26 5L46 15v25L26 49 6 39V16z" fill="url(#face)" stroke="#302e50"/><path d="M26 26L46 15v25L26 49z" fill="url(#dark)" stroke="#302e50"/><path d="M6 16l20 10v23" fill="none" stroke="#625b83"/><path d="M7 16L26 6l18 9M7 17v21" fill="none" stroke="#f7edff"/>',
    Shipping:
      '<path d="M3 8h30v29H3z" fill="url(#face)" stroke="#292747" stroke-width="1.5"/><path d="M6 11h25v22H6z" fill="#b7b3e7" stroke="#46436e"/><path d="M33 16h9l8 12v9H33z" fill="url(#dark)" stroke="#292747" stroke-width="1.5"/><path d="M36 19h5l5 9H36z" fill="#cbd0e3" stroke="#2f2c52"/><path d="M3 37h47v4H3z" fill="#8c86b1" stroke="#292747"/><circle cx="13" cy="39" r="5" fill="#4d4773" stroke="#25243e"/><circle cx="40" cy="39" r="5" fill="#4d4773" stroke="#25243e"/><circle cx="13" cy="39" r="2" fill="#c9c7ed"/><circle cx="40" cy="39" r="2" fill="#c9c7ed"/><path d="M4 9h28M4 9v26" stroke="#fff3ff"/>',
    Payment:
      '<path d="M4 8l4-3h39l3 5v32H4z" fill="url(#dark)" stroke="#302a51"/><path d="M7 8h40v7H7z" fill="url(#face)"/><path d="M7 19h40v5H7z" fill="#37305c"/><path d="M10 27h13v5H10zM10 35h9" fill="#d4cff9" stroke="#d4cff9"/><path d="M33 28h12v10H33z" fill="#71669e" stroke="#40365c"/><path d="M5 10v29M9 6h36" stroke="#e6dfff"/>',
    Find: '<path d="M33 31l16 15-4 5-16-16z" fill="url(#dark)" stroke="#302b50"/><circle cx="22" cy="22" r="17" fill="url(#face)" stroke="#343052" stroke-width="1.5"/><circle cx="22" cy="22" r="12" fill="#d9d8f9" stroke="#53466f" stroke-width="2"/><path d="M10 21q0-14 14-14M12 22q0-10 10-11M35 34l11 11" fill="none" stroke="#fff7ff"/>',
    Reports:
      '<path d="M9 5h34v44H9z" fill="url(#dark)" stroke="#302a51"/><path d="M12 8h28v9H12zM12 21h28v9H12zM12 34h28v9H12z" fill="url(#face)" stroke="#413858"/><path d="M15 11h5v4h-5zM15 24h5v4h-5zM15 37h5v4h-5z" fill="#463857"/><path d="M24 12h13M24 25h13M24 38h13" stroke="#d8d1f5"/><path d="M10 6h31M10 7v40" stroke="#f3eaff"/>',
    Preferences:
      '<path d="M22 3h9v6l7 3 5-4 6 7-5 5 2 7h6v9h-7l-3 6 4 5-7 5-5-5-7 2v6h-9v-7l-6-3-5 4-6-7 5-5-2-7H0v-9h6l3-6-4-5 7-6 5 5 5-2z" transform="translate(3 0) scale(.9)" fill="url(#dark)" stroke="#282547" stroke-width="2"/><circle cx="27" cy="26" r="12" fill="url(#face)" stroke="#302a50" stroke-width="2"/><circle cx="27" cy="26" r="8" fill="#a8b0c2" stroke="#ddd4ff" stroke-width="2"/><path d="M23 5h6v6M12 13l4 3M6 24v6M16 27q-1-12 11-12" fill="none" stroke="#fff1ff"/>',
    Help: '<path d="M13 17C10 0 41 0 41 17c0 9-12 10-12 21h-9c-1-14 12-14 12-21 0-8-12-9-12 0z" fill="url(#face)" stroke="#292444" stroke-width="2"/><circle cx="24" cy="47" r="5" fill="url(#face)" stroke="#292444" stroke-width="2"/><path d="M14 14q0-9 11-10M21 36h6M21 45l4-1" fill="none" stroke="#fff1ff"/>',
  };
  const defs =
    '<defs><linearGradient id="face" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#f0eaff"/><stop offset=".28" stop-color="#bcb3f5"/><stop offset=".7" stop-color="#8980c5"/><stop offset="1" stop-color="#655998"/></linearGradient><linearGradient id="dark" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#aaa0e1"/><stop offset=".55" stop-color="#675bab"/><stop offset="1" stop-color="#3c365f"/></linearGradient><filter id="shadow" x="-30%" y="-30%" width="170%" height="170%"><feDropShadow dx="1" dy="2" stdDeviation=".7" flood-color="#373544" flood-opacity=".65"/></filter></defs>';
  const GROUPS = [
    ['File', ['New', 'Open', 'Save'], 384],
    ['Order', ['Customer', 'Items', 'Shipping', 'Payment'], 574],
    ['Tools', ['Find', 'Reports'], 310],
    ['System', ['Preferences', 'Help'], 322],
  ];
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const endLabels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const originalEnd = er.bool(0.5);
      const endPlacement = originalEnd ? 'footer' : er.pick(['toolbar', 'menu']);
      const endLabel = originalEnd ? 'Submit' : er.pick(endLabels);
      const cr = ctx.rng.fork('chrome/collide');
      const collideLabels = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = cr.bool(0.3) && collideLabels.length ? cr.pick(collideLabels) : null;
      const logDecoy = (el, label) => el.addEventListener('click', () => env.log('decoy', { label }));
      const tb = u.el('div', 'ds-title', document.body);
      const lg = u.el('div', 'ds-logo', tb);
      lg.innerHTML =
        '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="#aeb3c1" stroke="#e6e6f4"/><path d="M20 1l4 14L36 7 25 20l14 4-15 2 7 11-11-10-5 12 1-15L2 28l12-8L5 9l13 6z" fill="#dcdce5" stroke="#747886"/><path d="M20 2v36M2 20h36M7 7l26 26M7 33L33 7" stroke="#f5f3ff"/><path d="M20 5v30M5 20h30" stroke="#747886"/></svg><b>IRIS</b><span>Workstation</span>';
      u.el('div', 'ds-wtitle', tb, 'ShopEase 1.0  —  Order Entry');
      u.el('div', 'ds-wbtn', tb, '⊣');
      const mn = u.el('div', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Tools', 'Actions', 'Help'].forEach((t) => {
        const s = u.el('span', '', mn);
        s.innerHTML = '<u>' + t[0] + '</u>' + t.slice(1);
        logDecoy(s, t);
      });
      const menuTools = u.el('div', 'ds-menu-tools', mn);
      if (collide) {
        const b = u.el('button', 'ds-xtra', menuTools, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const rb = u.el('div', 'ds-ribbon', document.body);
      GROUPS.forEach((g) => {
        const gr = u.el('div', 'ds-rgroup', rb);
        gr.style.flex = g[2] + ' 1 0';
        const bs = u.el('div', 'ds-rbtns', gr);
        g[1].forEach((n) => {
          const b = u.el('div', 'ds-rbtn' + (n === 'Shipping' ? ' on' : ''), bs);
          b.innerHTML =
            '<svg viewBox="0 0 58 58">' +
            defs +
            '<g filter="url(#shadow)">' +
            sculpt[n] +
            '</g></svg><span>' +
            n +
            '</span>';
          logDecoy(b, n);
        });
        u.el('div', 'ds-rlabel', gr, g[0]);
      });
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const checkbar = u.el('div', 'ds-checkbar', content, 'Checkout  —  Shipping & Delivery');
      const main = u.el('div', 'ds-main', content);
      const left = u.el('div', 'ds-left', main);
      if (ctx.display === 'header') u.el('div', 'ds-instruction', left, ctx.instruction);
      const stage = u.el('main', 'ds-stage', left);
      u.el('div', 'ds-vsep', main);
      const right = u.el('aside', 'ds-summary', main);
      if (ctx.display === 'panel') {
        right.classList.add('ds-summary-note');
        const note = u.el('aside', 'ds-panel-note', right);
        u.el('div', 'ds-sumhead', note, 'Order instructions');
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const sm = u.el('div', 'ds-sumbox', right);
      u.el('div', 'ds-sumhead', sm, 'Order summary');
      [
        ['Item(s)', '2'],
        ['Subtotal', '$48.00'],
        ['Estimated tax', '$4.32'],
      ].forEach((r) => {
        const x = u.el('div', 'ds-sumrow', sm);
        u.el('span', '', x, r[0]);
        u.el('span', '', x, r[1]);
      });
      const tot = u.el('div', 'ds-sumrow ds-sumtot', sm);
      u.el('span', '', tot, 'Estimated total');
      u.el('span', '', tot, '$52.32');
      if (ctx.display === 'toast') {
        const n = u.el('aside', 'ds-toast', content);
        u.el('div', 'ds-instruction', n, ctx.instruction);
        content.insertBefore(n, main);
      }
      const foot = u.el('footer', 'ds-footer', document.body);
      const fi = u.el('div', 'ds-fico', foot);
      fi.innerHTML =
        '<svg viewBox="0 0 40 40">' +
        defs +
        '<path d="M2 2h36v36H2z" fill="url(#dark)" stroke="#25263f"/><path d="M4 4h32v32H4z" fill="url(#face)"/><path d="M7 7h10v10H7zM23 7h10v10H23zM7 23h10v10H7zM23 23h10v10H23z" fill="url(#dark)" stroke="#4a426e"/><path d="M9 9h5v5H9zM25 9h5v5H25zM9 25h5v5H9zM25 25h5v5H25z" fill="#b5b6d5" stroke="#e6e3ff"/><path d="M3 3h32M3 3v32" stroke="#f7f1ff"/></svg>';
      u.el('span', 'ds-fready', foot, 'Ready');
      u.el('i', 'ds-fsep', foot);
      u.el('span', 'ds-fcust', foot, 'Customer:  Alex Chen');
      u.el('span', 'ds-ford', foot, 'Order #:  100284');
      u.el('div', 'ds-fgrow', foot);
      const reset = u.el('button', 'ds-reset', foot, 'Back');
      reset.type = 'button';
      reset.addEventListener('click', () => {
        stage.querySelectorAll('input[type=radio]').forEach((el) => (el.checked = false));
      });
      const nx = u.el('button', 'ds-next', foot, 'Next');
      nx.type = 'button';
      logDecoy(nx, 'Next');
      let submit = null;
      if (!ctx.finish) {
        const parent = endPlacement === 'toolbar' ? checkbar : endPlacement === 'menu' ? menuTools : foot;
        submit = u.el(
          'button',
          'ds-submit' + (endPlacement === 'footer' ? '' : ' ds-submit-' + endPlacement),
          parent,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      u.el('i', 'ds-fsep', foot);
      u.el('span', 'ds-fdate', foot, 'Mar 12, 1997  10:24 AM');
      if (ctx.display === 'panel' && right.scrollHeight > right.clientHeight) {
        const note = right.querySelector('.ds-panel-note');
        left.insertBefore(note.querySelector('.ds-instruction'), stage);
        note.remove();
        right.classList.remove('ds-summary-note');
      }
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
