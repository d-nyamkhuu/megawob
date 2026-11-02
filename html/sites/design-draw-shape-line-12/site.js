(function () {
  'use strict';
  const C = {
    'theme': 'portal',
    'layout': 'portal',
    'title': 'WorldWeb Directory',
    'accent': '#1a2fc0',
    'bg': '#cdd3ea',
    'surface': '#fff',
    'font': 'Arial, Helvetica, sans-serif',
  };
  const CATS = [
    ['Arts & Humanities', ['Literature', 'History', 'Philosophy', 'The Arts']],
    ['Business & Economy', ['Companies', 'Jobs', 'Investing', 'Small Business']],
    ['Computers & Internet', ['Hardware', 'Software', 'Internet', 'Programming']],
    ['Education', ['Schools', 'Colleges', 'Libraries', 'Reference']],
    ['Health & Science', ['Health', 'Medicine', 'Science', 'Environment']],
    ['News & Media', ['Newspapers', 'Magazines', 'Radio', 'Television']],
    ['Recreation & Sports', ['Travel', 'Outdoors', 'Sports', 'Hobbies']],
    ['Society & People', ['Government', 'Law', 'People Finder', 'Community']],
  ];
  const palette = { bg: C.bg, panel: C.surface, fg: '#111', muted: '#555', line: '#8a93c4' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util, body = document.body;
      body.classList.add('design', 'portal', 'layout-portal');
      document.documentElement.style.setProperty('--font', C.font);
      const noop = (a) => {
        a.href = '#';
        a.onclick = (ev) => ev.preventDefault();
        return a;
      };
      const shell = u.el('div', 'shell', body),
        head = u.el('header', 'head', shell);
      const globe = u.svg('svg', { class: 'globe', viewBox: '0 0 64 64' }, head);
      const gd = u.svg('defs', {}, globe),
        gg = u.svg('radialGradient', { id: 'globe-blue', cx: '30%', cy: '25%', r: '80%' }, gd);
      u.svg('stop', { offset: 0, 'stop-color': '#5edaff' }, gg);
      u.svg('stop', { offset: 1, 'stop-color': '#0074bd' }, gg);
      u.svg(
        'ellipse',
        { cx: 32, cy: 32, rx: 30, ry: 31, fill: 'url(#globe-blue)', stroke: '#001427', 'stroke-width': 2 },
        globe,
      );
      u.svg(
        'path',
        {
          d: 'M14 8L24 5L29 9L26 16L20 17L18 25L12 27L10 22L5 23L7 15ZM34 4L45 7L48 14L43 18L36 14L33 9ZM37 20L46 19L54 25L53 33L47 35L44 43L41 42L38 33L32 28ZM19 35L27 34L34 40L30 47L27 49L26 57L21 53L19 44L15 41ZM48 48L55 46L55 52L50 55Z',
          fill: '#55b919',
          stroke: '#133c05',
          'stroke-width': 1,
        },
        globe,
      );
      u.svg(
        'path',
        {
          d: 'M32 1C13 17 13 47 32 63M32 1C51 17 51 47 32 63M32 1V63M6 16Q32 25 58 16M2 32H62M6 48Q32 39 58 48M14 6Q32 16 50 6M14 58Q32 48 50 58',
          fill: 'none',
          stroke: '#002a40',
          'stroke-width': 1.4,
        },
        globe,
      );
      const brand = u.el('div', 'brand', head);
      u.el('div', 'brand-name', brand, 'WorldWeb Directory');
      u.el('div', 'brand-sub', brand, 'Your Guide to the Internet');
      u.el('div', 'year', head, '1998');
      const sr = u.el('div', 'search', head);
      u.el('label', '', sr, 'Search the Web:');
      const inp = u.el('div', 'search-box', sr);
      u.el('button', 'search-btn', sr, 'Search').type = 'button';
      const links = u.el('div', 'toplinks', head);
      ['Home', 'Site Map', 'Help'].forEach((t, i) => {
        if (i) u.el('span', '', links, '|');
        noop(u.el('a', '', links, t));
      });
      u.el('div', 'rule', shell);
      const strip = u.el('nav', 'strip', shell);
      for (const [h, items] of CATS) {
        const col = u.el('div', 'cat', strip);
        noop(u.el('a', 'cat-h', col, h));
        for (const t of items) noop(u.el('a', 'cat-l', col, t));
      }
      u.el('div', 'rule thick', shell);
      const main = u.el('section', 'pt-main', shell);
      const note = u.el('div', 'task-note', main);
      note.hidden = _c.display !== 'header';
      const footer = u.el('footer', 'footer', shell);
      footer.classList.add('display-' + _c.display);
      const ins = u.el('div', 'ins', footer);
      ins.hidden = _c.display !== 'panel' && _c.display !== 'toast';
      if (_c.display === 'panel' || _c.display === 'toast') {
        ins.classList.add(_c.display === 'panel' ? 'episode-panel' : 'episode-toast');
        main.classList.add('instruction-in-footer');
      }
      Object.assign(_c, { shell, head, main, footer, ins, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('portal-header-end');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'pt-row', _c.main);
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.ins });
    },
    'frame.stage': () => (_c) => {
      const u = _c.util, row = _c.body;
      _c.stage = u.el('main', 'stage', row);
      _c.stage.dataset.role = 'stage';
      const aside = u.el('aside', 'tools', row);
      u.el('div', 'tools-h', aside, 'Drawing Tools');
      const pencil = u.el('button', 'tool on', aside);
      pencil.type = 'button';
      const pi = u.svg('svg', { class: 'ticon', viewBox: '0 0 64 64' }, pencil);
      u.svg(
        'path',
        {
          d: 'M10 54L15 36L43 8Q45 6 47 8L56 17Q58 19 55 22L28 49Z',
          fill: '#090909',
          stroke: '#111',
          'stroke-width': 1.5,
          'stroke-linejoin': 'round',
        },
        pi,
      );
      u.svg(
        'path',
        {
          d: 'M15 36L28 49L10 54ZM40 11L52 23M19 36L40 15M22 39L43 18',
          fill: 'none',
          stroke: '#fff',
          'stroke-width': 2,
        },
        pi,
      );
      u.svg('path', { d: 'M12 50L15 40L23 48Z', fill: '#eee' }, pi);
      u.el('span', '', pencil, 'Freehand Pencil');
      const quick = u.el('button', 'tool quick', aside);
      quick.type = 'button';
      quick.disabled = true;
      const qi = u.svg('svg', { class: 'ticon', viewBox: '0 0 64 64' }, quick);
      u.svg('path', { d: 'M31 10L18 33H28L22 54L46 26H34L43 10Z', fill: '#a4a7aa' }, qi);
      const qt = u.el('span', '', quick, 'Quick action');
      u.el('small', '', qt, '(disabled)');
      const clr = u.el('button', 'tool clear', aside);
      clr.type = 'button';
      const ci = u.svg('svg', { class: 'ticon', viewBox: '0 0 64 64' }, clr);
      u.svg(
        'path',
        {
          d: 'M15 40L38 14Q40 12 43 14L52 23Q54 25 51 28L31 52H24L16 45Z',
          fill: '#fff',
          stroke: '#111',
          'stroke-width': 2,
          'stroke-linejoin': 'round',
        },
        ci,
      );
      u.svg('path', { d: 'M24 29L39 13L53 25L38 42Z', fill: '#080808' }, ci);
      u.svg('path', { d: 'M29 30L42 17M17 40L31 52', stroke: '#aaa', 'stroke-width': 2 }, ci);
      u.el('span', '', clr, 'Clear');
      clr.onclick = () => {
        env.widgetDef.clear?.();
      };
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.util.el('h3', '', note, 'Notice');
        _c.ins.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.footer.appendChild(foot);
      const reset = _c.util.el('button', 'reset', _c.footer, 'Reset');
      reset.type = 'button';
      reset.onclick = () => {
        env.widgetDef.clear?.();
      };
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.insertBefore(dock, _c.footer.querySelector('.reset'));
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title =
        {
          cookie: 'Your privacy',
          toast: 'Changes saved',
          chat: 'Support',
          promo: 'Directory update',
          banner: 'Service notice',
        }[kind] || 'Notice';
      const text =
        {
          cookie: 'This site stores optional cookies.',
          toast: 'Your changes have been saved.',
          chat: 'Need a hand with this page?',
          promo: 'Explore the latest directory features.',
          banner: 'You are viewing a shared page.',
        }[kind] || '';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => {
        ctx.dismiss('close');
      };
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-draw-shape-line-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'portal.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: [C.accent], LOW_ACCENTS: [C.accent], parts,
    },
  });
})();
