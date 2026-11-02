(function () {
  'use strict';
  const palette = { bg: '#f4f2e6', panel: '#fff', fg: '#102d52', muted: '#5b708a', line: '#a8c2dc' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // PeopleLink has an in-flow notification even on short screens.
      if (_c.ctx.display === 'toast') _c.display = 'toast';
    },
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
      const logo = u.el('div', 'ds-brand', top);
      u.el('span', 'ds-mark', logo, '●');
      u.el('span', '', logo, 'PeopleLink');
      u.el('strong', 'ds-title', top, 'Contacts');
      const search = u.el('div', 'ds-search', top, 'Search contacts');
      u.el('span', 'ds-search-icon', search, '⌕');
      const shell = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', shell);
      'Contacts|Calendar|Tasks|Mail|Notes|Settings'.split('|').forEach((t, i) => {
        const item = u.el('div', 'ds-navitem' + (i === 0 ? ' selected' : ''), rail);
        u.el('span', 'ds-navicon', item, ['▣', '▦', '☑', '✉', '▤', '⚙'][i]);
        u.el('span', '', item, t);
      });
      const content = u.el('div', 'ds-content', shell);
      Object.assign(_c, { top, content, header: content });
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
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.body);
      const inspector = u.el('aside', 'ds-inspector', _c.body);
      u.el('h2', 'ds-inspector-title', inspector, 'Contact Details');
      const summary = u.el('div', 'ds-contact-summary', inspector);
      u.el('div', 'ds-avatar', summary, '●');
      const who = u.el('div', '', summary);
      u.el('strong', '', who, 'Alex Turner');
      u.el('span', '', who, 'Riverton Books');
      const details = u.el('div', 'ds-details', inspector);
      [
        ['Email:', 'alex.turner@rivertonbooks.com'],
        ['Mobile:', '555-493-0178'],
        ['Delivery:', ''],
        ['Office:', '555-281-6600'],
        ['Fax:', '555-281-6601'],
      ].forEach(([a, b]) => {
        const row = u.el('div', 'ds-detail-row', details);
        u.el('span', '', row, a);
        u.el('span', '', row, b);
      });
      u.el('div', 'ds-address-label', inspector, 'Address:');
      u.el('div', 'ds-address', inspector, '742 Market St.\nPortland, OR 97204\nUSA');
      u.el('div', 'ds-meta', inspector, 'Category:　 Customer');
      u.el('div', 'ds-meta', inspector, 'Last Updated:　 Apr 14, 2002　 10:32 AM');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'PeopleLink　 ·　 Contact record';
      _c.content.appendChild(foot);
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
    name: 'design-type-text-copy-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#3674b4'],
      LOW_ACCENTS: ['#3674b4'],
      parts,
    },
  });
})();
