(function () {
  'use strict';
  const palette = { bg: '#f6f3e7', panel: '#f7f4e9', fg: '#073f4a', muted: '#2b5d65', line: '#3f7a80' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
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
      const top = u.el('header', 'ds-top', document.body);
      const tl = u.el('div', 'ds-titles', top);
      u.el('span', 'ds-brand', tl, 'Word Finder');
      u.el('span', 'ds-tag', tl, 'Read carefully. Find the right word.');
      const aside = u.el('div', 'ds-aside', top);
      u.el('span', '', aside, 'A QUIETER\nWAY TO LEARN');
      u.el('i', '', aside);
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      Object.assign(_c, { top, body, content, main, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-end-tools');
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
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
      const u = _c.util;
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const tools = u.el('div', 'ds-tools', foot);
      const lead = u.el('span', 'ds-tool-lead', tools);
      u.el('b', 'ds-book', lead);
      u.el('span', '', lead, 'Text Tools');
      u.el('i', 'ds-sep', tools);
      [['A−', 'Smaller Text'], ['A+', 'Larger Text'], ['≡', 'Reset View']].forEach((a) => {
        const b = u.el('span', 'ds-tbtn', tools);
        u.el('b', '', b, a[0]);
        u.el('span', '', b, a[1]);
      });
      u.el('i', 'ds-sep', tools);
      const hp = u.el('span', 'ds-help', tools);
      u.el('b', '', hp, '?');
      u.el('span', '', hp, 'Help');
      const controls = foot.querySelector('.ref-tools');
      for (const extra of controls.querySelectorAll('.ref-xtra')) _c.headerTools.appendChild(extra);
      foot.appendChild(controls);
      if (_c.placement === 'footer' && _c.submit) {
        _c.submit.classList.add('ds-submit');
        foot.appendChild(_c.submit);
      } else if (_c.placement === 'link' && _c.submit) {
        _c.submit.classList.add('ds-endlink');
        foot.insertBefore(_c.submit, tools);
        foot.classList.add('ds-footer-alt');
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
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
    name: 'design-find-fact-find-word-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-find-word-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#7b354b'],
      LOW_ACCENTS: ['#7b354b'],
      parts,
    },
  });
})();
