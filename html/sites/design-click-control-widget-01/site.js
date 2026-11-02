(function () {
  'use strict';
  const cfg = {
    title: 'Feedback Form',
    side: 'Inspector|Widget type|—|Label|—|State|—|Position|—|Size|—',
    obstacle: 'Welcome!',
    copy: 'This short tour will show you around the interface.',
    dismiss: 'Skip tour',
  };
  const palette = { bg: '#f4f3ee', panel: '#f4f3ee', fg: '#000000', muted: '#444444', line: '#000000' };
  const markNote = (_c, note, mode) => {
    if (!note) return;
    note.classList.add('instruction');
    if (mode !== 'header') note.classList.add('instruction-' + mode);
    note.classList.toggle('instruction-long', _c.ctx.instruction.length > 36);
    note.dataset.display = mode;
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original inspector and inline notification fit at every viewport.
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
      document.body.classList.add('ref', 'eink', 'board');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      title.insertAdjacentHTML('afterbegin', '<svg class="eink-ico" viewBox="0 0 16 16"><path d="M12 6V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2M2 7h12V5a3 3 0 0 0-3-3M6 2v9h4M9 6v6"/></svg>');
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML = '<i><svg viewBox="0 0 16 16"><path d="M3 8h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      u.el('h1', 'eink-h', center, 'We value your feedback');
      u.el('p', 'eink-sub', center, 'Please complete the form below.');
      Object.assign(_c, { shell, head, work, center, header: head });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      markNote(_c, _c.center.querySelector('.ref-instruction'), 'header');
      const spacer = _c.center.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const aside = _c.util.el('aside', 'inspector', _c.work);
      cfg.side.split('|').forEach((s, i) => _c.util.el(i === 0 ? 'h2' : 'p', '', aside, s));
      Object.assign(_c, { body: _c.work, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      markNote(_c, _c.aside.querySelector('.ref-panel'), 'panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        markNote(_c, note, 'toast');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Training Mode';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.shell.appendChild(dock);
    },
    overlay: () => (ctx) => {
      if (ctx.kind === 'chat') {
        const old = document.querySelector('.design-obstacle');
        if (old) old.hidden = true;
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
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-widget-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-widget-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000000'],
      LOW_ACCENTS: ['#000000'],
      parts,
    },
  });
})();
