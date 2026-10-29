(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-color-05',
    'task': 'read-figure',
    'scenario': 'color',
    'style': 'os2',
    'layout': 'perimeter',
  };
  const ICONS = {
    Programs:
      '<g stroke="#111" stroke-width="1.3" stroke-linejoin="round"><path d="M12 8V5l3-3h8l3 3v5M14 8V6h10v4" fill="#eee"/><path d="M7 8h18l3 4v17H7z" fill="#999"/><path d="M3 7h17l4 4v16H3z" fill="#eee"/><path d="M6 9h15v15H6z" fill="#bbb"/><path d="M9 11h18l3 4v16H9z" fill="#ddd"/><path d="M12 13h15v15H12z" fill="#c4c4c4"/><path d="M13 14h12M13 15v11" stroke="#fff"/><path d="M21 25h9v6h-9z" fill="#888"/><path d="M23 27h5" stroke="#fff"/></g>',
    Assistance:
      '<g stroke="#111" stroke-width="1.3" stroke-linejoin="round"><path d="M3 10V6l3-3h8l4 5h11v23H3z" fill="#eee"/><path d="M4 10h25v20H4z" fill="#999"/><path d="M5 11h23v17H5z" fill="#c4c4c4"/><path d="M5 11h23L5 25z" fill="#d4d4d4" stroke="none"/><path d="M4 10h24M4 10v19" stroke="#fff"/></g>',
    Settings:
      '<g stroke="#111" stroke-width="1.2"><path d="M4 2h25v30H4z" fill="#888"/><path d="M5 3h22v27H5z" fill="#ddd"/><path d="M7 5h18v23H7z" fill="#bbb" stroke="#eee"/><path d="M9 9h14M9 13h14M9 17h14M9 21h14M9 25h12" stroke-width="1.5"/></g>',
    Shredder:
      '<g stroke="#111" stroke-width="1.3"><path d="M7 9l3 22q7 4 14-1l3-21" fill="#aaa"/><path d="M10 12l2 17M14 13l1 17" stroke="#fff"/><path d="M22 12l-1 18" stroke="#555"/><ellipse cx="17" cy="9" rx="11" ry="4" fill="#ddd"/><ellipse cx="17" cy="8" rx="7" ry="2" fill="#888"/><path d="M12 5V3h9v3l-3 2h-4z" fill="#ddd"/><path d="M10 10q6 3 15 0" fill="none" stroke="#fff"/></g>',
    View: '<g stroke="#111" stroke-width="1.4"><path d="M3 2h27v23H3z" fill="#ddd"/><path d="M5 4h23v18H5z" fill="#777"/><path d="M7 6h19v14H7z" fill="#07356f"/><path d="M8 17l15-10-7 11z" fill="#257d9a" stroke="none"/><path d="M11 15l10-8-5 8z" fill="#497bc2" stroke="none"/><path d="M14 25v5h8M11 31h14" fill="none"/><path d="M4 3h25M4 3v21" stroke="#fff"/></g>',
    Find: '<g stroke="#111" stroke-width="1.3"><path d="M20 21l4-3 8 10-3 3z" fill="#999"/><path d="M22 22l7 7" stroke="#eee"/><circle cx="13" cy="12" r="9" fill="#ddd"/><path d="M6 14q-3-10 7-10" fill="none" stroke="#fff"/><path d="M7 19q8 6 14-3" fill="none" stroke="#777"/></g>',
    Shadows:
      '<g stroke="#111" stroke-width="1.2"><path d="M10 2h22v24H10z" fill="#999"/><path d="M11 3h19v21H11z" fill="#eee"/><path d="M6 7h22v23H6z" fill="#ddd"/><path d="M2 12h23v20H2z" fill="#aaa"/><path d="M3 13h20v17H3z" fill="#ddd"/><path d="M3 13h20M3 13v17" stroke="#fff"/></g>',
    'Help Topics':
      '<g stroke="#111" stroke-width="1.3" stroke-linejoin="round"><path d="M9 4h19l4 3v22l-5 2H8z" fill="#999"/><path d="M9 3h20v24H9z" fill="#ddd"/><path d="M5 2h19l3 4v24H3l-1-3 2-5V6z" fill="#ddd"/><path d="M6 4h17v22H4" fill="none" stroke="#fff"/><path d="M3 28h22v4H4z" fill="#aaa"/></g><text x="15" y="23" font-size="25" font-weight="700" text-anchor="middle" font-family="Arial">?</text>',
  };
  const APPICON =
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 2h20l3 3v24H6z" fill="#888" stroke="#111" stroke-width="1.5"/><path d="M3 2h20v26H3z" fill="#ddd" stroke="#111" stroke-width="1.5"/><path d="M4 3h18v24H4z" fill="none" stroke="#fff"/><path d="M14 5l6 5-2 7-4 2-5-6 1-5z" fill="#507c9a" stroke="#111"/><path d="M14 7l3 4-3 2-2-3z" fill="#eee"/><path d="M13 17h3v7h-4v-3h2" fill="#ddd" stroke="#111"/></svg>';
  function panel(u, cls, title, names) {
    const p = u.el('aside', 'pnl ' + cls, document.body),
      h = u.el('div', 'pnl-h', p);
    u.el('span', '', h, title);
    u.el('i', '', h);
    names.forEach((n) => {
      const it = u.el('div', 'pnl-it', p),
        s = u.svg('svg', { width: 34, height: 34, viewBox: '0 0 34 34' }, it);
      s.innerHTML = ICONS[n];
      u.el('span', '', it, n);
    });
  }
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'os2 instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const ic = u.el('span', 'tico', top);
      ic.innerHTML = APPICON;
      u.el('span', 'ttxt', top, 'Color Match  -  OS/2 Workplace Shell');
      const wc = u.el('div', 'wc', top);
      ['_', '□', '×'].forEach((t, i) => u.el('b', 'window-' + i, wc, t));
      const menu = u.el('nav', 'menu', app);
      ['File', 'Edit', 'View', 'Options', 'Help'].forEach((t) => {
        const s = u.el('span', '', menu);
        s.innerHTML = '<u>' + t[0] + '</u>' + t.slice(1);
      });
      panel(u, 'p-left', 'Workplace', ['Programs', 'Assistance', 'Settings', 'Shredder']);
      panel(u, 'p-desk', 'Desktop', ['View', 'Find', 'Shadows']);
      panel(u, 'p-help', 'Help', ['Help Topics']);
      const tabs = u.el('div', 'tabs', document.body);
      ['Task', 'Instructions', 'About'].forEach((t, i) => u.el('span', i ? 'tab' : 'tab on', tabs, t));
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'header' ? ctx.instruction : '');
      if (ctx.display === 'panel') u.el('div', 'episode-note panel-note', center, ctx.instruction);
      if (ctx.display === 'toast') u.el('div', 'episode-note toast-note', app, ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const tb = u.el('div', 'taskbar', document.body);
      const logo = u.el('span', 'tb-logo', tb);
      logo.innerHTML =
        '<svg viewBox="0 0 34 34"><path d="M7 2l19 2 5 9-5 18H5L2 17z" fill="#173d74" stroke="#111" stroke-width="2"/><path d="M5 5h16l6 10-6 15H7" fill="none" stroke="#eee"/><text x="4" y="21" fill="white" font-family="Arial" font-weight="700" font-size="13">OS/2</text><path d="M10 28l15-16" stroke="#e7bd3a" stroke-width="2"/></svg>';
      u.el('span', 'tb-os', tb, 'OS/2');
      const tw = u.el('span', 'tb-win', tb);
      u.el('span', 'tico sm', tw).innerHTML = APPICON;
      u.el('span', '', tw, 'Color Match');
      let submit = null,
        footer = null;
      const endR = ctx.rng.fork('chrome/end'),
        endWords = ctx.content && ctx.content.END_LABELS;
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const labels =
        Array.isArray(endWords) && endWords.length
          ? endWords.map(labelOf)
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const label = endR.bool(0.5) ? 'Submit' : labelOf(endR.pick(labels));
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = [...new Set(labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
        if (pool.length) collide = { text: collideR.pick(pool), where: collideR.pick(['footer', 'taskbar']) };
      }
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
      };
      const makeEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (!ctx.finish) {
        const placement = endR.pick([
          'bottom',
          'bottom',
          'bottom',
          'bottom',
          'bottom',
          'left',
          'left',
          'left',
          'taskbar',
          'taskbar',
        ]);
        if (placement === 'taskbar') {
          submit = makeEnd(tb, 'taskbar-end', label);
        } else {
          footer = u.el('footer', placement === 'left' ? 'bottom alt-left' : 'bottom', app);
          submit = makeEnd(footer, 'submit', label);
        }
        if (collide) {
          if (collide.where === 'taskbar') decoyBtn(tb, collide.text, true);
          else {
            if (!footer) footer = u.el('footer', 'bottom alt-left', app);
            decoyBtn(footer, collide.text, true);
          }
        }
      }
      u.el('span', 'tb-spacer', tb);
      u.el('span', 'tb-speaker', tb).innerHTML =
        '<svg viewBox="0 0 30 30"><path d="M4 11h5l7-6v20l-7-6H4z" fill="#ccc" stroke="#111" stroke-width="1.5"/><path d="M18 11q5 4 0 8M21 7q9 8 0 16" fill="none" stroke="#111" stroke-width="1.3"/><path d="M5 12v6M10 12l4-4" fill="none" stroke="#fff"/></svg>';
      u.el('span', 'tb-clock', tb, '10:24 AM');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
