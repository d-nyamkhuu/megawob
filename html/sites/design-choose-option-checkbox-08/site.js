(function () {
  'use strict';
  const palette = { bg: '#f3f2f0', panel: '#fbfaf8', fg: '#101923', muted: '#657080', line: '#dcdcdc' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const lg = u.el('span', 'ds-logo', top);
      lg.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M5 5h6l-3 5v4l5-7h6v12h-7l3-5V9L9 19H4z" fill="white"/></svg>';
      u.el('span', 'ds-brand', top, 'InsightHub');
      u.el('span', 'ds-sep', top);
      u.el('span', 'ds-sub', top, 'Audience Preferences');
      u.el('span', 'ds-spacer', top);
      const IC = {
        Settings: '<path d="M9 2h6l.7 3 2 .9 2.7-.9 2 4-2.1 2v2l2.1 2-2 4-2.7-.9-2 .9-.7 3H9l-.7-3-2-.9-2.7.9-2-4 2.1-2v-2l-2.1-2 2-4 2.7.9 2-.9z"/><circle cx="12" cy="12" r="4"/>',
        Help: '<circle cx="12" cy="12" r="10.5"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.5"/>',
        'My Account': '<circle cx="12" cy="12" r="10.5"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18c1.5-3 9.5-3 11 0"/>',
      };
      ['Settings', 'Help', 'My Account'].forEach((t) => {
        const s = u.el('span', 'ds-util', top);
        const i = u.el('span', 'ds-ico', s);
        i.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2a2f3a" stroke-width="1.6" stroke-linecap="round">' + IC[t] + '</svg>';
        u.el('span', '', s, t);
      });
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { top, header: top, body, content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      if (_c.display === 'header') {
        _c.header = _c.util.el('aside', 'ds-header-note', _c.content);
        _c.util.el('div', 'ds-bar', _c.header);
      }
      base(_c);
      if (_c.display === 'header') _c.util.el('p', 'ds-lead', _c.header, 'Choose the topics you’re interested in.');
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      _c.header = _c.top;
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.main = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      const foot = _c.util.el('footer', 'ds-footer', _c.content);
      base(_c);
      const templateFoot = document.body.querySelector('.ref-foot');
      foot.appendChild(templateFoot);
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
    name: 'design-choose-option-checkbox-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-checkbox-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ff6b0b'],
      LOW_ACCENTS: ['#ff6b0b'],
      parts,
    },
  });
})();
