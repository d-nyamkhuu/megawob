(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#000000', muted: '#66707d', line: '#bbc2c9' };
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
      const outer = u.el('div', 'ds-body', document.body);
      const contentBox = u.el('div', 'ds-content', outer);
      const toolbar = u.el('div', 'ds-end-head', contentBox);
      Object.assign(_c, { contentBox, toolbar, header: contentBox });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', document.body);
      'File|Edit|Format|Tools|Window|Help'.split('|').forEach((text) => _c.util.el('span', '', nav, text));
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      if (_c.display === 'header') _c.header = _c.util.el('aside', 'ds-page-note', header);
      base(_c);
      _c.header = header;
      const note = header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      if (_c.headerTools.children.length) _c.contentBox.classList.add('has-header-end');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.contentBox);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      _c.body.classList.remove('ref-panel-right');
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-panel-note');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast-note');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.contentBox.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.contentBox.appendChild(foot);
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
    name: 'design-find-fact-similar-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-similar-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000000'],
      LOW_ACCENTS: ['#000000'],
      parts,
    },
  });
})();
