(function () {
  'use strict';
  const C = { site: 'design-choose-option-listbox-07' };
  const S = 'stroke="#111" stroke-width="2.5" stroke-linejoin="miter"';
  const ICONS = {
    New: `<svg viewBox="0 0 60 60"><path d="M9 4h30l11 11v41H9z" ${S} fill="#eee"/><path d="M39 4v11h11" ${S} fill="#ccc"/><path d="M15 10h19M15 17h19M15 24h28M15 31h28M15 38h28M15 45h28M15 51h20" stroke="#777" stroke-width="2"/></svg>`,
    Open: `<svg viewBox="0 0 60 60"><path d="M5 12h18l5 6h27v35H4V18h1z" ${S} fill="#aaa"/><path d="M3 23h52v30H3z" ${S} fill="#eee"/></svg>`,
    Save: `<svg viewBox="0 0 60 60"><path d="M6 4h43l6 4v48H6z" fill="#222" stroke="#111" stroke-width="2.5"/><path d="M16 4h26v21H16z" fill="#aaa" stroke="#111" stroke-width="2"/><path d="M37 6v17" stroke="#eee" stroke-width="3"/><rect x="13" y="29" width="34" height="27" fill="#eee" stroke="#111" stroke-width="2.5"/><path d="M10 5v49" stroke="#777" stroke-width="2"/></svg>`,
    Print: `<svg viewBox="0 0 60 60"><rect x="16" y="4" width="28" height="20" ${S} fill="#eee"/><path d="M20 9h20M20 13h20M20 17h20" stroke="#888" stroke-width="1.5"/><path d="M8 21h43v4h5v24H3V27h5z" ${S} fill="#ddd"/><path d="M4 29h51M4 38h51M8 32h4M46 33h5" stroke="#111" stroke-width="2"/><path d="M14 44h32v13H14z" ${S} fill="#eee"/><path d="M19 49h22M19 53h22" stroke="#888" stroke-width="2"/></svg>`,
    Find: `<svg viewBox="0 0 60 60"><circle cx="24" cy="23" r="17" ${S} fill="#eee"/><path d="M37 36l18 18-4 4-18-18z" fill="#aaa" stroke="#111" stroke-width="2.5"/></svg>`,
    Notes: `<svg viewBox="0 0 60 60"><rect x="9" y="6" width="42" height="50" ${S} fill="#eee"/><path d="M14 2v9M21 2v9M28 2v9M35 2v9M42 2v9M48 2v9" stroke="#111" stroke-width="2"/><path d="M16 19h28M16 27h28M16 35h28M16 43h28" stroke="#777" stroke-width="2.5"/></svg>`,
    Settings: `<svg viewBox="0 0 60 60"><path d="M25 4h10v6l7 3 5-5 7 7-5 5 3 7h6v10h-6l-3 7 5 5-7 7-5-5-7 3v6H25v-6l-7-3-5 5-7-7 5-5-3-7H2V27h6l3-7-5-5 7-7 5 5 7-3z" ${S} fill="#ddd"/><circle cx="30" cy="32" r="10" ${S} fill="#eee"/></svg>`,
  };
  const palette = { bg: '#24742b', panel: '#e8e8e8', fg: '#111', muted: '#444', line: '#111' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const bar = u.el('header', 'at-menu', document.body);
      const menus = u.el('div', 'at-menus', bar);
      ['Desk', 'File', 'Edit', 'Options', 'Window', 'Help'].forEach((t) => u.el('span', '', menus, t));
      u.el('span', 'at-clock', bar, 'Mon  Mar 10  1986  10:24 AM');
      const desk = u.el('div', 'at-desk', document.body);
      const icon = (cls, label, svg) => {
        const i = u.el('div', 'at-icon ' + cls, desk);
        const g = u.el('div', 'at-glyph', i);
        g.innerHTML = svg;
        u.el('span', '', i, label);
      };
      icon('at-i1', 'FLOPPY DISK', '<svg viewBox="0 0 60 60"><path d="M12 5h39l4 4v48H8V17h4z" fill="#111" stroke="#111" stroke-width="2"/><path d="M6 18h43v37H6zM22 3h24v19H22z" fill="#eee" stroke="#111" stroke-width="2.5"/><path d="M13 9h7v9H9v-5h4M38 7v11" fill="#ccc" stroke="#111" stroke-width="2"/><path d="M33 29h8v9h-4v4h-8v-4h-3v-6h3v-3z" fill="#111"/><path d="M30 47h9v4h-9z" fill="#111"/></svg>');
      icon('at-i2', 'WORK', '<svg viewBox="0 0 60 60"><path d="M7 10h18l5 6h25v40H6V17h1z" fill="#999" stroke="#111" stroke-width="2.5"/><path d="M6 18h47v38H6z" fill="#eee" stroke="#111" stroke-width="2.5"/></svg>');
      icon('at-i3', 'TRASH', '<svg viewBox="0 0 60 60"><rect x="12" y="14" width="36" height="42" fill="#ddd" stroke="#111" stroke-width="3"/><path d="M8 12h44M24 8h12M20 20v32M30 20v32M40 20v32" stroke="#111" stroke-width="3"/></svg>');
      const win = u.el('div', 'at-win', desk);
      const tb = u.el('div', 'at-title', win);
      u.el('i', 'at-gad at-gl', tb);
      u.el('span', 'at-stripes', tb);
      u.el('b', '', tb, 'City Information');
      u.el('span', 'at-stripes', tb);
      u.el('i', 'at-gad at-gr', tb);
      const pane = u.el('div', 'at-pane at-mode-' + _c.display, win);
      Object.assign(_c, { desk, win, tb, pane, header: pane });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note', 'ds-instruction');
        if (_c.ctx.instruction.length > 75) note.classList.add('long');
      }
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.tb;
      base(_c);
      _c.header = h;
      _c.tb.insertBefore(_c.headerTools, _c.tb.lastElementChild.previousElementSibling);
    },
    'frame.body': () => (_c) => {
      const main = _c.util.el('div', 'at-main', _c.pane);
      const side = _c.util.el('div', 'at-side', main);
      Object.assign(_c, { main, side, body: main });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const panel = _c.side.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-header-note', 'ds-brief');
      const text = _c.side.querySelector('.ref-panel-text');
      if (text) text.classList.add('ds-instruction');
      ['State:', 'Population:', 'Time Zone:', 'Region:'].forEach((t) => {
        const r = _c.util.el('div', 'at-frow', _c.side);
        _c.util.el('span', '', r, t);
        _c.util.el('div', 'at-fld', r);
      });
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
      _c.main.insertBefore(_c.stage, _c.side);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.pane.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.pane.appendChild(foot);
      const dock = _c.util.el('footer', 'at-dock', document.body);
      Object.keys(ICONS).forEach((k, i) => {
        if (k === 'Settings' && _c.placement === 'floating') return;
        const d = _c.util.el('div', 'at-tool', dock);
        d.style.left = [7.9, 22, 35.9, 50, 63.6, 76.6, 91.5][i] + '%';
        const g = _c.util.el('div', 'at-tg', d);
        g.innerHTML = ICONS[k];
        _c.util.el('span', '', d, k);
        d.addEventListener('click', () => env.log('decoy', { label: k }));
      });
      _c.dock = dock;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.dock.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#111'], LOW_ACCENTS: ['#111'], parts,
    },
  });
})();
