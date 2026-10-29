// Blueprint workstation frame on the shared site template.
(function () {
  'use strict';
  const palette = {
    bg: '#0a1c2f', panel: '#0c2236', fg: '#dcecf6', accent: '#4db4f2',
    font: "'Segoe UI',Arial,sans-serif", line: '#1f4768', muted: '#8fb2c8',
  };
  function chartPoints() {
    const values = [
      8, 10, 11, 12, 14, 13, 12, 10, 11, 13, 14, 12, 11, 12, 10, 9, 8, 9, 10, 11, 12, 11, 14, 12, 11, 14, 13, 12, 10,
      12, 13, 13, 11, 12, 13, 11, 10, 12, 15, 14, 14, 13, 16, 15, 17, 18, 19, 20, 21, 19, 18, 21, 25, 24, 22, 24, 23,
      26, 29, 26, 24, 21, 23, 22, 19, 17, 18, 20, 21, 20, 19, 20, 21, 20, 22, 20, 19, 18, 21, 25, 24, 26, 24, 29, 28,
      29, 31, 25, 26, 24, 23, 27, 29, 31, 34, 36,
    ];
    return values
      .map((v, i) => ((i / (values.length - 1)) * 100).toFixed(2) + ',' + (100 - v * 2.5).toFixed(2))
      .join(' ');
  }
  function workstationChrome(u, shell) {
    const title = u.el('header', 'cad-title', shell);
    const ic = u.el('span', 'cad-appicon', title);
    ic.innerHTML =
      '<svg viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="#238bdd"/><path d="m5 5 6 1-1 5-6 1z" fill="none" stroke="#dff7ff"/><g fill="#dff7ff"><circle cx="5" cy="5" r="2"/><circle cx="11" cy="6" r="2"/><circle cx="10" cy="11" r="2"/><circle cx="4" cy="12" r="2"/></g></svg>';
    u.el('span', 'cad-title-text', title, 'Social Monitor');
    const wc = u.el('span', 'cad-wc', title);
    wc.innerHTML =
      '<svg viewBox="0 0 14 14"><path d="M1 7h12"/></svg><svg viewBox="0 0 14 14"><rect x="2" y="2" width="10" height="10"/></svg><svg viewBox="0 0 14 14"><path d="m2 2 10 10M12 2 2 12"/></svg>';
    const menu = u.el('nav', 'cad-menu', shell);
    for (const m of ['File', 'View', 'Tools', 'Window', 'Help']) {
      const b = u.el('span', '', menu, m);
      b.addEventListener('click', () => env.log('decoy', { what: m }));
    }
    return menu;
  }
  function overview(u, body) {
    const ov = u.el('section', 'cad-ov', body);
    const ch = u.el('div', 'ov-chart', ov);
    u.el('div', 'ov-h', ch, 'Live Source Overview');
    const plot = u.el('div', 'ov-plot', ch);
    u.el('div', 'ov-ytitle', plot, 'Posts / min');
    const yl = u.el('div', 'ov-yl', plot);
    for (const v of [40, 30, 20, 10, 0]) u.el('span', '', yl, String(v));
    const pa = u.el('div', 'ov-pa', plot);
    pa.innerHTML =
      '<svg viewBox="0 0 100 100" preserveAspectRatio="none"><g stroke="#1d4a6b" stroke-width="1" vector-effect="non-scaling-stroke"><path vector-effect="non-scaling-stroke" d="M0 0H100M0 25H100M0 50H100M0 75H100M0 100H100M0 0V100M14.3 0V100M28.6 0V100M42.9 0V100M57.1 0V100M71.4 0V100M85.7 0V100M100 0V100" fill="none"/></g><polygon points="0,100 ' +
      chartPoints() +
      ' 100,100" fill="rgba(77,180,242,.12)"/><polyline points="' +
      chartPoints() +
      '" fill="none" stroke="#6cc8ff" stroke-width="1.6" vector-effect="non-scaling-stroke"/></svg>';
    const xl = u.el('div', 'ov-xl', ch);
    for (const t of ['10:00', '10:10', '10:20', '10:30', '10:40', '10:50', '11:00']) u.el('span', '', xl, t);
    const kw = u.el('div', 'ov-kw', ov);
    u.el('div', 'ov-kh', kw, 'Keyword Activity (last hour)');
    [
      ['#books', 28],
      ['#travel', 12],
      ['#food', 10],
      ['#music', 8],
      ['#movies', 6],
    ].forEach(([k, n], i) => {
      const r = u.el('div', 'kw-row' + (i === 0 ? ' top' : ''), kw);
      u.el('span', 'kw-name', r, k);
      const tr = u.el('span', 'kw-track', r);
      const f = u.el('i', '', tr);
      f.style.width = (n / 30) * 100 + '%';
      u.el('span', 'kw-n', r, String(n));
    });
    const rd = u.el('div', 'ov-radar', ov);
    const rs = u.el('div', 'radar-svg', rd);
    rs.innerHTML =
      '<svg viewBox="0 0 100 100"><g fill="none" stroke="#2a73a8" stroke-width=".6"><circle cx="50" cy="50" r="46"/><circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="15"/><path d="M0 50H100M50 0V100"/></g><circle cx="50" cy="50" r="2" fill="#6cc8ff"/><circle cx="67" cy="29" r="2" fill="#6cc8ff"/><circle cx="58" cy="32" r="1" fill="#6cc8ff"/><circle cx="30" cy="30" r="1" fill="#6cc8ff"/><circle cx="29" cy="72" r="1" fill="#6cc8ff"/><circle cx="62" cy="31" r="1" fill="#6cc8ff"/></svg>';
    const st = u.el('div', 'radar-stats', rd);
    for (const [a, b] of [
      ['Total Posts', '1,204'],
      ['Matching Posts\n#books', '28'],
      ['Source', 'Public Feed'],
      ['Last Updated', '11:00:42'],
    ]) {
      const d = u.el('div', '', st);
      const label = u.el('small', '', d, a);
      label.style.whiteSpace = 'pre-line';
      u.el('b', '', d, b);
    }
    return rd;
  }
  function instructionIcon(u, note, text) {
    const icon = u.el('span', 'task-clipboard');
    icon.innerHTML = '<svg viewBox="0 0 48 40"><path d="M4 4h40v26H20l-10 8v-8H4z" fill="#5ab8f4"/><circle cx="14" cy="17" r="2.6" fill="#0c2236"/><circle cx="24" cy="17" r="2.6" fill="#0c2236"/><circle cx="34" cy="17" r="2.6" fill="#0c2236"/></svg>';
    note.prepend(icon);
    const p = u.el('p', '', note);
    p.append(text);
    note.dataset.role = 'instruction';
  }

  env.site({
    name: 'design-use-social-feed-some-06',
    template: 'site/base',
    langs: ['en'],
    design: {
      THEMES: { blueprint: palette },
      LOW_THEME: palette,
      ACCENTS: [palette.accent],
      LOW_ACCENTS: [palette.accent],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // The overview's radar can hold a panel only on wide workstations.
          if (_c.display === 'panel' && _c.W <= 1300) _c.display = 'header';
          document.body.className = 'cad instruction-' + _c.ctx.display + (_c.display === 'toast' ? ' ref-has-note' : '');
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          _c.wantFooter = true;
        },
        'frame.header': () => (_c) => {
          const { util } = _c;
          const shell = util.el('div', 'site-shell', document.body);
          const header = workstationChrome(util, shell);
          const note = util.el('section', 'task-note');
          Object.assign(_c, { shell, header, note });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base({ ..._c, header: _c.note });
          _c.note.hidden = _c.display !== 'header';
          if (!_c.note.hidden) instructionIcon(_c.util, _c.note, _c.note.firstChild);
        },
        'frame.controls': (base) => (_c) => {
          base(_c);
          const endBtn = _c.endBtn;
          _c.endBtn = (...args) => {
            const button = endBtn(...args);
            button.classList.add('end-control');
            if (button.classList.contains('ref-endlink')) button.classList.add('end-footer-link');
            return button;
          };
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.headerTools.classList.add('cad-menu-tools');
        },
        'frame.body': () => (_c) => {
          const body = _c.util.el('div', 'design-body ref-body', _c.shell);
          const radar = overview(_c.util, body);
          body.append(_c.note);
          Object.assign(_c, { body, radar });
        },
        'frame.panel': (base) => (_c) => {
          if (_c.display !== 'panel') return;
          _c.radar.replaceChildren();
          base({ ..._c, body: _c.radar });
          const panel = _c.radar.querySelector('.ref-panel');
          panel.classList.add('task-note', 'task-panel');
          instructionIcon(_c.util, panel, panel.querySelector('.ref-panel-text'));
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('main', 'stage', _c.body);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          if (_c.display !== 'toast') return;
          const note = document.querySelector('.ref-note');
          note.classList.add('task-note', 'task-notification');
          instructionIcon(_c.util, note, note.querySelector('.ref-note-text'));
          _c.stage.before(note);
        },
        'frame.footer': (base) => (_c) => {
          base({ ..._c, wantFooter: true });
          const footer = document.querySelector('.ref-foot');
          footer.classList.add('design-footer');
          _c.shell.append(footer);
          const count = _c.util.el('span', 'sel-count', null, '0 active actions');
          footer.prepend(count);
          _c.decoyBtn(footer, 'Clear Selection');
          const clear = footer.lastChild;
          clear.className = 'clear-task';
          footer.querySelector('.ref-tools').before(clear);
          _c.footer = footer;
          _c.submit = footer.querySelector('[data-role="submit"]') || _c.submit;
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.footer.append(dock);
        },
        overlay: () => function (ctx) {
          const u = ctx.util;
          const texts = {
            cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
            toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
            chat: ['Help', 'Need help with this workspace?', 'Close'],
            promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
            banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
          };
          const [title, copy, label] = texts[ctx.kind];
          const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
          el.setAttribute('role', 'dialog');
          el.setAttribute('aria-label', title);
          u.el('h2', '', el, title);
          u.el('div', 'overlay-copy', el, copy);
          const actions = u.el('div', 'overlay-actions', el);
          if (ctx.kind === 'cookie') {
            const accept = u.el('button', '', actions, 'Accept all');
            accept.addEventListener('click', () => ctx.dismiss());
          }
          const dismiss = u.el('button', 'primary', actions, label);
          dismiss.type = 'button';
          dismiss.addEventListener('click', () => ctx.dismiss());
          return { el, dismiss };
        },
      },
    },
  });
})();
