(function () {
  'use strict';
  const palette = { bg: '#1d2227', panel: '#e9edf2', fg: '#171a1e', muted: '#5f6973', line: '#aeb7c2' };
  const parts = {
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
      u.el('span', 'ds-appicon', top, '◉');
      u.el('span', 'ds-brand', top, 'Building Materials Reference');
      u.el('span', 'ds-window-controls', top, '−　□　×');
      const shell = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', shell);
      Object.assign(_c, { header: top, shell, content });
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.content;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.body);
      const help = u.el('aside', 'ds-help', _c.body);
      u.el('h3', '', help, 'Help');
      u.el('h4', '', help, 'About this document');
      u.el('p', '', help, 'This reference lists common building materials and the file extension used for their design files. The information is grouped into seven sections. Click a section heading to view its details.');
      u.el('h4', 'ds-tips-title', help, 'Tips');
      const ul = u.el('ul', '', help);
      [
        'Only the first section is expanded. Click a section heading to show or hide details.',
        'Use the scroll bar to view more content within a section.',
        'You can use Find (Ctrl+F) to search for a material name in the document.',
      ].forEach((t) => u.el('li', '', ul, t));
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.insertBefore(note, _c.body);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
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
    name: 'design-find-fact-locate-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-locate-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#426eae'],
      LOW_ACCENTS: ['#426eae'],
      parts,
    },
  });
})();
