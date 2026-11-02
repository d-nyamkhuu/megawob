(function () {
  'use strict';
  const MEGA =
    '<svg viewBox="0 0 170 145" width="100%" height="100%"><path d="M25 86 L36 126 L49 122 L40 83" fill="#080808" stroke="#080808" stroke-width="9" stroke-linejoin="round"/><path d="M8 68 L15 65 L20 90 L12 91 Z" fill="#080808" stroke="#080808" stroke-width="8" stroke-linejoin="round"/><path d="M14 59 L45 53 L99 16 L111 105 L50 84 L20 91 Z" fill="#fff" stroke="#080808" stroke-width="8" stroke-linejoin="round"/><path d="M45 53 L50 84 M99 16 L111 105" fill="none" stroke="#080808" stroke-width="7"/><path d="M125 30 L138 14 M131 52 L150 48 M131 75 L147 83" stroke="#080808" stroke-width="7" stroke-linecap="round"/></svg>';
  const USER =
    '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="8" r="4.5" fill="#111"/><path d="M3 21 C3 14 21 14 21 21 Z" fill="#111"/></svg>';
  const palette = { bg: '#f5f5f3', panel: '#fffdf6', fg: '#111', muted: '#444', line: '#111' };
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
      u.el('span', 'ds-brand', top, 'TASK HUB');
      u.el('span', 'ds-tag', top, 'Simple tools for real work.');
      const prof = u.el('span', 'ds-profile', top, 'Profile');
      const ic = u.el('i', '', prof);
      ic.innerHTML = USER;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      if (env.episode && env.episode.perturb === 'banner') content.classList.add('ds-reserve');
      Object.assign(_c, { header: top, content, prof });
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.content;
      base(_c);
      _c.header = header;
      const note = _c.content.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('ds-tools');
      _c.header.insertBefore(_c.headerTools, _c.prof);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
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
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      if (ctx.kind === 'banner') {
        const ic = u.el('i', 'ds-mega', el);
        ic.innerHTML = MEGA;
        const tx = u.el('div', 'ds-ann', el);
        u.el('h1', '', tx, 'ANNOUNCEMENT');
        u.el('p', '', tx, 'Important: Please read this update before continuing.');
        const dismiss = u.el('button', 'ds-collapse', el, 'Collapse announcement');
        u.el('b', '', dismiss, '');
        dismiss.addEventListener('click', () => ctx.dismiss('close'));
        return { el, dismiss, ttlSteps: 0 };
      }
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-type-text-multi-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-multi-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ffdf3d'],
      LOW_ACCENTS: ['#ffdf3d'],
      parts,
    },
  });
})();
