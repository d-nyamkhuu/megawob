(function () {
  'use strict';
  const cfg = {
    title: 'Widget Trainer',
    obstacle: 'Welcome!',
    copy: 'This short tour will show you around the interface.',
    dismiss: 'Skip tour',
  };
  const palette = { bg: '#efefef', panel: '#efefef', fg: '#000000', muted: '#515b6a', line: '#000000' };
  function styleNote(_c, note) {
    if (!note) return;
    note.classList.add('instruction');
    note.dataset.display = _c.display;
    if (_c.ctx.instruction.length > 75) note.classList.add('instruction-long');
    const limit = _c.work.getBoundingClientRect().height * 0.46;
    let size = parseFloat(getComputedStyle(note).fontSize);
    while (size > 16 && note.offsetTop + note.offsetHeight > limit) {
      size -= 1;
      note.style.fontSize = size + 'px';
    }
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original keeps all note modes in the same reserved area.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'brutal', 'board');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, cfg.title);
      const tools = u.el('div', 'tools', head);
      ['Practice interacting', 'with common UI elements.'].forEach((s) => u.el('div', '', tools, s));
      const badge = u.el('div', 'badge', head, 'Lesson 1/3');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      Object.assign(_c, { shell, head, badge, work, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      styleNote(_c, _c.header.querySelector('.ref-instruction'));
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
      _c.badge.hidden = _c.headerTools.children.length > 0;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
      styleNote(_c, _c.center.querySelector('.ref-panel'));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.center.appendChild(note);
        styleNote(_c, note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Training Mode';
      _c.util.el('span', 'stepinfo', foot, 'Step 1 of 1   |   Time: Paused');
      _c.foot = foot;
      // Size the note after the status bar establishes the work area's final height.
      styleNote(_c, _c.center.querySelector('.instruction'));
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      if (ctx.kind === 'chat') {
        const el = ctx.util.el('section', 'perturb chat tour-overlay', document.body);
        ctx.util.el('h2', '', el, cfg.obstacle);
        ctx.util.el('p', '', el, cfg.copy);
        const dismiss = ctx.util.el('button', 'dismiss-design', el, cfg.dismiss);
        dismiss.type = 'button';
        dismiss.addEventListener('click', ctx.dismiss);
        const next = ctx.util.el('button', 'next-design', el, 'Next');
        next.type = 'button';
        next.addEventListener('click', ctx.dismiss);
        const x = ctx.util.el('button', 'x-design', el, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close tour');
        x.addEventListener('click', ctx.dismiss);
        return { el, dismiss };
      }
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong', '', el,
        { cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support', promo: 'A special offer', banner: 'Service notice' }[ctx.kind],
      );
      ctx.util.el(
        'p', '', el,
        { cookie: 'Choose your preferences to continue.', toast: 'Your workspace is ready.', chat: 'How can we help?', promo: 'Explore the latest tools.', banner: 'A new update is available.' }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    initialOverlay: { kind: 'chat' },
    name: 'design-click-control-widget-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-widget-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ffdf32'],
      LOW_ACCENTS: ['#ffdf32'],
      parts,
    },
  });
})();
