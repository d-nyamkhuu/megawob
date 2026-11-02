(function () {
  'use strict';
  const palette = { bg: '#f7f8fa', panel: '#096cc3', fg: '#0f172a', muted: '#66707d', line: '#bbc2c9' };
  // Preserve the original emphasis inside the template-owned instruction text.
  function styleInstruction(note) {
    if (!note) return;
    note.classList.add('ds-instruction');
    const text = note.textContent;
    note.textContent = '';
    text.split(/("[^"]*"|“[^”]*”)/g).forEach((part, i) => {
      const span = document.createElement('span');
      if (i % 2) span.className = 'ds-credential';
      span.textContent = part;
      note.appendChild(span);
    });
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
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
      u.el('span', 'ds-brand', top, 'NEXA');
      const tr = u.el('span', 'ds-toplinks', top);
      const help = u.el('span', '', tr, 'Help');
      help.addEventListener('click', () => env.log('decoy', { label: 'Help' }));
      u.el('i', '', tr);
      const signIn = u.el('span', '', tr, 'Sign In');
      const body = u.el('div', 'ds-body');
      const left = u.el('aside', 'ds-left', body);
      const eb = u.el('div', 'ds-eyebrow', left);
      u.el('span', '', eb, 'Secure Access');
      u.el('i', '', eb);
      const eb2 = u.el('div', 'ds-eyebrow ds-eyebrow2', left);
      u.el('span', '', eb2, 'Access your account');
      u.el('i', '', eb2);
      Object.assign(_c, { top, tr, signIn, body, left, eb2, header: left });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction, .ref-spacer');
      styleInstruction(_c.header.querySelector('.ref-instruction'));
      if (note) _c.left.insertBefore(note, _c.eb2);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tr;
      base(_c);
      _c.header = header;
      _c.tr.insertBefore(_c.headerTools, _c.signIn);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      document.body.appendChild(_c.body);
      const content = u.el('div', 'ds-content', _c.body);
      u.el('div', 'ds-kicker', content, 'Sign in');
      u.el('h1', 'ds-welcome', content, 'Welcome back');
      const main = u.el('div', 'ds-main', content);
      const foot = u.el('footer', 'ds-footer', content);
      const hb = u.el('div', 'ds-helpbtn', content, 'Help');
      hb.addEventListener('click', () => env.log('decoy', { label: 'Help' }));
      hb.insertAdjacentHTML('afterbegin', '<svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#fff" stroke-width="2"><circle cx="15" cy="15" r="11"/><path d="M12 12a3 3 0 1 1 4 3c-1 .6-1 1.200-1 2"/><circle cx="15" cy="21" r=".6"/></svg>');
      Object.assign(_c, { content, main, foot });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.left;
      base(_c);
      _c.body = body;
      const panel = _c.left.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-episode-panel');
        panel.querySelector('.ref-panel-title').classList.add('ds-episode-caption');
        styleInstruction(panel.querySelector('.ref-panel-text'));
        _c.left.insertBefore(panel, _c.eb2);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-episode-toast');
        const caption = _c.util.el('div', 'ds-episode-caption', null, 'Access request');
        note.insertBefore(caption, note.firstChild);
        styleInstruction(note.querySelector('.ref-note-text'));
        _c.left.insertBefore(note, _c.eb2);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.foot.appendChild(foot);
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
    name: 'design-type-text-login-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#2598f3'],
      LOW_ACCENTS: ['#2598f3'],
      parts,
    },
  });
})();
