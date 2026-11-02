(function () {
  'use strict';
  const cfg = {
    title: 'The Daily Chronicle',
    tools: 'TUESDAY, APRIL 12, 2011\nNews   |   Business   |   Sports   |   Life',
    rail: 'Print|Text Size|Copy Link|Save',
    overview: 'Riverside Park to Get Major Upgrade|LOCAL NEWS|City council approves funding for new trails, lighting and green spaces.|By Emily Carter     April 12, 2011|The city council voted unanimously Monday night to fund a major upgrade to Riverside Park, a project that will add new walking trails, improved lighting and expanded green spaces. Construction is expected to begin this summer, with much of the work completed by next spring.|Mayor Thomas Reed called the project “a big step forward for a healthier, more connected community,” noting that the park is one of the city’s most treasured public spaces.|Residents have long advocated for improvements, and city officials say the upgrades will make the park more accessible and enjoyable for families, joggers and visitors year-round.|Share this article:     ✉ Email     ▣ Facebook     ♥ Twitter',
  };
  const palette = { bg: '#fdfcf8', panel: '#fff', fg: '#11131a', muted: '#4b4850', line: '#d1cfca' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes use the open left margin, including at small viewports.
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
      document.body.className = 'ref news offset';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'tools', head, cfg.tools);
      u.el('div', 'title', head, cfg.title);
      const ov = u.el('section', 'overview', shell);
      cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
      Object.assign(_c, { shell, header: head });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction', 'instruction-header');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('news-toptools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'work', _c.shell);
      const rail = u.el('nav', 'rail', body);
      cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      const center = u.el('section', 'center', body);
      Object.assign(_c, { body, center });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
      const note = _c.center.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction', 'instruction-panel');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready.';
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
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
    name: 'design-handle-text-copy-paste-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#b20f17'],
      LOW_ACCENTS: ['#b20f17'],
      parts,
    },
  });
})();
