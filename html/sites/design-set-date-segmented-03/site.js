(function () {
  'use strict';
  const palette = {
    bg: '#e9ecef', panel: '#ffffff', fg: '#19212b', muted: '#60656e', line: '#c5cad2',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original frame has room for its side card and toast in every mode.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('div', 'ds-lights', top);
      u.el('div', 'ds-window-title', top, 'New Task');
      Object.assign(_c, { header: top, top });
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      if (_c.display === 'header') {
        _c.header = _c.util.el('div', 'ds-header-note', document.body);
      }
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('main', 'ds-content', body);
      const sheet = u.el('div', 'ds-sheet', content);
      u.el('label', 'ds-field-label', sheet, 'Title');
      u.el('div', 'ds-fake-input ds-title-input', sheet);
      u.el('label', 'ds-field-label ds-due-label', sheet, 'Due date');
      u.el('label', 'ds-field-label ds-desc-label', sheet, 'Description');
      u.el('div', 'ds-fake-input ds-description', sheet);
      u.el('label', 'ds-field-label ds-priority-label', sheet, 'Priority');
      const priority = u.el('div', 'ds-fake-input ds-priority', sheet, 'Normal');
      u.el('span', 'ds-select-chevron', priority, '⌄');
      const rail = u.el('aside', 'ds-rail', body);
      const tips = u.el('section', 'ds-tips', rail);
      Object.assign(_c, { body, contentPane: content, tips });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.tips;
      base(_c);
      _c.body = body;
      const u = _c.util;
      const tips = _c.tips;
      u.el('h2', '', tips, 'Date entry tips');
      u.el(
        'p',
        '',
        tips,
        'Enter the month, day and year in the fields, or use the up and down arrows to change the date.',
      );
      u.el('p', '', tips, 'You can also type the number directly into a field.');
      u.el('div', 'ds-divider', tips);
      u.el('div', 'ds-subheading', tips, 'Date format');
      u.el('p', 'ds-example', tips, 'MM / DD / YYYY');
      u.el('div', 'ds-subheading ds-example-heading', tips, 'Example');
      u.el('p', 'ds-example', tips, '10 / 04 / 2026');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'ds-stage', _c.contentPane);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = _c.util.el('footer', 'ds-footer', document.body);
      foot.classList.toggle('ds-actions', !_c.ctx.finish);
      const controls = document.body.querySelector('.ref-foot');
      if (controls) foot.appendChild(controls);
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
    name: 'design-set-date-segmented-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-segmented-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0080ff'],
      LOW_ACCENTS: ['#0080ff'],
      parts,
    },
  });
})();
