// Metro Calendar chrome on the shared site frame; task controls live in the widget.
(function () {
  'use strict';
  const palette = {
    bg: '#123d75', panel: '#ffffff', fg: '#163466', accent: '#4536b7',
    font: 'Segoe UI,Lato,Arial,sans-serif', line: '#bebebe', muted: '#5e6779',
  };

  const calIcon =
    '<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2h40v40H2z" stroke="white" stroke-width="3"/><path d="M2 2h40v7H2z" fill="white"/>' +
    [13, 20, 27, 34]
      .map((y) => [7, 14, 21, 28, 35].map((x) => '<path d="M' + x + ' ' + y + 'v4h4v-4z" fill="white"/>').join(''))
      .join('') +
    '</svg>';

  // Keep the reference's emphasis while the template owns instruction visibility and content.
  function instructionBand(note) {
    note.classList.add('task-note');
    note.dataset.role = 'instruction';
    const text = note.querySelector('.ref-instruction, .ref-panel-text, .ref-note-text');
    if (!text) return;
    const pieces = text.textContent.split(/("[^"]*"|\b\d{1,2}:\d{2}\b|\b\d{1,2}(?::\d{2})?\s?(?:am|pm)\b)/gi);
    text.textContent = '';
    pieces.forEach((piece, i) => {
      if (i % 2) {
        const strong = document.createElement('strong');
        strong.textContent = piece;
        text.append(strong);
      } else text.append(piece);
    });
  }

  function renderTour(ctx) {
    const u = ctx.util;
    const [title, copy, label] = ['Take a quick tour', 'Learn how to create and manage events in Calendar.', 'Skip tour'];
    const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', title);
    if (title === 'Take a quick tour') {
      const close = u.el('button', 'tour-close', el, '×');
      close.type = 'button';
      close.addEventListener('click', () => ctx.dismiss());
    }
    u.el('h2', '', el, title);
    u.el('div', 'overlay-copy', el, copy);
    const actions = u.el('div', 'overlay-actions', el);
    const dismiss = u.el('button', 'primary', actions, label);
    dismiss.type = 'button';
    dismiss.addEventListener('click', () => ctx.dismiss());
    if (title === 'Take a quick tour') {
      const next = u.el('button', 'tour-next', actions, 'Next (1/4)');
      next.type = 'button';
      let page = 1;
      next.addEventListener('click', () => {
        if (page === 4) {
          ctx.dismiss();
          return;
        }
        page++;
        el.querySelector('.overlay-copy').textContent = [
          '',
          'Learn how to create and manage events in Calendar.',
          'Choose a start time in the day grid or use the Start menu.',
          'Enter a title and choose how long your event will last.',
          'Choose Create event to save it in your calendar.',
        ][page];
        next.textContent = page === 4 ? 'Done (4/4)' : `Next (${page}/4)`;
      });
    }
    return { el, dismiss };
  }

  env.site({
    name: 'design-use-desktop-tools-calendar-11',
    template: 'site/base',
    styles: ['site.css', 'templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'frame-support.css'],
    langs: ['en'],
    design: {
      THEMES: { metro: palette }, LOW_THEME: palette,
      ACCENTS: [palette.accent], LOW_ACCENTS: [palette.accent],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          _c.display = _c.ctx.display;
          document.body.className = 'top instruction-' + _c.display;
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          // Calendar always has its own taskbar and navigation.
          Object.assign(_c, { wantFooter: true, sidebar: false, nav: false });
        },
        'frame.header': () => (_c) => {
          const { util: u, display } = _c;
          const shell = u.el('div', 'site-shell', document.body);
          const title = u.el('header', 'design-header', shell);
          u.el('div', 'design-brand', title, 'Calendar');
          u.el('div', 'calendar-app-icon', title).innerHTML = calIcon;
          const wc = u.el('div', 'win-ctl', title);
          wc.innerHTML = '<svg viewBox="0 0 128 30" fill="none" stroke="white" stroke-width="2.5"><path d="M2 15h18M56 7h16v16H56zM110 7l16 16M126 7l-16 16"/></svg>';
          const body = u.el('div', 'design-body ref-body', shell);
          const header = u.el('section', '', body);
          header.hidden = display !== 'header';
          Object.assign(_c, { shell, body, header });
        },
        'frame.nav': () => (_c) => {
          const { util: u, body } = _c;
          const nav = u.el('nav', 'design-nav', body);
          for (const item of ['Day', 'Week', 'Month', 'Today']) u.el('span', 'nav-item' + (item === 'Day' ? ' on' : ''), nav, item);
          const settings = u.el('span', 'nav-set', nav);
          u.el('span', 'settings-gear', settings, '⚙');
          settings.append('Settings');
        },
        'frame.instruction': (base) => (_c) => {
          base(_c);
          if (_c.display === 'header') instructionBand(_c.header);
        },
        'frame.controls': (base) => (_c) => {
          base(_c);
          const { endBtn, decoyBtn } = _c;
          const placement = ['footer', 'link'].includes(_c.placement) ? 'middle' : _c.placement === 'floating' ? 'low' : 'main';
          _c.endBtn = (parent, cls, text) => {
            const button = endBtn(parent, cls, text);
            button.classList.add('end-control', 'end-' + placement);
            return button;
          };
          _c.decoyBtn = (parent, text, collides) => {
            decoyBtn(parent, text, collides);
            parent.lastElementChild.classList.add('metro-xtra');
          };
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          // End controls remain available when the instruction band is hidden.
          _c.headerTools.classList.add('metro-tools');
          _c.shell.append(_c.headerTools);
        },
        'frame.body': () => () => {},
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) instructionBand(panel);
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('main', 'stage', _c.body);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            instructionBand(note);
            _c.body.append(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const { util: u, shell } = _c;
          const footer = document.querySelector('.ref-foot');
          footer.classList.add('design-footer');
          footer.querySelector('.ref-foot-text').remove();
          shell.append(footer);
          u.el('span', 'footer-label', footer, '10:24 AM\n4/16/2013');
          const apps = u.el('div', 'taskbar-apps', footer);
          apps.innerHTML =
            '<svg viewBox="0 0 332 60" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="folder-gold" x2="0" y2="1"><stop stop-color="#ffe991"/><stop offset=".5" stop-color="#ffd23d"/><stop offset="1" stop-color="#e9ae22"/></linearGradient><linearGradient id="browser-blue" x2="0" y2="1"><stop stop-color="#90e5ff"/><stop offset=".5" stop-color="#31b9ed"/><stop offset="1" stop-color="#0582c0"/></linearGradient></defs><path d="M20 16l15-2v14H20zm18-3l16-2v17H38zM20 31h15v14l-15-2zm18 0h16v17l-16-2z" fill="white"/><ellipse cx="119" cy="30" rx="20" ry="13" transform="rotate(-50 119 30)" fill="none" stroke="#f4c22d" stroke-width="3"/><text x="102" y="48" font-family="Arial" font-weight="bold" font-style="italic" font-size="55" fill="url(#browser-blue)">e</text><path d="M185 13h14l5 5h18v29h-37z" fill="url(#folder-gold)" stroke="#d2a43c" stroke-width=".5"/><path d="M188 17h10v4h-10z" fill="#65aaca"/><path d="M188 22h31v13h-31z" fill="#f6fbef"/><path d="M185 27h38l-2 20h-37z" fill="url(#folder-gold)"/><path d="M186 28h36" stroke="#fff0a6"/><path d="M187 34h34v11h-34z" fill="#ffdc62"/><path d="M210 38h11v10h-11z" fill="#339bc7"/><path d="M212 39h7v2h-7z" fill="#bce8ef"/><path d="M211 44h10" stroke="#087697"/><path d="M246 0h86v60h-86z" fill="#477aa7" fill-opacity=".55"/><path d="M271 11h38v38h-38z" fill="#4939be"/>' +
            calIcon.replace('<svg viewBox="0 0 44 44"', '<svg x="275" y="14" width="30" height="30" viewBox="0 0 44 44"') +
            '</svg>';
          const tray = u.el('div', 'taskbar-tray', footer);
          tray.innerHTML =
            '<svg viewBox="0 0 108 28" fill="white"><path d="M4 15l6-6 6 6" fill="none" stroke="white" stroke-width="1.5"/><path d="M40 18h3v5h-3zm5-4h3v9h-3zm5-4h3v13h-3zm5-4h3v17h-3zM75 11h5l6-6v18l-6-6h-5z"/><path d="M90 9q7 6 0 12m4-16q12 10 0 20" stroke="white" stroke-width="1.5" fill="none"/></svg>';
          _c.footer = footer;
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.footer.append(dock);
        },
        overlay: (base) => (ctx) => ctx.kind === 'promo' ? renderTour(ctx) : base(ctx),
      },
    },
  });
})();
