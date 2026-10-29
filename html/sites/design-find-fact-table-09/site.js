(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-table-09',
    'icons': 'Discs|Apps|Documents|Internet|Settings|Help',
    'menu': 'File|Edit|View|Record|Help',
  };
  const ICON = {
    Discs:
      '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M3 3h15l3 3v15H3z" fill="#2c4f9a" stroke="#111"/><rect x="7" y="3" width="9" height="6" fill="#ddd" stroke="#111"/><rect x="6" y="13" width="12" height="8" fill="#eee" stroke="#111"/></svg>',
    Apps: '<svg viewBox="0 0 24 24" width="28" height="26"><path d="M2 6h8l2 2h10v12H2z" fill="#f0c040" stroke="#111"/></svg>',
    Documents:
      '<svg viewBox="0 0 24 24" width="24" height="26"><path d="M5 2h10l5 5v15H5z" fill="#fff" stroke="#111"/><path d="M8 11h9M8 14h9M8 17h9" stroke="#444"/></svg>',
    Internet:
      '<svg viewBox="0 0 24 24" width="26" height="26"><circle cx="12" cy="12" r="10" fill="#1d4fb0" stroke="#111"/><path d="M2 12h20M12 2c5 5 5 15 0 20M12 2c-5 5-5 15 0 20" stroke="#bcd" fill="none"/></svg>',
    Settings:
      '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M4 20L14 10M14 4a5 5 0 1 1 6 6l-3-1-3-3z" fill="#bbb" stroke="#111" stroke-width="2"/></svg>',
    Help: '<svg viewBox="0 0 24 24" width="26" height="26"><rect x="2" y="2" width="20" height="20" fill="#fff"/><text x="12" y="19" font-size="20" font-weight="700" text-anchor="middle" fill="#222" font-family="Arial">?</text></svg>',
  };
  const DOC =
    '<svg viewBox="0 0 26 28" width="26" height="28"><g stroke="#161616" stroke-width="1"><path d="M3 3h16l4 4v18H3z" fill="#eee"/><path d="M7 2h14v20H7z" fill="#2449c4"/><path d="M10 5h6v17h-6z" fill="#6b9fff"/><path d="M14 1h6v21h-6z" fill="#ddd"/><path d="M18 6h5v14l3 5h-6l-2-6z" fill="#fff"/><path d="M5 7h3v14H5z" fill="#7db6ff"/><path d="M10 2h9M10 4h9" fill="none"/></g></svg>';
  ICON.Settings =
    '<svg viewBox="0 0 28 28" width="28" height="28"><path d="M18 2Q11 3 13 11L2 22Q0 26 5 26L17 14Q25 16 26 8L20 10L17 7L20 2Z" fill="#eee" stroke="#111" stroke-width="1.5"/><path d="M5 23L14 14" stroke="#888" stroke-width="1.5"/></svg>';
  ICON.Help =
    '<svg viewBox="0 0 24 26" width="26" height="28"><path d="M2 1h20v24H2z" fill="#f8f8ee"/><text x="12" y="23" font-size="27" font-weight="700" text-anchor="middle" fill="#ffed00" stroke="#111" stroke-width="1" font-family="Arial">?</text></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const br = u.el('span', 'ds-brand', top);
      const flower = u.el('i', 'ds-flower', br);
      flower.innerHTML =
        '<svg viewBox="0 0 40 40" width="38" height="38"><g stroke="#111" stroke-width="1.2"><path d="M18 17Q6 1 12 2Q22 0 22 15M22 17Q22 0 30 3Q35 8 26 20M25 20Q40 10 38 20L29 26M15 20Q0 9 2 20L12 26" fill="#75d728"/><path d="M17 19L8 12L5 21L13 26L8 34L18 32L21 39L26 31L35 33L30 24L35 17L25 17L21 10Z" fill="#f43355"/><path d="M11 24L2 28L10 33M28 27L34 37L36 28" fill="#487af6"/><path d="M17 18L24 18L28 24L23 29L16 27L13 22Z" fill="#fff22a"/><circle cx="21" cy="23" r="3" fill="#d22"/></g></svg>';
      u.el('b', '', br, 'RISC OS');
      C.icons.split('|').forEach((t) => {
        const it = u.el('span', 'ds-icon', top);
        const g = u.el('i', '', it);
        g.innerHTML = ICON[t];
        u.el('b', '', it, t);
      });
      u.el('span', 'ds-clock', top, 'Mon 12 Feb 1989   10:24');
      const desk = u.el('div', 'ds-desk', document.body);
      const win = u.el('div', 'ds-win', desk);
      const tb = u.el('div', 'ds-titlebar', win);
      const ti = u.el('i', '', tb);
      ti.innerHTML = DOC;
      u.el('b', '', tb, 'Staff Records');
      u.el('span', 'ds-close', tb, '✕');
      const nav = u.el('nav', 'ds-menu', win);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const endR = ctx.rng.fork('chrome/end');
      const keepEnd = !ctx.finish && !endR.bool(0.5);
      const endLabels = ctx.content.END_LABELS.map((x) =>
        typeof x === 'string' ? x : x.label || x.text || x.name || String(x),
      );
      const endLabel = keepEnd ? 'Submit' : String(endR.pick(endLabels));
      const endPlace = ctx.finish ? null : keepEnd ? 'footer' : endR.pick(['menu', 'link']);
      const makeEnd = (parent, kind, label) => {
        const tag = kind === 'link' ? 'a' : 'button';
        const b = u.el(tag, `ds-submit ds-submit-${kind}`, parent, label);
        if (tag === 'a') b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const options = [...new Set(endLabels)].filter(
          (x) => String(x).trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (options.length) collide = String(collideR.pick(options));
      }
      let submit = null;
      const menuTools = endPlace === 'menu' || collide ? u.el('span', 'ds-menu-tools', nav) : null;
      if (collide) {
        const b = u.el('button', 'ds-xtra', menuTools, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (endPlace === 'menu') submit = makeEnd(menuTools, 'menu', endLabel);
      const body = u.el('div', 'ds-body', win);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main' + (ctx.display === 'hidden' ? ' ds-hidden' : ''), content);
      const stage = u.el('main', 'ds-stage', main);
      const noteDisplay =
        ctx.display === 'panel' && window.innerWidth < 1260
          ? 'header'
          : ctx.display === 'toast' && (window.innerWidth < 1260 || window.innerHeight < 700)
            ? 'header'
            : ctx.display;
      if (noteDisplay !== 'hidden') {
        const note = u.el('aside', `ds-header-note ds-note-${noteDisplay}`, noteDisplay === 'toast' ? desk : main);
        u.el('div', 'ds-legend', note, 'Find Information');
        const instruction = u.el('div', 'ds-instruction', note, ctx.instruction);
        instruction.style.fontSize = `clamp(13px, ${Math.min(1.9, 120 / Math.max(1, instruction.textContent.length))}vw, 32px)`;
      }
      const foot = u.el('footer', 'ds-footer', main);
      if (!ctx.finish && endPlace === 'footer') submit = makeEnd(foot, 'footer', endLabel);
      const clear = u.el('button', 'ds-clear', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        stage.querySelectorAll('input[data-role="field"]').forEach((inp) => {
          inp.value = '';
          inp.dispatchEvent(new Event('input', { bubbles: true }));
        });
      });
      const pv = u.el('div', 'ds-preview', desk);
      const pt = u.el('div', 'ds-titlebar', pv);
      const pi = u.el('i', '', pt);
      pi.innerHTML = DOC;
      u.el('b', '', pt, 'Preview');
      u.el('span', 'ds-close', pt, '✕');
      const pb = u.el('div', 'ds-pvbody', pv);
      const pd = u.el('i', 'ds-pvdoc', pb);
      u.el('div', '', pb, 'No record selected');
      const wb = u.el('div', 'ds-waste', desk);
      u.el('i', '', wb);
      u.el('div', '', wb, 'Wastebasket');
      const task = u.el('footer', 'ds-taskbar', document.body);
      const tk = u.el('span', '', task);
      u.el('i', '', tk);
      u.el('b', '', tk, 'Staff Records');
      if (endPlace === 'link') {
        const linkTools = u.el('span', 'ds-task-tools', task);
        submit = makeEnd(linkTools, 'link', endLabel);
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
