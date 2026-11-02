(function () {
  'use strict';
  const palette = { bg: '#f7f6f3', panel: '#ffffff', fg: '#1a1a1a', muted: '#333', line: '#8a8a8a' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The form has room for its own side note at every training viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const mast = u.el('header', 'ds-mast', document.body);
      const mb = u.el('div', 'ds-mast-l', mast);
      u.el('div', 'ds-mast-t', mb, 'Event Registration');
      u.el('div', 'ds-mast-s', mb, 'Conference Attendance');
      const nav = u.el('nav', 'ds-nav', mast);
      ['Home', 'Schedule', 'Registration', 'Contact'].forEach((t) => {
        const item = u.el('span', '', nav, t);
        item.addEventListener('click', () => env.log('decoy', { label: t }));
      });
      const content = u.el('div', 'ds-content', document.body);
      u.el('h1', 'ds-h1', content, 'Attendee Information');
      u.el('p', 'ds-lede', content, 'Please provide the details below to register for the conference.');
      const r1 = u.el('div', 'ds-row r1', content);
      u.el('span', 'ds-lab', r1, 'Full Name');
      u.el('div', 'ds-fld', r1, 'Taylor Morgan');
      const r2 = u.el('div', 'ds-row r2', content);
      u.el('span', 'ds-lab', r2, 'Email Address');
      u.el('div', 'ds-fld', r2, 'taylor.morgan@example.com');
      const r3 = u.el('div', 'ds-row r3', content);
      u.el('span', 'ds-lab', r3, 'City');
      const header = u.el('aside', 'ds-side', content);
      header.hidden = _c.display !== 'header';
      Object.assign(_c, { mast, contentPane: content, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      if (_c.display === 'header') _c.util.el('div', 'ds-hint', _c.header, 'Select from the list.');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.mast;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => { _c.body = _c.contentPane; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.querySelector('.ref-panel-title').textContent = 'Registration note';
        _c.util.el('div', 'ds-hint', panel, 'Select from the list.');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.body.appendChild(note);
        const title = _c.util.el('div', 'ds-note-title', note, 'Registration reminder');
        note.insertBefore(title, note.firstChild);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      const step = _c.util.el('div', 'ds-step', foot);
      _c.util.el('span', '', step, 'Step 1 of 3');
      ['1', '2', '3'].forEach((t, i) => _c.util.el('span', 'ds-pg' + (i ? '' : ' cur'), step, t));
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
    name: 'design-choose-option-listbox-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#c0141c'],
      LOW_ACCENTS: ['#c0141c'],
      parts,
    },
  });
})();
