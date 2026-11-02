(function () {
  'use strict';
  const palette = { bg: '#f9f5ec', panel: '#f9f5ec', fg: '#090c12', muted: '#66707d', line: '#d2d0cb' };
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
      u.el('span', 'ds-brand', top, 'Vocabulary Exercise');
      u.el('span', '', top, '−    □    ×');
      const nav = u.el('nav', 'ds-menu', document.body);
      'File|Edit|Format|Tools|Window|Help'.split('|').forEach((t) => u.el('span', '', nav, t));
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      const icons = [
        '',
        '<rect x="2" y="2" width="9" height="9" rx="1"/><rect x="14" y="2" width="9" height="9" rx="1"/><rect x="2" y="14" width="9" height="9" rx="1"/><rect x="14" y="14" width="9" height="9" rx="1"/>',
        '<path d="M2 16h6v9H2zm8-6h6v15h-6zm8-7h6v22h-6z"/>',
        '<path d="m11 0 4 0 1 4 3 1 3-2 3 3-2 3 1 3 4 1v4l-4 1-1 3 2 3-3 3-3-2-3 1-1 4h-4l-1-4-3-1-3 2-3-3 2-3-1-3-4-1v-4l4-1 1-3-2-3 3-3 3 2 3-1z"/><circle cx="13" cy="15" r="5" fill="#191a18"/>',
      ];
      'Word Lab|Tasks|Progress|Settings'.split('|').forEach((t, i) => {
        const row = u.el('div', '', rail);
        if (i) {
          const icon = u.el('span', 'ds-nav-icon', row);
          icon.setAttribute('aria-hidden', 'true');
          icon.innerHTML = '<svg viewBox="0 0 28 30" fill="currentColor">' + icons[i] + '</svg>';
        }
        u.el('span', '', row, t);
      });
      const content = u.el('div', 'ds-content' + (_c.ctx.finish ? ' ds-finish' : ''), body);
      u.el('div', 'ds-tag1', content, 'Focus\nLearn\nGrow');
      u.el('div', 'ds-tag2', content, 'Small\nSteps\nBrighter\nThinking');
      const clr = u.el('button', 'ds-clear', content, 'Clear All');
      clr.type = 'button';
      clr.addEventListener('click', () => {
        document.querySelectorAll('.rl-cb input:checked').forEach((i) => i.click());
      });
      u.el('div', 'ds-divider', content);
      const main = u.el('div', 'ds-main', content);
      const header = u.el('aside', _c.display === 'header' ? 'ds-brief' : 'ds-empty', main);
      const toolbar = u.el('div', 'ds-toolbar', content);
      Object.assign(_c, { body, contentPane: content, main, header, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.contentPane;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.contentPane.insertBefore(note, _c.main);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.contentPane.appendChild(foot);
      // The narrow action row holds the end control; other tools use the top toolbar.
      foot.querySelectorAll('.ref-xtra').forEach((button) => _c.headerTools.appendChild(button));
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.contentPane.appendChild(dock);
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
    name: 'design-find-fact-similar-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-similar-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#da302b'],
      LOW_ACCENTS: ['#da302b'],
      parts,
    },
  });
})();
