(function () {
  'use strict';
  const palette = { bg: '#171a1d', panel: '#252a30', fg: '#e5e9ed', muted: '#aeb8c3', line: '#414a53' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note displays have a dedicated home in the inspector.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'procarbon', 'console');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, 'Acme Documents');
      const glyph = u.el('span', 'title-document', title);
      glyph.innerHTML =
        '<svg viewBox="0 0 20 24"><path d="M2 1h11l5 5v16H2Z" fill="#f4f4ef" stroke="#59636c"/><path d="M13 1v6h5M5 9h9M5 12h8M5 15h9M5 18h6" fill="none" stroke="#849097"/><path d="M6 6h3v4H6Z" fill="#a9bac7" stroke="#5e6d77"/></svg>';
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const menus = u.el('div', 'tools', head);
      menus.innerHTML =
        '<span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>T</u>ools</span><span><u>H</u>elp</span>';
      const toolbar = u.el('div', 'toolbar', shell);
      toolbar.innerHTML =
        '<span class="tool-item"><svg viewBox="0 0 32 34" aria-hidden="true"><path d="M5 2h15l8 8v22H5Z" fill="#cdd0d2" stroke="#11171c" stroke-width="2"/><path d="M20 2v9h8M9 15h15M9 19h15M9 23h15M9 27h12" fill="none" stroke="#30363b" stroke-width="2"/></svg>Open</span><span class="tool-item"><svg viewBox="0 0 32 34" aria-hidden="true"><path d="M3 2h24l3 3v27H3Z" fill="#777198" stroke="#11161b" stroke-width="2"/><path d="M8 3h16v12H8Z" fill="#c6cbd3" stroke="#242532"/><path d="M19 4h3v8h-3Z" fill="#3c3c53"/><path d="M8 20h17v11H8Z" fill="#b8becb" stroke="#292b35"/><path d="M12 23h9M12 26h9" stroke="#424854"/></svg>Save</span><span class="tool-item"><svg viewBox="0 0 34 34" aria-hidden="true"><path d="M9 2h17v10H9Z" fill="#e4e6e8" stroke="#10161c" stroke-width="2"/><path d="M3 12h29v15H3Z" fill="#9b9fa4" stroke="#12171c" stroke-width="2"/><path d="M6 14h23v5H6Z" fill="#c7cace"/><path d="M9 22h17v10H9Z" fill="#d4d7d9" stroke="#22282e" stroke-width="2"/><path d="M12 26h11M12 29h11" stroke="#585e63"/><circle cx="28" cy="17" r="1" fill="#4e814c"/></svg>Print</span><i></i><span class="tool-item"><svg viewBox="0 0 34 34" aria-hidden="true"><circle cx="14" cy="13" r="10" fill="#b8bcc0" stroke="#11171c" stroke-width="2"/><circle cx="14" cy="13" r="7" fill="#31373d" stroke="#d8dbde"/><path d="m22 21 9 9" stroke="#10151a" stroke-width="7"/><path d="m22 21 9 9" stroke="#b7bdc3" stroke-width="4"/></svg>Find</span><label>Agreement.docx</label>';
      const aside = u.el('aside', 'inspector');
      const ih = u.el('div', 'inspector-head', aside);
      u.el('h2', '', ih, 'Task');
      u.el('span', 'clock', ih, 'Time: Paused  ◉');
      ih.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, toolbar, aside, header: aside });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
      const details = _c.util.el('section', 'inspector-details', _c.aside);
      _c.util.el('strong', '', details, 'Details');
      [
        ['Document:', 'Service Agreement'], ['Pages:', '6'],
        ['Current page:', '6'], ['Status:', 'Not signed'],
      ].forEach((x) => {
        const r = _c.util.el('div', 'detail-row', details);
        _c.util.el('span', '', r, x[0]);
        _c.util.el('span', '', r, x[1]);
      });
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'work', _c.shell);
      const center = _c.util.el('section', 'center', body);
      body.appendChild(_c.aside);
      Object.assign(_c, { body, center });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const note = _c.aside.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction', 'instruction-panel');
        note.dataset.display = _c.display;
      }
      const u = _c.util;
      const help = u.el('section', 'control-help', _c.aside);
      u.el('strong', '', help, 'Controls');
      [
        '◉　 Pointer: click to select', '▦　 Keyboard: type your name',
        '◉　 Mouse wheel: scroll through the document',
      ].forEach((t) => u.el('p', '', help, t));
      const info = u.el('section', 'submit-info', _c.aside);
      u.el('strong', '', info, 'Task completion');
      u.el('p', '', info, 'Complete the steps to finish the task.');
      if (_c.ctx.finish) info.classList.add('finish-info');
      _c.info = info;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-notification');
        note.dataset.display = _c.display;
        _c.aside.insertBefore(note, _c.info);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Page 6 of 6';
      _c.util.el('span', 'zoom', foot, '100%　 −　 ▬▬▬　 +');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      if (ctx.kind === 'cookie') {
        ctx.util.el('span', 'warning-icon', el, '!');
        ctx.util.el('strong', '', el, 'Action Required');
        ctx.util.el(
          'p', 'cookie-lead', el,
          'Before you can view or sign this agreement, you must accept our consent to continue.',
        );
        const copy = ctx.util.el('div', 'cookie-copy', el);
        ctx.util.el(
          'p', '', copy,
          'We use cookies and similar technologies to improve functionality, analyze usage and remember your preferences. You can reject optional cookies and continue without accepting.',
        );
        ctx.util.el('a', '', copy, 'Learn more');
        const actions = ctx.util.el('div', 'cookie-actions', el);
        const dismiss = ctx.util.el('button', 'reject', actions, 'Reject optional');
        dismiss.type = 'button';
        dismiss.addEventListener('click', ctx.dismiss);
        const accept = ctx.util.el('button', 'accept', actions, 'Accept and continue');
        accept.type = 'button';
        accept.addEventListener('click', ctx.dismiss);
        return { el, dismiss };
      }
      ctx.util.el('strong', '', el,
        { toast: 'Notification', chat: 'Support', promo: 'A special offer', banner: 'Service notice' }[ctx.kind]);
      ctx.util.el('p', '', el, {
        toast: 'Your workspace is ready.', chat: 'How can we help?',
        promo: 'Explore the latest tools.', banner: 'A new update is available.',
      }[ctx.kind]);
      const dismiss = ctx.util.el('button', 'dismiss', el, 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-handle-text-sign-agreement-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'cookie' },
    design: {
      THEMES: { 'design-handle-text-sign-agreement-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1684e8'],
      LOW_ACCENTS: ['#1684e8'],
      parts,
    },
  });
})();
