(function () {
  'use strict';

  const palette = { bg: '#f6f7f9', panel: '#ffffff', fg: '#1a2036', muted: '#657187', line: '#dce1e8' };
  const infoSVG = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12"/><circle cx="12" cy="6.8" r="1.4" fill="#f5f8ff"/><path d="M12 11.5v5.8" stroke="#f5f8ff" stroke-width="2.5" stroke-linecap="round"/></svg>';
  function decorate(_c, note, text) {
    if (!note) return;
    note.classList.add('instruction');
    note.dataset.display = _c.display;
    if (_c.display === 'toast') note.classList.add('instruction-toast');
    if (_c.ctx.instruction.length > 75) note.classList.add('long-instruction');
    const icon = _c.util.el('span', 'info');
    icon.innerHTML = infoSVG;
    note.insertBefore(icon, note.firstChild);
    if (text) text.classList.add('itext');
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original card accommodates every display at every viewport.
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
      document.body.classList.add('ref', 'paper');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const menu = u.el('span', 'hamb', head);
      menu.innerHTML = '<svg viewBox="0 0 30 22"><path d="M0 2h30M0 11h30M0 20h20"/></svg>';
      u.el('div', 'title', head, 'Project Workspace');
      u.el('div', 'acct', head, 'A');
      const card = u.el('section', 'card', shell);
      card.dataset.display = _c.display;
      Object.assign(_c, { shell, head, card, header: card });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.card.querySelector('.ref-instruction');
      if (note) {
        const text = _c.util.el('span', 'itext');
        while (note.firstChild) text.appendChild(note.firstChild);
        note.appendChild(text);
        decorate(_c, note, text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('head-end-tools');
    },
    'frame.body': () => (_c) => { _c.body = _c.card; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.card.querySelector('.ref-panel');
      if (panel) decorate(_c, panel, panel.querySelector('.ref-panel-text'));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.card);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        decorate(_c, note, note.querySelector('.ref-note-text'));
        _c.card.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.card.appendChild(foot);
      const cancel = _c.util.el('button', 'cancel', null, 'Cancel');
      cancel.type = 'button';
      foot.insertBefore(cancel, foot.firstChild);
      foot.querySelector('.ref-tools').classList.add('footer-end-tools');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el('strong', '', el, { cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support', promo: 'A special offer', banner: 'Service notice' }[ctx.kind]);
      ctx.util.el('p', '', el, { cookie: 'Choose your preferences to continue.', toast: 'Your workspace is ready.', chat: 'How can we help?', promo: 'Explore the latest tools.', banner: 'A new update is available.' }[ctx.kind]);
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-collapsible-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-collapsible-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3a52b4'],
      LOW_ACCENTS: ['#3a52b4'],
      parts,
    },
  });
})();
