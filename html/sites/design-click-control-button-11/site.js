(function () {
  'use strict';
  const palette = { bg: '#7178af', panel: '#f6f6f6', fg: '#1c1c1c', muted: '#444', line: '#8a8a8a' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const { ctx } = _c;
      const u = _c.util;
      document.body.classList.add('ref', 'mac');
      const shell = u.el('main', 'shell', document.body);
      // menu bar
      const mb = u.el('header', 'menubar', shell);
      const apple = u.el('span', 'apple', mb);
      apple.innerHTML =
        '<svg viewBox="0 0 22 26"><defs><clipPath id="apple-shape"><path d="M11 7C4 3 0 10 3 17c2 6 4 8 8 6 4 2 6-1 8-5-5-2-5-7-1-9-2-3-5-3-7-2z"/></clipPath></defs><g clip-path="url(#apple-shape)"><path fill="#65b43c" d="M0 0h22v10H0z"/><path fill="#f7da32" d="M0 10h22v3H0z"/><path fill="#f49a30" d="M0 13h22v3H0z"/><path fill="#df4649" d="M0 16h22v3H0z"/><path fill="#9a439d" d="M0 19h22v3H0z"/><path fill="#4b84c3" d="M0 22h22v4H0z"/></g><path d="M11 7C4 3 0 10 3 17c2 6 4 8 8 6 4 2 6-1 8-5-5-2-5-7-1-9-2-3-5-3-7-2z" fill="none" stroke="#333" stroke-width=".8"/><path d="M11 6c-1-3 2-5 5-5 0 3-2 5-5 5" fill="#62a63d" stroke="#333" stroke-width=".6"/></svg>';
      ['Survey', 'File', 'Edit', 'View', 'Window', 'Help'].forEach((s, i) =>
        u.el('span', 'mi' + (i === 0 ? ' app' : ''), mb, s),
      );
      u.el('span', 'clock', mb, '10:24 AM');
      const vol = u.el('span', 'vol', mb);
      vol.innerHTML =
        '<svg viewBox="0 0 24 18"><path d="M2 6h4l5-4v14l-5-4H2z" fill="#222"/><path d="M14 5c2 2 2 6 0 8M17 3c3 3 3 9 0 12" stroke="#222" stroke-width="1.6" fill="none"/></svg>';

      // desktop: main window
      const win = u.el('section', 'win', shell);
      const tb = u.el('div', 'titlebar', win);
      u.el('i', 'zoom', tb);
      u.el('i', 'zoom', tb);
      u.el('i', 'zoom', tb);
      u.el('span', 'ttl', tb, 'Customer Feedback');
      const cl = u.el('i', 'closebox', tb);
      cl.innerHTML = '<svg viewBox="0 0 12 12"><path d="m2 2 8 8M10 2 2 10" stroke="#222" stroke-width="1.5"/></svg>';
      const tool = u.el('div', 'toolbar', win);
      [
        [
          'New',
          '<path d="M5 2h12l6 6v22H5z" fill="#fff" stroke="#444" stroke-width="1.5"/><path d="M17 2v6h6" fill="none" stroke="#444" stroke-width="1.5"/>',
        ],
        [
          'Open',
          '<path d="M2 8h9l3 3h14v17H2z" fill="#d8d8d8" stroke="#444" stroke-width="1.5"/><path d="M2 28l4-13h24l-4 13z" fill="#bdbdbd" stroke="#444" stroke-width="1.5"/>',
        ],
        [
          'Save',
          '<path d="M3 3h22l4 4v22H3z" fill="#aaa" stroke="#444" stroke-width="1.5"/><rect x="8" y="3" width="13" height="9" fill="#fff" stroke="#444"/><rect x="8" y="17" width="16" height="12" fill="#eee" stroke="#444"/>',
        ],
        [
          'Print',
          '<rect x="8" y="2" width="16" height="10" fill="#fff" stroke="#444" stroke-width="1.5"/><path d="M3 12h26v12H3z" fill="#bbb" stroke="#444" stroke-width="1.5"/><rect x="8" y="20" width="16" height="10" fill="#fff" stroke="#444" stroke-width="1.5"/>',
        ],
      ].forEach(([n, p]) => {
        const b = u.el('div', 'tbtn', tool);
        const s = u.el('span', 'ic', b);
        s.innerHTML = '<svg viewBox="0 0 32 32">' + p + '</svg>';
        u.el('span', '', b, n);
      });
      const body = u.el('div', 'winbody', win);
      body.dataset.instruction = _c.display;
      Object.assign(_c, { shell, win, tool, body, header: body, closeMarkup: cl.innerHTML });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
        if (_c.ctx.instruction.length < 32) note.classList.add('short-instruction');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tool;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction', 'instruction-panel');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const { body, shell } = _c;
      const cl = { innerHTML: _c.closeMarkup };
      u.el('p', 'lead', body, 'We’d love your feedback. Please answer the short survey below.');
      const stage = u.el('div', 'stage', body);
      const survey = u.el('div', 'survey', body);
      survey.setAttribute('aria-hidden', 'true');
      u.el('div', 'question', survey, '1. How satisfied are you with our product?');
      const choices = u.el('div', 'survey-choices', survey);
      ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied'].forEach((text, i) => {
        const row = u.el('div', 'survey-choice', choices);
        u.el('i', i === 1 ? 'radio selected' : 'radio', row);
        u.el('span', '', row, text);
      });
      u.el('div', 'question second', survey, '2. What did you like most?');
      const choice = u.el('div', 'survey-select', survey, 'Ease of use');
      u.el('span', '', choice, '▼');
      u.el('div', 'question third', survey, '3. Additional comments (optional):');
      const comment = u.el('div', 'survey-comment', survey, 'Great product!');
      const scroll = u.el('div', 'survey-scroll', comment);
      u.el('span', '', scroll, '▲');
      u.el('span', '', scroll, '▼');
      // floating colors palette
      const pal = u.el('aside', 'palette', shell);
      const pt = u.el('div', 'ptitle', pal);
      u.el('i', 'pbox', pt);
      u.el('span', 'ttl', pt, 'Colors');
      const pc = u.el('i', 'closebox', pt);
      pc.innerHTML = cl.innerHTML;
      const pb = u.el('div', 'pbody', pal);
      ['Foreground:', 'Background:'].forEach((l, i) => {
        const r = u.el('div', 'prow', pb);
        u.el('span', '', r, l);
        const sw = u.el('span', 'sw', r);
        u.el('i', '', sw).style.background = i ? '#fff' : '#111';
        u.el('b', '', sw, '▾');
      });
      u.el('hr', '', pb);
      const cs = u.el('div', 'chips', pb);
      ['#e0262a', '#f2a516', '#27a336', '#2a62e8', '#7b2fc2'].forEach((c) => {
        u.el('i', '', cs).style.background = c;
      });

      // trash
      const tr = u.el('div', 'trash', shell);
      tr.innerHTML =
        '<svg viewBox="0 0 44 60"><defs><linearGradient id="bin-metal"><stop stop-color="#777"/><stop offset=".25" stop-color="#fff"/><stop offset=".6" stop-color="#bbb"/><stop offset=".8" stop-color="#eee"/><stop offset="1" stop-color="#555"/></linearGradient></defs><path d="M5 15h34l-2 37q-15 9-30 0z" fill="url(#bin-metal)" stroke="#222" stroke-width="1.5"/><path d="M10 21v30m4-29v31m4-31v33m4-32v32m4-33v32m4-33v31m4-33v30" stroke="#777" stroke-width=".8"/><ellipse cx="22" cy="15" rx="19" ry="7" fill="url(#bin-metal)" stroke="#222" stroke-width="1.5"/><ellipse cx="22" cy="12" rx="16" ry="6" fill="#ddd" stroke="#555"/><path d="M17 7V4q5-4 10 0v3" fill="#bbb" stroke="#222"/><ellipse cx="22" cy="4" rx="5" ry="2" fill="#eee" stroke="#333"/></svg>';
      u.el('span', '', tr, 'Trash');
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.body.prepend(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.body.appendChild(foot);
      const status = _c.util.el('footer', 'footer', _c.win);
      _c.util.el('span', 'ready', status, 'Ready');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.body.appendChild(dock);
    },
    overlay: () => (ctx) => {

      const el = ctx.util.el('section', 'perturb tour ' + ctx.kind, document.body);
      const close = ctx.util.el('button', 'tour-close', el, '×');
      close.type = 'button';
      close.setAttribute('aria-label', 'Close tour');
      close.addEventListener('click', ctx.dismiss);
      const bulb = ctx.util.el('span', 'bulb', el);
      bulb.innerHTML =
        '<svg viewBox="0 0 30 48"><defs><radialGradient id="bulb-glass" cx="35%" cy="28%" r="65%"><stop stop-color="white"/><stop offset=".45" stop-color="#fff9b3"/><stop offset=".8" stop-color="#ffe829"/><stop offset="1" stop-color="#d6ac12"/></radialGradient></defs><path d="M15 2C3 2-2 14 6 24c3 4 3 7 3 10h12c0-3 0-6 3-10C32 14 27 2 15 2z" fill="url(#bulb-glass)" stroke="#333" stroke-width="1.5"/><path d="M12 33c0-7-1-11-4-17M18 33c0-7 1-11 4-17M11 20l4 3 4-3" fill="none" stroke="#b89d24" stroke-width="1"/><path d="M8 7q-6 8 0 15" fill="none" stroke="white" stroke-width="3"/><path d="M9 34h12v9l-3 3h-6l-3-3z" fill="#999" stroke="#222" stroke-width="1.5"/><path d="M9 36h12m-12 3h12m-11 3h10" stroke="#eee" stroke-width="1.5"/></svg>';
      ctx.util.el('strong', '', el, 'Take a quick tour');
      ctx.util.el('p', '', el, 'Learn how to get the most out of Survey in just a few steps.');
      const row = ctx.util.el('div', 'tourbtns', el);
      const dismiss = ctx.util.el('button', 'dismiss', row, 'Skip tour');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      const nx = ctx.util.el('button', 'next', row, 'Next ›');
      nx.type = 'button';
      nx.addEventListener('click', ctx.dismiss);
      return { el, dismiss };    },
  };
  env.site({
    name: 'design-click-control-button-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#2a4fae'],
      LOW_ACCENTS: ['#2a4fae'],
      parts,
    },
  });
})();
