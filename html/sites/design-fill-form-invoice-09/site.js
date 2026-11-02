(function () {
  'use strict';
  const palette = { bg: '#faf8ed', panel: '#faf8ed', fg: '#12294a', muted: '#4b5f78', line: '#1b4a85' };
  const documentIcon = '<svg viewBox="0 0 24 28" width="30" height="34"><path d="M2 1h14l6 6v20H2z" fill="#a5e6dc" stroke="#091c3c" stroke-width="2"/><path d="M16 1v7h6" fill="#5194b0" stroke="#091c3c" stroke-width="2"/><path d="M6 10h9M6 14h12M6 18h12M6 22h8" stroke="#1b4a85" stroke-width="2"/></svg>';
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
      const brand = u.el('span', 'ds-brand', top);
      brand.innerHTML = documentIcon;
      u.el('span', 'ds-brand-name', brand, 'Data Entry Pro');
      const tabs = u.el('nav', 'ds-tabs', top);
      'Home|Invoices|Reports|Settings'.split('|').forEach((t) => u.el('span', 'ds-tab' + (t === 'Invoices' ? ' on' : ''), tabs, t));
      const links = u.el('div', 'ds-links', top);
      links.innerHTML = '<span><u>H</u>elp</span><i>|</i><span>Log Out</span>';
      const outer = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', outer);
      Object.assign(_c, { top, links, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      if (_c.display === 'header') {
        const note = _c.util.el('aside', 'ds-header-note', _c.content);
        _c.util.el('span', 'ds-note-ic', note).innerHTML = documentIcon;
        _c.header = note;
      }
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.links;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      // The original card is always on the left, irrespective of template alignment.
      _c.body.classList.remove('ref-panel-right');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
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
    name: 'design-fill-form-invoice-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-invoice-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0b8a8f'],
      LOW_ACCENTS: ['#0b8a8f'],
      parts,
    },
  });
})();
