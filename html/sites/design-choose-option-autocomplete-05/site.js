(function () {
  'use strict';
  const palette = { bg: '#faf8f0', panel: '#ffffff', fg: '#071745', muted: '#66707d', line: '#1d3f78' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original uses the same full-width card for each visible note mode.
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
      u.el('span', 'ds-brand', top, 'CorpTracker');
      u.el('span', 'ds-bldg', top);
      const tabs = u.el('nav', 'ds-tabs', top);
      ['People', 'Offices', 'Projects', 'Reports', 'Settings'].forEach((t) =>
        u.el('span', 'ds-tab' + (t === 'Offices' ? ' on' : ''), tabs, t));
      const who = u.el('span', 'ds-who', top);
      who.append('Welcome, Alex Reed  |  ');
      u.el('u', '', who, 'Sign out');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const header = u.el('div', '', content);
      header.hidden = _c.display !== 'header';
      if (_c.display === 'header') header.className = 'ds-header-note';
      Object.assign(_c, { top, body, content, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-header-tools');
    },
    'frame.body': () => (_c) => {
      _c.main = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const note = _c.main.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-brief');
        note.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.main);
      const cbox = u.el('div', 'ds-ctx', _c.main);
      u.el('h2', 'ds-formtitle', cbox, 'New Employee');
      const fields = u.el('div', 'ds-xtras', cbox);
      [
        ['First name:', 'Jamie'],
        ['Last name:', 'Carter'],
        ['Email:', 'jamie.carter@company.com'],
        ['Department:', 'Marketing ▾'],
      ].forEach((r, i) => {
        const row = u.el('div', 'ds-drow', fields);
        row.style.top = i * 3.1 + 'em';
        u.el('span', 'ds-dl', row, r[0]);
        u.el('span', 'ds-dv' + (i === 3 ? ' sm' : ''), row, r[1]);
      });
      const aft = u.el('div', 'ds-after', cbox);
      u.el('span', 'ds-dl', aft, 'Start date:');
      u.el('span', 'ds-dv ds-date', aft, '2025-06-16');
      u.el('span', 'ds-cal', aft);
      u.el('span', 'ds-dl ds-nl', aft, 'Notes:');
      u.el('span', 'ds-dv ds-notes', aft, 'Add any relevant notes here...');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      // The original Cancel is supplied by the template's varying neutral controls.
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
    name: 'design-choose-option-autocomplete-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-autocomplete-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3e87cb'],
      LOW_ACCENTS: ['#3e87cb'],
      parts,
    },
  });
})();
