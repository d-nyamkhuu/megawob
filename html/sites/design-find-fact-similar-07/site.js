(function () {
  'use strict';
  const palette = {
    bg: '#939fe8', panel: '#faf8ee', fg: '#07122b', muted: '#66707d', line: '#bbc2c9',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated inspector and note area at every viewport.
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'Word Skills');
      u.el('span', 'ds-sub', top, 'Build vocabulary  •  Sharpen meaning  •  Learn for success');
      u.el('span', 'ds-lp', top, 'Language Practice');
      const squares = u.el('span', 'ds-sq', top);
      for (let i = 0; i < 4; i++) u.el('i', '', squares);
      const brief = u.el('aside', 'ds-brief');
      u.el('h2', '', brief, 'Word List');
      Object.assign(_c, { top, brief, header: brief });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', document.body);
      'File|Edit|Format|Tools|Window|Help'.split('|').forEach((text) => _c.util.el('span', '', nav, text));
    },
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
      if (_c.submit) _c.submit.classList.add('ds-submit', 'ds-end-header');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      content.dataset.instruction = _c.display;
      const main = u.el('div', 'ds-main', content);
      main.appendChild(_c.brief);
      Object.assign(_c, { body, content, main });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
      const text = _c.brief.querySelector('.ref-panel-text');
      if (text) text.classList.add('ds-instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
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
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      // The original keeps secondary controls in its status bar.
      for (const button of _c.headerTools.querySelectorAll('.ref-xtra')) foot.appendChild(button);
      for (const button of foot.querySelectorAll('.ref-xtra')) button.classList.add('ds-xtra');
      if (_c.submit && foot.contains(_c.submit)) {
        _c.submit.classList.add('ds-submit');
        if (_c.placement === 'link') _c.submit.classList.add('ds-end-link');
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        _c.submit.classList.add('ds-submit');
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
    name: 'design-find-fact-similar-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-similar-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#244f9c'],
      LOW_ACCENTS: ['#244f9c'],
      parts,
    },
  });
})();
