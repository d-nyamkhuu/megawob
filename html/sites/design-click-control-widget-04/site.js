(function () {
  'use strict';
  const cfg = {
    'title': 'Skill Practice',
    'sub': 'Interactive Tasks',
    'tag': 'A Brighter|Way to Work',
    'panelTitle': 'Your Task',
    'hint': 'Look at the controls on the right.|Find the widget and click it.',
    'formTitle': 'Sample Form',
    'formSub': 'This form shows several common widgets.',
    'dismiss': 'Skip tour',
    'obstacle': 'Welcome!',
    'copy': 'This short tour will show you around the interface.',
  };
  const LEAF =
    '<svg viewBox="0 0 200 110" preserveAspectRatio="xMaxYMax meet"><defs><linearGradient id="lf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d7f08a"/><stop offset=".5" stop-color="#6cbf2a"/><stop offset="1" stop-color="#2f8a1c"/></linearGradient></defs><path d="M118 108C100 70 112 26 150 2c20 36 14 78-32 106Z" fill="url(#lf)"/><path d="M118 108C128 70 138 40 150 2" stroke="#e9ffb8" stroke-width="2" fill="none" opacity=".7"/><path d="M96 108C90 84 96 66 110 52c8 20 4 40-14 56Z" fill="#4aa322"/><path d="M60 78c24 6 40 18 50 30-24 2-42-8-50-30Z" fill="#5db82a"/><path d="M0 108c40-14 90-18 200-6v6Z" fill="#a8d96a" opacity=".6"/></svg>';
  const ICONS = {
    help: '<svg viewBox="0 0 60 60"><defs><linearGradient id="hg" x2="0" y2="1"><stop stop-color="#c4eb83"/><stop offset=".42" stop-color="#79c12f"/><stop offset=".47" stop-color="#66b526"/><stop offset="1" stop-color="#3b8f15"/></linearGradient></defs><circle cx="30" cy="30" r="27" fill="url(#hg)" stroke="#66a322" stroke-width="2"/><path d="M8 25C10 5 44-3 53 24" fill="none" stroke="#e1f8bd" stroke-width="2"/><text x="30" y="46" text-anchor="middle" font-size="45" font-weight="700" fill="#fff" font-family="Arial">?</text></svg>',
    clear:
      '<svg viewBox="0 0 60 60"><defs><linearGradient id="paper" x2="1" y2="1"><stop stop-color="#fff"/><stop offset=".6" stop-color="#f9fdff"/><stop offset="1" stop-color="#c1ddfa"/></linearGradient><linearGradient id="fold" x2="0" y2="1"><stop stop-color="#f4fbff"/><stop offset="1" stop-color="#aacdec"/></linearGradient></defs><path d="M11 4h29l12 13v40H11Z" fill="#5496d0" opacity=".2" transform="translate(1 1)"/><path d="M10 3h28l13 13v40H10Z" fill="url(#paper)" stroke="#5599da" stroke-width="1.7" stroke-linejoin="round"/><path d="M38 3v13h13" fill="url(#fold)" stroke="#6d9ed0" stroke-width="1.5"/><path d="M18 25h24M18 31h24M18 37h24M18 43h24" stroke="#4799df" stroke-width="2"/><path d="M12 5v49h37" fill="none" stroke="#fff"/></svg>',
    reset:
      '<svg viewBox="0 0 60 60"><defs><linearGradient id="rg" x2="0" y2="1"><stop stop-color="#bee763"/><stop offset=".44" stop-color="#91cf3c"/><stop offset="1" stop-color="#4da323"/></linearGradient></defs><path d="M2 52C3 25 18 16 35 17V4l24 22-24 22V34C18 34 9 41 2 52Z" fill="url(#rg)" stroke="#5a9a20" stroke-width="1.8" stroke-linejoin="round"/><path d="M5 43C9 23 21 19 38 20V8l17 17" fill="none" stroke="#e4f7a4" stroke-width="1.4" stroke-linejoin="round"/></svg>',
  };
  const palette = { bg: '#a9dcfa', panel: '#fff', fg: '#233654', muted: '#526078', line: '#bcd6ee' };
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
      document.body.classList.add('ref', 'aero');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const sky = u.el('div', 'sky', head);
      sky.innerHTML = LEAF;
      const brand = u.el('div', 'brand', head);
      u.el('span', 'globe', brand);
      const bt = u.el('div', 'brandtext', brand);
      u.el('div', 'bname', bt, cfg.title);
      u.el('div', 'bsub', bt, cfg.sub);
      const tag = u.el('div', 'tagline', head);
      cfg.tag.split('|').forEach((s) => u.el('div', '', tag, s));
      const left = u.el('aside', 'taskpanel');
      const briefing = u.el('header', 'task-briefing', left);
      u.el('h2', '', briefing, cfg.panelTitle);
      Object.assign(_c, { shell, head, left, header: briefing });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'work', _c.shell);
      body.appendChild(_c.left);
      const hint = u.el('p', 'hint', _c.left);
      hint.innerHTML = cfg.hint.split('|').join('<br>');
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      if (_c.display === 'panel') {
        const details = _c.util.el('section', 'task-details', _c.left);
        _c.util.el('h3', '', details, 'Task details');
        base({ ..._c, body: details });
        details.querySelector('.ref-panel-text').classList.add('instruction', 'instruction-panel');
      } else base(_c);
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const right = u.el('section', 'formpanel', _c.body);
      u.el('h2', 'formtitle', right, cfg.formTitle);
      u.el('p', 'formsub', right, cfg.formSub);
      _c.stage = u.el('div', 'stage', right);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        _c.left.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const actions = foot.querySelector('.ref-tools');
      actions.classList.add('actions');
      const tools = u.el('div', 'tools');
      foot.insertBefore(tools, actions);
      [['help', 'Help'], ['clear', 'Clear'], ['reset', 'Reset']].forEach((p) => {
        const t = u.el('div', 'tool', tools);
        u.el('span', 'ticon', t).innerHTML = ICONS[p[0]];
        u.el('span', 'tlabel', t, p[1]);
      });
      if (!_c.ctx.finish) foot.insertBefore(u.el('span', 'sep'), actions);
      else u.el('span', 'footer-status', actions, 'Skill Practice · Interactive Tasks');
      Object.assign(_c, { foot, actions });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.actions.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      if (ctx.kind === 'chat') {
        ctx.util.el('strong', '', el, cfg.obstacle);
        ctx.util.el('p', '', el, cfg.copy);
        const d = ctx.util.el('button', 'dismiss', el, cfg.dismiss);
        d.type = 'button';
        d.addEventListener('click', ctx.dismiss);
        const next = ctx.util.el('button', 'next-design', el, 'Next');
        next.type = 'button';
        next.addEventListener('click', ctx.dismiss);
        const x = ctx.util.el('button', 'x-design', el, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close tour');
        x.addEventListener('click', ctx.dismiss);
        return { el, dismiss: d };
      }
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
    name: 'design-click-control-widget-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-widget-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0f7ae8'],
      LOW_ACCENTS: ['#0f7ae8'],
      parts,
    },
  });
})();
