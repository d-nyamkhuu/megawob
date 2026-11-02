(function () {
  'use strict';
  const palette = { bg: '#f8f6ef', panel: '#fcfbf8', fg: '#2b2a38', muted: '#6b5a52', line: '#a9a397' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      let mode = _c.ctx.display || 'header';
      if ((mode === 'panel' || mode === 'toast') && document.body.clientWidth <= 1100) mode = 'header';
      _c.display = mode;
      document.body.classList.toggle('ref-has-note', mode === 'toast');
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
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML =
        '<svg viewBox="0 0 96 66"><path d="M3 11v47q24-4 45 5 22-9 45-5V11" fill="none" stroke="#c6ba94" stroke-width="3"/><path d="M9 7v47q21-2 39 9 19-11 39-9V7" fill="#f6edcc" stroke="#a2946e" stroke-width="2"/><path d="M16 3q19-1 32 12Q61 2 80 3v46q-20 1-32 14-13-13-32-14Z" fill="#efe8cd" stroke="#b7a981" stroke-width="2"/><path d="M48 15v48M13 7v43M83 7v43" fill="none" stroke="#958b67" stroke-width="2"/></svg>';
      const bt = u.el('span', 'ds-brand', top);
      u.el('b', '', bt, 'Riverton Public Library');
      u.el('i', '', bt, 'Catalog System');
      const tn = u.el('span', 'ds-topnav', top);
      ['Search', 'Add Record', 'Reports', 'Help'].forEach((t) => u.el('span', '', tn, t));
      const body = u.el('div', 'ds-body');
      const content = u.el('div', 'ds-content', body);
      content.dataset.instruction = _c.display;
      const main = u.el('div', 'ds-main', content);
      Object.assign(_c, { top, toolbar: tn, body, content, main, header: main });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const book = '<path d="M4 5q9-3 16 2 7-5 16-2v25q-9-2-16 2-7-4-16-2Z"/><path d="M20 7v25M1 7v26q11-1 19 2 8-3 19-2V7"/>';
      const glyphs = {
        'New Record': book,
        'MARC View': book,
        'Open': '<path d="M5 9V5h12l3 4h15v26H5Z"/><path d="M5 14h30"/>',
        'Save': '<path d="M4 3h32v34H4Z" fill="currentColor"/><path d="M10 3h18v12H10ZM10 23h21v13H10Z" fill="#f5f2eb"/><path d="M23 5v7"/>',
        'Delete': '<path d="M8 7l25 26M33 7L8 33" stroke-width="4"/>',
        'Cut': '<path d="M6 3h17l10 11v21H6Z" fill="#a3a3a2" stroke="#a3a3a2"/><path d="M23 3v12h10M15 13h18v24H15Z" fill="#c2c2be" stroke="#8c8c8a"/>',
        'Copy': '<path d="M7 4h16l9 10v22H7Z"/><path d="M23 4v10h9M14 10h15l7 8v21H14Z" fill="#f5f2eb"/><path d="M29 10v8h7"/>',
        'Paste': '<path d="M10 7h21v28H10Z" fill="currentColor"/><path d="M17 4h8v5h-8Z"/><path d="M16 14h20v24H16Z" fill="#f5f2eb"/><path d="M20 18h11"/>',
        'Find': '<circle cx="24" cy="15" r="11"/><path d="M16 24L4 36" stroke-width="3"/>',
        'Advanced Search': '<path d="M7 16h9v19H4V24ZM24 16h9l4 8v11H24Z" fill="currentColor"/><path d="M10 8h6v8h-9ZM24 8h6l3 8h-9ZM16 21h8M16 27h8"/><path d="M13 5h5M23 5h5"/>',
        'Authority Look-up': '<path d="M5 4h31v32H5Z"/><path d="M10 12h3M10 20h3M10 28h3M17 12h14M17 20h14M17 28h14"/>',
        'Print': '<path d="M10 4h21v13H10ZM4 17h33v16H4ZM11 28h20v10H11Z"/><path d="M27 9h1M28 22h4"/>',
        'Preferences': '<path d="M16 3h8l1 5 5 2 4-2 4 7-4 3v5l4 3-4 7-5-2-4 2-1 5h-8l-1-5-5-2-4 2-4-7 4-3v-5l-4-3 4-7 5 2 4-2Z" fill="currentColor" stroke="none"/><circle cx="20" cy="20" r="6" fill="#f5f2eb" stroke="none"/>',
      };
      const rib = u.el('nav', 'ds-ribbon', document.body);
      [
        ['Catalog', ['New Record', 'Open', 'Save', 'Delete']],
        ['Edit', ['Cut', 'Copy', 'Paste']],
        ['Tools', ['Find', 'Advanced Search', 'Authority Look-up']],
        ['View', ['MARC View', 'Print']],
        ['Options', ['Preferences']],
      ].forEach((g) => {
        const grp = u.el('div', 'ds-grp', rib);
        u.el('h4', '', grp, g[0]);
        const row = u.el('div', 'ds-btns', grp);
        g[1].forEach((t) => {
          const b = u.el('div', 'ds-tool' + (t === 'Delete' ? ' dis' : ''), row);
          b.addEventListener('click', () => env.log('decoy', { label: t }));
          const ico = u.el('span', 'ds-ico', b);
          ico.innerHTML = '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">' + glyphs[t] + '</svg>';
          u.el('span', '', b, t);
        });
      });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const card = _c.util.el('aside', 'ds-brief', _c.main);
        note.classList.add('ds-instruction');
        card.appendChild(note);
      }
      const spacer = _c.header.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => { document.body.appendChild(_c.body); },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief', 'ds-panel-note');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('main', 'ds-stage', _c.main); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready.';
      _c.content.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-fill-form-email-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-email-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#5c1624'],
      LOW_ACCENTS: ['#5c1624'],
      parts,
    },
  });
})();
