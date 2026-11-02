(function () {
  'use strict';
  const palette = { bg: '#0b1114', panel: '#f7f6ef', fg: '#0b1114', muted: '#6b7077', line: '#d1f5a3' };
  function documentIcon(u, note) {
    const icon = u.el('span', 'ds-docicon');
    icon.innerHTML = '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#0b1114" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2.5h8l4.5 4.5v14.5H6zM14 2.5V7h4.5M9 12h6M9 15.5h6M9 19h4"/></svg>';
    note.prepend(icon);
    const text = note.querySelector('.ref-instruction, .ref-note-text');
    text.classList.add('ds-instruction');
    const length = text.textContent.length;
    if (length > 140) note.style.setProperty('--fit', Math.sqrt(140 / length).toFixed(3));
  }
  const parts = {
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
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML = '<svg viewBox="0 0 24 24" width="62%" height="62%" fill="none" stroke="#0b1114" stroke-width="3" stroke-linejoin="round"><path d="M6 5h6a7 7 0 0 1 0 14H6z"/></svg>';
      u.el('span', 'ds-brand', top, 'Text Tools');
      const nav = u.el('nav', 'ds-nav', top);
      ['Tools', 'Help', 'Account'].forEach((t, i) => u.el('span', i === 0 ? 'on' : '', nav, t));
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      u.el('div', 'ds-eyebrow', content, 'TEXT TRANSFORM');
      u.el('h1', 'ds-title', content, 'Complete the Instruction');
      Object.assign(_c, { top, body, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      if (_c.display === 'header') _c.header = _c.util.el('aside', 'ds-header-note', _c.content);
      base(_c);
      if (_c.display === 'header') documentIcon(_c.util, _c.header);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-top-tools');
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.content;
      base(_c);
      _c.body = body;
      const panel = _c.content.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.main = _c.util.el('div', 'ds-main', _c.content);
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        documentIcon(_c.util, note);
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.textContent = _c.ctx.finish ? 'READY' : '';
      text.classList.add('ds-ready');
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
    name: 'design-type-text-transform-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#b6f94d'],
      LOW_ACCENTS: ['#b6f94d'],
      parts,
    },
  });
})();
