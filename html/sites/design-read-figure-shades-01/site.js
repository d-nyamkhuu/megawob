(function () {
  'use strict';
  const C = { site: 'design-read-figure-shades-01', title: 'Color Tile Challenge' };
  const ICON = {
    New: '<path d="M6 2h13l8 8v20H6z" fill="#fff" stroke="#7b8794" stroke-width="1.2"/><path d="M19 2v8h8" fill="#e9eaee" stroke="#7b8794" stroke-width="1.2"/>',
    Open: '<path d="M4 9q0-2 2-2h7l3 3h12v18H4z" fill="#e7bb6a" stroke="#a27c37" stroke-width="1.2"/><path d="M4 13h24v15H4z" fill="#f3d18b" stroke="#a27c37" stroke-width="1.2"/><path d="M6 14h20v12H6z" fill="url(#metalOpen)"/><path d="M5 11h22" stroke="#fff3d3"/>',
    Save: '<rect x="4" y="6" width="23" height="23" rx="1" fill="#7f9bb6" stroke="#536b82" stroke-width="1.3"/><rect x="5" y="7" width="21" height="21" fill="url(#metalSave)"/><path d="M9 6h13v11H9z" fill="#d4dce1" stroke="#71869a"/><path d="M20 7v9" stroke="#536b82" stroke-width="2"/><path d="M9 22h14v7H9z" fill="#dce1e3" stroke="#71869a"/>',
    Print:
      '<rect x="9" y="7" width="15" height="12" fill="#b5c0c7" stroke="#657382" stroke-width="1.3"/><rect x="10" y="8" width="13" height="10" fill="url(#metalPrint)"/><rect x="4" y="16" width="25" height="12" rx="2" fill="#a8b3bc" stroke="#687684" stroke-width="1.4"/><rect x="6" y="18" width="21" height="8" fill="url(#metalPrint)"/><rect x="9" y="23" width="15" height="7" fill="#f8f9f8" stroke="#71818b" stroke-width="1.2"/>',
    Undo: '<path d="M12 6L4 14l8 8v-5c8-1 13 1 16 9 0-10-6-16-16-16z" fill="#b7b9bd"/>',
    Redo: '<path d="M20 6l8 8-8 8v-5C12 16 7 18 4 26 4 16 10 10 20 10z" fill="#b7b9bd"/>',
    Clear:
      '<path d="M20 5q2-3 4-1t-1 4l-7 8-4-4z" fill="#aeb1b4" stroke="#85888b"/><path d="M12 11l9 8-6 10-12-8z" fill="#bfc1c2" stroke="#85888b" stroke-width="1.5"/><path d="M7 18l9 7" stroke="#dedede"/>',
  };
  function btn(u, parent, k, label, dis) {
    const b = u.el('div', 'rb' + (dis ? ' dis' : ''), parent);
    u.svg('svg', { width: 36, height: 36, viewBox: '0 0 32 32' }, b).innerHTML =
      '<defs><linearGradient id="metal' +
      k +
      '" x2="0" y2="1"><stop stop-color="#ffffff" stop-opacity=".4"/><stop offset="1" stop-color="#354956" stop-opacity=".15"/></linearGradient></defs><g>' +
      ICON[k] +
      '</g>';
    u.el('span', '', b, label);
  }
  function chk(u, parent, label, on) {
    const r = u.el('div', 'rc', parent);
    u.el('i', 'cb' + (on ? ' on' : ''), r).textContent = on ? '✓' : '';
    u.el('span', '', r, label);
  }
  env.site({
    name: C.site,
    styles: ['site.css', 'ref.css'],
    frame(ctx) {
      const display =
        (ctx.display === 'panel' || ctx.display === 'toast') && document.documentElement.clientWidth < 1180
          ? 'header'
          : ctx.display;
      document.body.className = 'gtk instruction-' + display;
      const u = ctx.util,
        app = u.el('main', 'win', document.body);
      const tb = u.el('header', 'tbar', app);
      u.svg('svg', { width: 22, height: 22, viewBox: '0 0 26 26' }, tb).innerHTML =
        '<path d="M4 1h12l6 6v18H4z" fill="#f7f7f4" stroke="#607b91"/><path d="M16 1v6h6" fill="#d8e4ec" stroke="#607b91"/><path d="M8 11h10v9H8z" fill="#b9d5e3" stroke="#889ca7"/><path d="M8 19l8-7M10 15l3 3" stroke="#c27a40" stroke-width="2"/>';
      u.el('span', 'ttl', tb, C.title);
      const wc = u.el('div', 'wc', tb);
      for (const k of ['_', '▢', '✕']) u.el('b', '', wc, k);
      const rib = u.el('div', 'ribbon', app);
      const g1 = u.el('div', 'grp g1', rib),
        r1 = u.el('div', 'row', g1);
      btn(u, r1, 'New', 'New');
      btn(u, r1, 'Open', 'Open');
      btn(u, r1, 'Save', 'Save');
      btn(u, r1, 'Print', 'Print');
      u.el('div', 'gl', g1, 'File');
      const g2 = u.el('div', 'grp g2', rib),
        c2 = u.el('div', 'col', g2);
      chk(u, c2, 'Show grid', true);
      chk(u, c2, 'Show tile borders', false);
      chk(u, c2, 'High contrast', false);
      u.el('div', 'gl', g2, 'View');
      const g3 = u.el('div', 'grp g3', rib),
        r3 = u.el('div', 'row', g3);
      btn(u, r3, 'Undo', 'Undo', true);
      btn(u, r3, 'Redo', 'Redo', true);
      u.el('div', 'sep', r3);
      btn(u, r3, 'Clear', 'Clear selection');
      u.el('div', 'gl', g3, 'Edit');
      const g4 = u.el('div', 'grp g4', rib),
        c4 = u.el('div', 'col', g4);
      const gs = u.el('div', 'gsz', c4);
      u.el('span', '', gs, 'Grid size:');
      const bx = u.el('div', 'combo', gs);
      u.el('span', '', bx, '5 x 4');
      u.el('i', '', bx, '▼');
      chk(u, c4, 'Keep selection after submit', true);
      u.el('div', 'gl', g4, 'Options');
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const footer = u.el('footer', 'bottom', app);
      const st = u.el('div', 'status', footer);
      u.el('span', 'tile-count', st, 'Tiles:');
      u.el('span', 'selection-count', st, 'Selected: 0');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          original = er.bool(0.5);
        const placement = original ? 'footer' : er.pick(['header', 'link']);
        const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
        const labels = ctx.content.END_LABELS.map(labelOf);
        const label = original ? 'Submit' : er.pick(labels);
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'submit end-' + placement,
          placement === 'header' ? tb : footer,
          label,
        );
        submit.dataset.role = 'submit';
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const options = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) {
            const text = cr.pick(options),
              decoy = u.el('button', 'reset xtra', footer, text);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
        const reset = u.el('button', 'reset', footer, 'Reset');
        reset.type = 'button';
        reset.addEventListener('click', () => env.log('decoy', { label: 'Reset' }));
      }
      u.el('div', 'sbar', app);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const m = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, m[ctx.kind]);
      const d = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      d.addEventListener('click', ctx.dismiss);
      return { el, dismiss: d };
    },
  });
})();
