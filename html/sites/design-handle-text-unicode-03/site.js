(function () {
  'use strict';
  const palette = { bg: '#6f8ba5', panel: '#ffffff', fg: '#173b70', muted: '#627a9b', line: '#9ab2ca' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The notebook already has responsive layouts for each note display.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'ribbon', 'board');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, 'My Notebook - Practice - NoteStudio');
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const toolbar = u.el('div', 'tools', head);
      ['Home', 'Insert', 'Format', 'Tools', 'View', 'Help'].forEach((t, i) => {
        const item = u.el('span', 'menu-item' + (i === 0 ? ' active' : ''), toolbar, t);
        item.dataset.tab = t;
      });
      const ribbon = u.el('div', 'ribbon', head);
      [
        ['Clipboard', ['New Page', 'Save', 'Cut', 'Copy', 'Paste']],
        ['Text Formatting', ['Font', 'Bullets', 'Numbering', 'Increase Indent', 'Decrease Indent']],
        ['Insert', ['Picture', 'Table', 'Link']],
        ['Editing', ['Spelling', 'Find', 'Replace']],
      ].forEach((group, gi) => {
        const g = u.el('section', 'ribbon-group', ribbon);
        const row = u.el('div', 'ribbon-items', g);
        group[1].forEach((label, i) => {
          const b = u.el('div', 'ribbon-tool', row);
          u.el('span', 'ribbon-icon', b,
            ['▤', '▣', '✂', '▢', '▣', 'A', '☷', '≡', '⇥', '⇤', '▧', '▦', '🔗', '✓', '⌕', '♟'][
              gi === 0 ? i : gi === 1 ? i + 5 : gi === 2 ? i + 10 : i + 13
            ]);
          u.el('span', 'ribbon-label', b, label);
        });
        u.el('div', 'ribbon-caption', g, group[0]);
      });
      const center = u.el('section', 'center');
      center.dataset.display = _c.display;
      Object.assign(_c, { shell, toolbar, center, header: center });
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
      _c.headerTools.classList.add('episode-tools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const work = u.el('div', 'work', _c.shell);
      const rail = u.el('nav', 'rail', work);
      ['Tasks', 'Notes', 'Ideas', 'Reference', 'Archive'].forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      work.appendChild(_c.center);
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('page-end');
        _c.center.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        const strip = _c.util.el('div', 'page-end', _c.center);
        strip.appendChild(dock);
      }
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
    name: 'design-handle-text-unicode-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-unicode-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1473c7'],
      LOW_ACCENTS: ['#1473c7'],
      parts,
    },
  });
})();
