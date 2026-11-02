(function () {
  'use strict';
  const palette = { bg: '#f7f8fa', panel: '#ffffff', fg: '#111827', muted: '#737d8d', line: '#d9dee7' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated note position in each display mode.
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
      const shell = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', shell);
      const header = u.el('header', 'ds-note-slot', content);
      const toolbar = u.el('div', 'ds-top', content);
      Object.assign(_c, { shell, content, header, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        _c.header.classList.add('ds-header-note');
        note.classList.add('ds-instruction');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-main', _c.content);
      const rail = u.el('aside', 'ds-rail', body);
      u.el('h2', '', rail, 'Workout Details');
      const rows = [
        ['▤', 'Strength Training', 'Workout title'],
        ['▰', 'Strength', 'Workout type'],
        ['◷', '0h 30m', 'Duration'],
        ['▢', 'Apr 24, 2025', 'Date'],
        ['▧', 'No notes yet', 'Notes'],
      ];
      rows.forEach((r) => {
        const e = u.el('div', 'ds-detail', rail);
        u.el('span', 'ds-detail-icon', e, r[0]);
        const t = u.el('div', '', e);
        u.el('div', 'ds-detail-value', t, r[1]);
        u.el('div', 'ds-detail-label', t, r[2]);
      });
      const settings = u.el('section', 'ds-settings', rail);
      u.el('h2', '', settings, 'Activity Settings');
      [
        ['◎', 'Intensity', 'Moderate'],
        ['▥', 'Difficulty', 'Intermediate'],
        ['◇', 'Tags', 'None'],
      ].forEach((r) => {
        const e = u.el('div', 'ds-setting', settings);
        u.el('span', 'ds-detail-icon', e, r[0]);
        u.el('span', '', e, r[1]);
        u.el('span', 'ds-setting-value', e, r[2] + '⌄');
      });
      const reminders = u.el('section', 'ds-reminders', rail);
      u.el('h2', '', reminders, 'Reminders');
      const reminder = u.el('div', 'ds-reminder', reminders);
      u.el('span', 'ds-detail-icon', reminder, '♧');
      u.el('span', '', reminder, 'Add a reminder');
      u.el('span', 'ds-toggle', reminder, '');
      Object.assign(_c, { body, rail });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.rail;
      base(_c);
      _c.body = body;
      const note = _c.rail.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-brief');
        note.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
      _c.body.insertBefore(_c.stage, _c.rail);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('ds-footer');
        _c.shell.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => { base(_c); },
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
    name: 'design-set-date-duration-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-duration-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#252b38'],
      LOW_ACCENTS: ['#252b38'],
      parts,
    },
  });
})();
