(function () {
  'use strict';
  const ALERT =
    '<svg viewBox="0 0 72 72" width="100%" height="100%"><circle cx="36" cy="36" r="36" fill="#e1141c"/><rect x="31" y="14" width="10" height="29" rx="4" fill="#fff"/><circle cx="36" cy="54" r="5.5" fill="#fff"/></svg>';
  const CHEV_UP =
    '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15l7-7 7 7"/></svg>';
  const CHEV_DOWN =
    '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9l7 7 7-7"/></svg>';
  const INFO =
    '<svg viewBox="0 0 32 32" width="100%" height="100%"><circle cx="16" cy="16" r="16" fill="#1559d6"/><rect x="14" y="14" width="4" height="11" rx="1" fill="#fff"/><circle cx="16" cy="9" r="2.4" fill="#fff"/></svg>';
  const EXT =
    '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#e1141c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>';
  function chromeLink(el, label) {
    el.addEventListener('click', () => env.log('decoy', { label }));
  }
  function styleNote(_c, el, cls, textClass) {
    el.classList.add(cls);
    const icon = _c.util.el('span', 'ds-info');
    icon.innerHTML = INFO;
    el.prepend(icon);
    el.querySelector(textClass).classList.add('ds-instruction');
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'ds-body', document.body);
      const left = u.el('aside', 'ds-left', shell);
      const logo = u.el('div', 'ds-logo', left);
      u.el('div', 'ds-logo-bar', logo);
      u.el('div', 'ds-logo-t', logo, 'Riverside');
      u.el('div', 'ds-logo-t ds-logo-t2', logo, 'Council');
      const app = u.el('div', 'ds-app', left);
      u.el('div', 'ds-app-bar', app);
      u.el('div', 'ds-app-t', app, 'Application for Adoption');
      const nav = u.el('nav', 'ds-nav', shell);
      chromeLink(u.el('span', '', nav, 'Help'), 'Help');
      chromeLink(u.el('span', '', nav, 'Contact'), 'Contact');
      u.el('span', 'ds-avatar', nav, 'JL');
      u.el('span', 'ds-nchev', nav).innerHTML = CHEV_DOWN;
      const content = u.el('div', 'ds-content', shell);
      const intro = u.el('div', 'ds-intro', content);
      u.el('div', 'ds-num', intro, '02');
      u.el('div', 'ds-vrule', intro);
      const ht = u.el('div', 'ds-htext', intro);
      u.el('div', 'ds-h1', ht, 'Child details');
      u.el('div', 'ds-h1sub', ht, 'Tell us about the child you wish to adopt.');
      Object.assign(_c, { shell, content, toolbar: nav, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        const text = _c.util.el('div', 'ds-instruction');
        // Move the template's text into the council's icon-and-text layout.
        text.append(...note.childNodes);
        note.appendChild(text);
        const icon = _c.util.el('span', 'ds-info');
        icon.innerHTML = INFO;
        note.prepend(icon);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = u.el('div', 'ds-main', _c.content);
      const rail = u.el('aside', 'ds-rail', _c.shell);
      u.el('div', 'ds-rbar', rail);
      u.el('h2', '', rail, 'Your progress');
      u.el('div', 'ds-step', rail, 'Step 2 of 4');
      const pb = u.el('div', 'ds-pbar', rail);
      u.el('div', 'ds-pfill', pb);
      Object.assign(_c, { body: main, rail });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.rail;
      base(_c);
      _c.body = body;
      const note = _c.rail.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-brief');
        styleNote(_c, note, 'ds-panel-note', '.ref-panel-text');
      }
      const u = _c.util;
      u.el('div', 'ds-reservation-values', _c.rail);
      const help = u.el('section', 'ds-help', _c.rail);
      u.el('h2', '', help, 'Need help?');
      u.el('p', '', help, "If you're unsure about any of these details, you can save your application and come back later.");
      const lk = u.el('a', 'ds-link', help, 'View guidance');
      u.el('span', 'ds-lico', lk).innerHTML = EXT;
      chromeLink(lk, 'View guidance');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        styleNote(_c, note, 'ds-toast', '.ref-note-text');
        _c.content.insertBefore(note, _c.body);
      }
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
      const u = ctx.util;
      if (ctx.kind === 'banner') {
        const el = u.el('section', 'ds-ribbon ds-announcement-overlay', document.body);
        el.dataset.role = 'overlay';
        const icon = u.el('span', 'ds-alert', el);
        icon.innerHTML = ALERT;
        const text = u.el('div', 'ds-rtext', el);
        u.el('div', 'ds-rtitle', text, 'System maintenance this weekend');
        u.el(
          'div',
          'ds-rsub',
          text,
          'Some features may be temporarily unavailable from Sat 26 Sep, 20:00 to Sun 27 Sep, 08:00 (BST).',
        );
        const dismiss = u.el('button', 'ds-collapse', el, 'Collapse announcement');
        dismiss.type = 'button';
        const chev = u.el('span', 'ds-cico', dismiss);
        chev.innerHTML = CHEV_UP;
        dismiss.addEventListener('click', () => ctx.dismiss('close'));
        return { el, dismiss, ttlSteps: 0 };
      }
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
  const palette = { bg: '#fff', panel: '#fff', fg: '#111', muted: '#6b6b6b', line: '#cfcfcf' };
  env.site({
    name: 'design-set-date-calendar-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner' },
    design: {
      THEMES: { 'design-set-date-calendar-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#e1141c'],
      LOW_ACCENTS: ['#e1141c'],
      parts,
    },
  });
})();
