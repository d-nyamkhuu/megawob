(function () {
  'use strict';
  const C = {
    site: 'design-fill-form-invoice-07',
    brand: 'NeXT',
    menu: 'File|Edit|View|Tools|Windows|Help',
    clock: 'Sat Sep 12   10:24 AM',
    icons: 'Workspace|Documents|Applications|Trash',
  };
  const ICONDEFS =
    '<defs><linearGradient id="metal" x2="1" y2="1"><stop stop-color="#ddd"/><stop offset=".5" stop-color="#a5a5a5"/><stop offset="1" stop-color="#777"/></linearGradient><linearGradient id="cylinder"><stop stop-color="#333"/><stop offset=".25" stop-color="#ccc"/><stop offset=".7" stop-color="#aaa"/><stop offset="1" stop-color="#444"/></linearGradient></defs>';
  const ICONS = {
    Workspace:
      '<svg viewBox="0 0 64 64">' + ICONDEFS +
      '<path d="M21 17V9q0-5 5-5h12q5 0 5 5v8M24 17V9h16v8" fill="none" stroke="#111" stroke-width="3"/><path d="M21 17V9q0-5 5-5h12q5 0 5 5v8" fill="none" stroke="#ccc"/><path d="M6 17h52v40H6z" fill="url(#metal)" stroke="#111" stroke-width="2"/><path d="M4 19H1v38h5M8 20h47M8 20v34" fill="none" stroke="#ddd"/><path d="M22 24h21" stroke="#eee" stroke-width="2"/></svg>',
    Documents:
      '<svg viewBox="0 0 64 64">' + ICONDEFS +
      '<path d="M7 5h48v55H7z" fill="url(#metal)" stroke="#111" stroke-width="2"/><path d="M8 7h45M9 18v39M8 17h46" stroke="#eee"/><path d="M7 16h48" stroke="#111"/><path d="M20 27h22M20 38h22" stroke="#666" stroke-width="2"/><path d="M20 29h22M20 40h22" stroke="#ddd"/><path d="M42 10h8v3h-8z" fill="#888"/></svg>',
    Applications:
      '<svg viewBox="0 0 64 64">' + ICONDEFS +
      '<path d="M7 5h48v55H7z" fill="#555" stroke="#111" stroke-width="2"/><path d="M9 16V11h42v5M7 19h48v41H7z" fill="url(#metal)" stroke="#111" stroke-width="2"/><path d="M9 21h43M10 22v35M18 29h23M18 40h23" stroke="#ddd"/><path d="M18 27h23M18 38h23" stroke="#777" stroke-width="2"/><path d="M40 8h11v6H40z" fill="#111" stroke="#aaa"/></svg>',
    Trash:
      '<svg viewBox="0 0 64 64">' + ICONDEFS +
      '<path d="M15 17v38q17 10 34 0V17" fill="url(#cylinder)" stroke="#111" stroke-width="2"/><ellipse cx="32" cy="17" rx="19" ry="6" fill="url(#metal)" stroke="#111" stroke-width="2"/><ellipse cx="32" cy="16" rx="15" ry="3" fill="#555" stroke="#ddd"/><path d="M25 14V9q7-5 14 0v5" fill="none" stroke="#111" stroke-width="4"/><path d="M25 14V9q7-5 14 0v5" fill="none" stroke="#ccc" stroke-width="2"/><path d="M21 25v28M29 26v29M37 26v29M45 25v28" stroke="#444" stroke-width="3"/><path d="M22 25v27M30 26v28M38 26v28M46 25v27" stroke="#ddd"/></svg>',
  };
  const palette = { bg: '#464952', panel: '#bbbbbb', fg: '#111111', muted: '#555555', line: '#666666' };
  function styleControls(parent) {
    parent.querySelectorAll('.ref-submit').forEach((b) => b.classList.add('ds-submit'));
    parent.querySelectorAll('.ref-xtra').forEach((b) => b.classList.add('ds-cancel'));
    parent.querySelectorAll('.ref-endlink').forEach((b) => b.classList.add('ds-endlink'));
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The inspector has its own reserved area even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2l9 5v10l-9 5-9-5V7z" fill="#222" stroke="#000"/><path d="M12 2v20M3 7l9 5 9-5" stroke="#aaa" stroke-width="1" fill="none"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      C.menu.split('|').forEach((t) => u.el('span', 'ds-mi', top, t));
      u.el('span', 'ds-clock', top, C.clock);
      u.el('span', 'ds-dock', top);
      const desktop = u.el('div', 'ds-body', document.body);
      const icons = u.el('div', 'ds-icons', desktop);
      C.icons.split('|').forEach((t) => {
        const i = u.el('div', 'ds-icon', icons);
        const g = u.el('span', '', i);
        g.innerHTML = ICONS[t];
        u.el('div', '', i, t);
      });
      const wf = u.el('div', 'ds-win ds-win-form', desktop);
      const tf = u.el('div', 'ds-wtitle', wf);
      u.el('i', 'ds-wbtn l', tf);
      u.el('span', '', tf, 'Data Entry');
      u.el('i', 'ds-wbtn r', tf);
      const wd = u.el('div', 'ds-win ds-win-doc', desktop);
      const td = u.el('div', 'ds-wtitle', wd);
      u.el('i', 'ds-wbtn l', td);
      u.el('span', '', td, 'receipt.txt');
      u.el('i', 'ds-wbtn r', td);
      const content = u.el('div', 'ds-content', desktop);
      const toolbar = u.el('div', 'ds-toolbar', content);
      Object.assign(_c, { desktop, content, toolbar, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        const text = _c.util.el('div', 'ds-instruction');
        text.textContent = note.textContent;
        note.replaceChildren(text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      styleControls(_c.headerTools);
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.content.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-header-note', 'ds-panel-note');
        const title = note.querySelector('.ref-panel-title');
        title.classList.add('ds-panel-caption');
        title.textContent = 'Task Inspector';
        note.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const main = _c.util.el('div', 'ds-main', _c.content);
      _c.stage = _c.util.el('main', 'ds-stage', main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.content.querySelector('.ds-main'));
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = '';
      styleControls(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.content.appendChild(dock);
        styleControls(dock);
      }
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
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#222222'],
      LOW_ACCENTS: ['#222222'],
      parts,
    },
  });
})();
