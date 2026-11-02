// The Chronicle's newspaper frame, built on the shared site frame sections.
(function () {
  'use strict';

  const palette = {
    bg: '#faf9f5', panel: '#fffefa', fg: '#1b1b1b', accent: '#aa2529',
    font: 'Georgia,serif', line: '#d1cec5', muted: '#626675',
  };

  function emphasize(note, util) {
    if (!note) return;
    note.classList.add('task-note');
    note.dataset.role = 'instruction';
    const text = note.querySelector('.ref-panel-text, .ref-note-text') || note;
    const instruction = text.textContent;
    text.textContent = '';
    const paragraph = util.el('p', '', text);
    for (const token of instruction.split(/(@[\w.-]+|\b\d+\b)/g)) {
      util.el('span', /^(@[\w.-]+|\d+)$/.test(token) ? 'task-emphasis' : '', paragraph, token);
    }
  }

  function styleControls(_c) {
    const { shell, header, placement, ctx } = _c;
    shell.classList.toggle('finish-mode', ctx.finish);
    shell.dataset.endPlacement = ctx.finish ? 'finish' : placement;
    for (const b of shell.querySelectorAll('.ref-xtra')) b.classList.add('chrome-xtra');
    for (const b of shell.querySelectorAll('[data-role="submit"]')) {
      b.classList.add('end-control', 'end-' + placement);
      if (b.classList.contains('ref-endlink')) b.classList.add('end-link');
    }
    header.classList.toggle('has-end', !!header.querySelector('[data-role="submit"]'));
    header.classList.toggle('has-xtra', !!header.querySelector('.ref-xtra'));
  }

  function newspaperRail(u, body) {
    const rail = u.el('nav', 'newspaper-rail', body);
    const IC = {
      Home: '<path d="M2 11 12 1l10 10h-3v11h-5v-7h-4v7H5V11z"/>',
      Connect: '<path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H10l-5 5v-5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>',
      News: '<path d="M5 2h17v19H5zM2 6v13q0 2 3 2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 5h5v6H8zM15 5h4v1.5h-4zM15 9h4v1.5h-4zM8 13h11v1.5H8zM8 17h11v1.5H8z"/>',
      People:
        '<circle cx="12" cy="5" r="3.6"/><circle cx="4.5" cy="8" r="2.8"/><circle cx="19.5" cy="8" r="2.8"/><path d="M6.5 22v-6a5.5 5.5 0 0 1 11 0v6zM0 22v-6a4.5 4.5 0 0 1 6-4.2A7 7 0 0 0 5 16v6zM24 22v-6a4.5 4.5 0 0 0-6-4.2 7 7 0 0 1 1 4.2v6z"/>',
      Settings:
        '<path d="M10 2h4l.6 3 2.2 1 2.6-1.6 2.8 2.8L20.6 10l1 2.2 3 .6v4l-3 .6-1 2.2 1.6 2.6-2.8 2.8-2.6-1.6-2.2 1-.6 3h-4l-.6-3-2.2-1-2.6 1.6-2.8-2.8L5.4 19l-1-2.2-3-.6v-4l3-.6 1-2.2L3.8 6.8 6.6 4 9.2 5.6l.2-.6z" transform="translate(-1 -2) scale(.9)"/><circle cx="12" cy="12" r="3.5" fill="#fffefa"/>',
    };
    for (const label of ['Home', 'Connect', 'News', 'People', 'Settings']) {
      const d = u.el('div', label === 'Home' ? 'on' : '', rail);
      const ic = u.el('span', 'ic', d);
      ic.innerHTML = '<svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">' + IC[label] + '</svg>';
      u.el('span', '', d, label);
    }
  }

  function survey(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'reference-overlay promo', document.body);
    el.dataset.role = 'overlay';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Quick Survey');
    u.el('h2', '', el, 'Quick Survey');
    u.el('div', 'overlay-copy', el, 'Help us improve The Daily Chronicle.');
    const form = u.el('div', 'survey-fields', el);
    const QS = [
      [
        '1. How often do you visit our site?',
        ['Daily', 'A few times a week', 'About once a week', 'Less often'],
        1,
      ],
      [
        '2. What do you value most here?',
        ['News coverage', 'Opinion pieces', 'Community posts', 'Investigative reporting', 'Other'],
        2,
      ],
    ];
    QS.forEach((q, qi) => {
      u.el('h3', '', form, q[0]);
      for (let i = 0; i < q[1].length; i++) {
        const l = u.el('label', '', form);
        const r = u.el('input', '', l);
        r.type = 'radio';
        r.name = 'survey' + qi;
        l.append(q[1][i]);
      }
    });
    u.el('h3', '', form, '3. Any additional feedback?');
    const notes = u.el('textarea', '', form);
    notes.placeholder = 'Your comments (optional)...';
    const sb = u.el('button', 'survey-submit', form, 'Submit Survey');
    sb.type = 'button';
    sb.addEventListener('click', () => ctx.dismiss());

    const actions = u.el('div', 'overlay-actions', el);
    const dismiss = u.el('button', 'primary', actions, 'Close survey');
    dismiss.type = 'button';
    dismiss.addEventListener('click', () => ctx.dismiss());
    return { el, dismiss };
  }

  env.site({
    name: 'design-use-social-feed-some-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'frame-support.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { newspaper: palette }, LOW_THEME: palette,
      ACCENTS: [palette.accent], LOW_ACCENTS: [palette.accent],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          document.body.className = 'top instruction-' + _c.display;
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const shell = u.el('div', 'site-shell', document.body);
          const masthead = u.el('header', 'design-header', shell);
          u.el('div', 'design-brand', masthead, 'The Daily Chronicle');
          u.el('div', 'design-tag', masthead, 'A MORE INFORMED TOMORROW');
          const header = u.el('nav', 'design-nav', masthead);
          u.el('span', '', header, 'Mon, Apr 18, 2011');
          u.el('span', 'acct', header, 'My Account');
          u.el('span', '', header, 'Sign Out');
          const body = u.el('div', 'design-body', shell);
          Object.assign(_c, { shell, header, body });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base({ ..._c, header: _c.body });
          emphasize(_c.body.querySelector('.ref-instruction'), _c.util);
        },
        'frame.body': () => (_c) => newspaperRail(_c.util, _c.body),
        'frame.panel': (base) => (_c) => {
          base(_c);
          emphasize(_c.body.querySelector('.ref-panel'), _c.util);
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('main', 'stage', _c.body);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          emphasize(document.querySelector('.ref-note'), _c.util);
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const footer = document.querySelector('.ref-foot') || _c.util.el('footer', '', _c.shell);
          footer.classList.add('design-footer');
          _c.shell.append(footer);
          const caption = footer.querySelector('.ref-foot-text') || _c.util.el('span', '', footer);
          caption.classList.add('footer-label');
          caption.textContent = _c.ctx.finish ? 'Community desk' : 'Ready';
          _c.footer = footer;
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.footer.append(dock);
        },
        'frame.end': (base) => (_c) => {
          styleControls(_c);
          return base(_c);
        },
        overlay: (base) => (ctx) => ctx.kind === 'promo' ? survey(ctx) : base(ctx),
      },
    },
  });
})();
