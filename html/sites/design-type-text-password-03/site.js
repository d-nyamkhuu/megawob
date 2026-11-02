(function () {
  'use strict';
  const palette = { bg: '#0e1319', panel: '#131a22', fg: '#e2e8f2', muted: '#a1b2c9', line: '#26303c' };

  // Decorate the template's note, leaving its text and dismissal control intact.
  function styleNote(_c, note, text, compact) {
    const u = _c.util;
    note.classList.add('ds-imp');
    if (compact) note.classList.add(compact);
    if (text.textContent.length > 75) note.classList.add('ds-imp-long');
    const icon = u.el('div', 'ds-imp-ico', null, '!');
    note.prepend(icon);
    const copy = u.el('div', 'ds-imp-copy', note);
    const title = note.querySelector('.ref-panel-title');
    if (title) {
      title.classList.add('ds-imp-tag');
      title.textContent = 'IMPORTANT';
      copy.appendChild(title);
    } else u.el('div', 'ds-imp-tag', copy, 'IMPORTANT');
    text.classList.add('ds-instruction');
    const instruction = text.textContent;
    text.textContent = '';
    instruction.split(/("[^"]*")/g).forEach((value, index) => {
      u.el(index % 2 ? 'strong' : 'span', '', text, value);
    });
    copy.appendChild(text);
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original side pane has room for its note even at the smallest viewport.
      _c.display = _c.ctx.display || 'panel';
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
      const body = u.el('div', 'ds-body', document.body);
      const brief = u.el('aside', 'ds-brief', body);
      u.el('div', 'ds-eyebrow', brief, 'Setup');
      u.el('h2', 'ds-title', brief, 'Create Your Account');
      u.el('p', 'ds-lead', brief, 'Follow the instructions to set a secure password for your new account.');
      const panelSlot = u.el('div', 'ds-panel-slot', brief);
      u.el('div', 'ds-req-h', brief, 'Password requirements');
      const ul = u.el('ul', 'ds-req', brief);
      [
        'At least 8 characters',
        'Include upper and lower case letters',
        'Include a number',
        'Include a special character',
      ].forEach((t) => u.el('li', '', ul, t));
      u.el('hr', 'ds-hr', brief);
      if (_c.display !== 'hidden') {
        u.el('p', 'ds-note', brief, 'Keep your password private. Use a unique password for each account.');
      }
      const toastSlot = u.el('div', 'ds-toast-slot', brief);
      const content = u.el('div', 'ds-right', body);
      u.el('div', 'ds-r-eyebrow', content, 'Account setup');
      u.el('h1', 'ds-r-title', content, 'Choose a password');
      u.el('p', 'ds-r-sub', content, 'This password will be used to sign in to your account.');
      const header = u.el('div', 'ds-header-slot', content);
      const topTools = u.el('div', 'ds-top-tools', content);
      const card = u.el('div', 'ds-card', content);
      const formTools = u.el('div', 'ds-form-tools', card);
      const footer = u.el('footer', 'ds-footer', card);
      Object.assign(_c, { body, brief, panelSlot, toastSlot, content, header, topTools, card, formTools, footer });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const text = _c.util.el('div', '', null);
        while (note.firstChild) text.appendChild(note.firstChild);
        styleNote(_c, note, text, 'ds-header-note');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.formTools;
      base(_c);
      _c.header = header;
      for (const button of _c.headerTools.querySelectorAll('.ref-xtra')) _c.topTools.appendChild(button);
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.panelSlot;
      base(_c);
      _c.body = body;
      const note = _c.panelSlot.querySelector('.ref-panel');
      if (note) styleNote(_c, note, note.querySelector('.ref-panel-text'));
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'ds-stage', _c.card);
      _c.card.prepend(stage);
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.toastSlot.appendChild(note);
        styleNote(_c, note, note.querySelector('.ref-note-text'), 'ds-brief-toast');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.footer.appendChild(foot);
        for (const button of foot.querySelectorAll('.ref-xtra')) _c.topTools.appendChild(button);
      }
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
    name: 'design-type-text-password-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-password-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#59dd59'],
      LOW_ACCENTS: ['#59dd59'],
      parts,
    },
  });
})();
