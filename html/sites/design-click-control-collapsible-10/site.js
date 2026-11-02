(function () {
  'use strict';
  const cfg = {
    title: 'Project Notebook',
    menus: ['File', 'Edit', 'Document', 'Organize', 'View', 'Help'],
    tabs: [
      ['Project', 'M5 2h14v20H5zM8 8h8M8 12h8M8 16h8'],
      ['Notes', 'M4 3h16v18H4zM7 8h10M7 11h10M7 14h10M7 17h10'],
      ['Ideas', 'M12 2a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10zM9 18h6M10 21h4'],
      ['Archive', 'M3 4h18v5H3zM5 9v11h14V9M9 13h6'],
    ],
  };
  const palette = { bg: '#cfcbc0', panel: '#f5f2e8', fg: '#111111', muted: '#5f5c55', line: '#111111' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The notebook's small side card and title-area notice fit at these sizes.
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'panel' && _c.W < 1200) _c.display = 'header';
      if (_c.display === 'toast' && _c.H < 680) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'lisa', 'book');
      const bar = u.el('header', 'menubar', document.body);
      const ap = u.el('span', 'apple', bar);
      ap.innerHTML =
        '<svg viewBox="0 0 16 18"><path d="M11 1c0 1.5-1 3-2.600 3.200C8.300 2.600 9.500 1.200 11 1zM8 5c1-.6 2.500-.8 3.700.3-1.800 1-1.500 3.600.5 4.400-.6 2-2.100 4.300-3.700 4.300-.8 0-1-.5-2-.5s-1.300.5-2 .5C2.500 14 1 10 2 7.500 3 5.500 5.800 4.400 8 5z"/></svg>';
      cfg.menus.forEach((m) => u.el('span', 'mi', bar, m));
      const clk = u.el('span', 'clock', bar);
      clk.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M3 3h15l3 3v15H3zM7 3v6h9V3M7 21v-7h10v7"/></svg><b>Mon Apr 22</b><b>10:24 AM</b>';
      const spiral = u.el('div', 'spiral', document.body);
      for (let i = 0; i < 11; i++) u.el('i', '', spiral);
      const rail = u.el('nav', 'rail', document.body);
      cfg.tabs.forEach((t, i) => {
        const d = u.el('div', 'tab' + (i === 0 ? ' active' : ''), rail);
        const ic = u.el('span', 'ic', d);
        ic.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + t[1] + '"/></svg>';
        u.el('span', '', d, t[0]);
      });
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, cfg.title);
      u.el('div', 'subtitle', head, 'Research & Planning');
      Object.assign(_c, { shell, head, header: shell });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.shell.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.shell;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.shell.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.shell);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.head.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('footer', 'footer', _c.shell);
      const act = (label, expand) => {
        const b = u.el('button', 'abtn', foot, label);
        b.type = 'button';
        b.addEventListener('click', () => {
          _c.stage.querySelectorAll('.uc-sec-h').forEach((h) => {
            if ((h.getAttribute('aria-expanded') === 'true') !== expand) h.click();
          });
        });
      };
      act('Expand All', true);
      act('Collapse All', false);
      base(_c);
      foot.appendChild(document.body.querySelector('.ref-foot'));
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-click-control-collapsible-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { lisa: palette },
      LOW_THEME: palette,
      ACCENTS: ['#111111'],
      LOW_ACCENTS: ['#111111'],
      parts,
    },
  });
})();
