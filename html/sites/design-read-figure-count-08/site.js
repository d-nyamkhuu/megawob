(function () {
  'use strict';
  const palette = { bg: '#a8c7e6', panel: '#dfeaf7', fg: '#102b54', muted: '#586f91', line: '#9cb7d5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The existing right-hand note area fits all displays at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ribbon', 'doc', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const ti = u.svg('svg', { width: 22, height: 22, viewBox: '0 0 22 22', class: 'ti' }, top);
      u.svg('circle', { cx: 11, cy: 11, r: 10, fill: '#efcc42', stroke: '#e8f6e8' }, ti);
      u.svg('path', { d: 'M11 1A10 10 0 0 1 21 11H11zM11 21A10 10 0 0 1 1 11H11z', fill: '#73ac40' }, ti);
      u.svg('path', { d: 'M11 2v18M2 11h18', stroke: '#fffbd8', 'stroke-width': 0.7 }, ti);
      u.el('span', 'ttl', top, 'Shape Counter - Practice');
      const wcs = u.el('div', 'wc', top);
      u.el('i', 'min', wcs);
      u.el('i', 'max', wcs);
      u.el('i', 'x', wcs);
      const tabs = u.el('div', 'tabs', app);
      ['Home', 'Insert', 'View', 'Help'].forEach((t, i) => u.el('span', i ? 'tab' : 'tab on', tabs, t));
      const rb = u.el('div', 'ribbon', app);
      const IC = {
        Paste:
          '<rect x="6" y="6" width="20" height="24" rx="2" fill="#e8b860" stroke="#a87a28"/><rect x="11" y="3" width="10" height="6" fill="#999"/><rect x="14" y="13" width="14" height="17" fill="#fff" stroke="#888"/>',
        Cut: '<path d="M9 4l9 14M19 4l-9 14" stroke="#556" stroke-width="2"/><circle cx="9" cy="22" r="4" fill="none" stroke="#36c" stroke-width="2"/><circle cx="19" cy="22" r="4" fill="none" stroke="#36c" stroke-width="2"/>',
        Copy: '<rect x="6" y="4" width="14" height="18" fill="#fff" stroke="#789"/><rect x="12" y="10" width="14" height="18" fill="#fff" stroke="#789"/>',
        Select: '<path d="M8 3v24l6-6 5 10 4-2-5-9h9z" fill="#fff" stroke="#2a7bd0" stroke-width="2"/>',
        Draw: '<path d="M5 29h26" stroke="#a4b4c5" stroke-width="1.5"/><path d="M6 27l3-9L24 3q2-2 4 0l3 3q1 2-1 4L15 25z" fill="#39a343" stroke="#487953"/><path d="M9 18l6 7-9 2z" fill="#e9c491"/><path d="M6 27l1-4 3 3z" fill="#263b43"/><path d="M11 18L26 4" stroke="#b8e998" stroke-width="2"/>',
        Eraser:
          '<path d="M5 29h25" stroke="#a4b4c5" stroke-width="1.5"/><path d="M4 22L22 3q1-2 3 0l6 5q1 1-1 3L13 30z" fill="#9daec0" stroke="#637991"/><path d="M4 22l8-9 10 9-9 8z" fill="#ed6875" stroke="#a34d5b"/><path d="M7 20l6-6 8 7" fill="none" stroke="#ffa4ac"/>',
        ZI: '<circle cx="13" cy="13" r="9" fill="#e8f2fb" stroke="#35618f" stroke-width="2.5"/><path d="M8 13h10M13 8v10M20 20l8 8" stroke="#35618f" stroke-width="3"/>',
        ZO: '<circle cx="13" cy="13" r="9" fill="#e8f2fb" stroke="#35618f" stroke-width="2.5"/><path d="M8 13h10M20 20l8 8" stroke="#35618f" stroke-width="3"/>',
        Z1: '<rect x="3" y="3" width="20" height="20" fill="#e8f2fb" stroke="#35618f" stroke-width="2"/><circle cx="14" cy="14" r="7" fill="none" stroke="#35618f" stroke-width="2.5"/><path d="M20 20l8 8" stroke="#35618f" stroke-width="3"/>',
        New: '<path d="M6 2h14l7 8v20H6z" fill="#fafcff" stroke="#507ca8" stroke-width="1.4"/><path d="M20 2v8h7" fill="#deebf7" stroke="#507ca8"/>',
        Open: '<path d="M3 8h9l3 3h13v15H3z" fill="#f2b84a" stroke="#b07a1a"/><path d="M3 26l5-12h22l-4 12z" fill="#fcd878" stroke="#b07a1a"/>',
        Save: '<rect x="4" y="4" width="24" height="24" rx="2" fill="#2a62c8" stroke="#183c80"/><rect x="9" y="4" width="14" height="9" fill="#fff"/><rect x="9" y="18" width="14" height="10" fill="#dde"/>',
        Print:
          '<rect x="9" y="3" width="14" height="9" fill="#fff" stroke="#789"/><rect x="3" y="12" width="26" height="12" rx="2" fill="#7a8794" stroke="#455"/><rect x="9" y="19" width="14" height="9" fill="#fff" stroke="#789"/>',
      };
      const icon = (p, k, s) => {
        const v = u.svg('svg', { width: s, height: s, viewBox: '0 0 32 32', class: 'ic' }, p);
        v.innerHTML =
          '<defs><linearGradient id="shine-' +
          k +
          '" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".42"/><stop offset=".48" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#123c69" stop-opacity=".18"/></linearGradient></defs>' +
          IC[k];
        const base = v.querySelector('defs + *');
        if (base && ['Paste', 'Draw', 'Eraser', 'Open', 'Save', 'Print'].includes(k)) {
          const sheen = base.cloneNode();
          sheen.setAttribute('fill', 'url(#shine-' + k + ')');
          sheen.setAttribute('stroke', 'none');
          v.append(sheen);
        }
      };
      const grp = (name, items) => {
        const g = u.el('div', 'grp', rb),
          r = u.el('div', 'items', g);
        items.forEach(([l, k, small]) => {
          if (Array.isArray(l)) {
            const col = u.el('div', 'col', r);
            l.forEach(([a, b]) => {
              const c = u.el('div', 'sm', col);
              icon(c, b, 26);
              u.el('span', '', c, a);
            });
            return;
          }
          const b = u.el('div', 'big', r);
          icon(b, k, 48);
          u.el('span', '', b, l);
        });
        u.el('div', 'gn', g, name);
      };
      grp('Clipboard', [
        ['Paste', 'Paste'],
        [
          [
            ['Cut', 'Cut'],
            ['Copy', 'Copy'],
          ],
        ],
      ]);
      grp('Tools', [
        ['Select', 'Select'],
        ['Draw', 'Draw'],
        ['Eraser', 'Eraser'],
      ]);
      grp('Zoom', [
        ['Zoom In', 'ZI'],
        ['Zoom Out', 'ZO'],
        ['100%', 'Z1'],
      ]);
      grp('File', [
        ['New', 'New'],
        ['Open', 'Open'],
        ['Save', 'Save'],
        ['Print', 'Print'],
      ]);
      const center = u.el('div', 'center');
      Object.assign(_c, { app, rb, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.rb;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.app.appendChild(_c.center);
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-panel');
      if (note) note.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('status');
      _c.app.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      const u = _c.util;
      u.el('span', 'zoom', foot, '100%   −');
      u.el('i', 'track', foot);
      u.el('span', 'zoom-plus', foot, '+');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.center.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: 'design-read-figure-count-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-count-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2684d0'],
      LOW_ACCENTS: ['#2684d0'],
      parts,
    },
  });
})();
