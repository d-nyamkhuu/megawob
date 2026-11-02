(() => {
  'use strict';
  const cfg = {
    title: 'Event Planner',
    tools: 'Plan Event     Guests     Venue     Summary',
    rail: '1|Event Details|2|Guests|3|Venue|4|Catering|5|Review',
    side: 'Event Setup|Plan the details|Set the guest count|Choose a venue|Add notes'
  };
  const palette = { bg: '#9fc4e8', panel: '#fbfaf3', fg: '#09285d', muted: '#31537d', line: '#83a9d2' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated inspector for both panel and toast notes.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'flash', 'planner');
      document.body.dataset.display = _c.display;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, cfg.title);
      const toolbar = u.el('nav', 'tools', head);
      cfg.tools.trim().split(/\s{2,}/).forEach((s, i) => {
        const tab = u.el('div', i === 0 ? 'tool-tab selected' : 'tool-tab', toolbar, s);
        tab.setAttribute('aria-current', i === 0 ? 'page' : 'false');
      });
      const work = u.el('div', 'work', shell);
      const rail = u.el('nav', 'rail', work);
      cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      const center = u.el('section', 'center', work);
      const appearance = u.el('section', 'appearance-heading', center);
      u.el('h2', '', appearance, 'Event Details');
      u.el('p', '', appearance, '');
      const aside = u.el('aside', 'inspector', work);
      Object.assign(_c, { shell, work, center, aside, toolbar, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const note = _c.aside.querySelector('.ref-panel');
      if (note) note.classList.add('instruction', 'instruction-panel');
      cfg.side.split('|').forEach((s, i) => _c.util.el(i === 0 ? 'h2' : 'p', i === 1 ? 'k' : '', _c.aside, s));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        _c.aside.prepend(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = '';
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
    }
  };
  env.site({
    name: 'design-handle-text-spinner-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-spinner-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#194b98'],
      LOW_ACCENTS: ['#194b98'],
      parts
    }
  });
})();
