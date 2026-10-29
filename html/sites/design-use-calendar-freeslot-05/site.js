// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        if (kind === 'banner') el.style.top = `${document.querySelector('.ref-body').getBoundingClientRect().top}px`;
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'promo') {
          const picture = util.el('div', 'ref-ov-illustration', box);
          picture.innerHTML =
            '<svg viewBox="0 0 160 170" aria-hidden="true"><path d="M12 76l68-46 68 46v80H12z" fill="#6da8e4" stroke="#4b80b5"/><rect x="32" y="15" width="96" height="112" rx="5" fill="#fbfdff" stroke="#6b91b7"/><path d="M32 20q0-5 5-5h86q5 0 5 5v22H32z" fill="#5b99df"/><path d="M51 8v17m58-17v17" stroke="#355e8b" stroke-width="5" stroke-linecap="round"/><path d="M47 57h16v13H47zm25 0h16v13H72zm25 0h16v13H97zM47 79h16v13H47zm25 0h16v13H72zm25 0h16v13H97zM47 101h16v13H47zm25 0h16v13H72z" fill="#b2d0ed"/><path d="M12 76l68 54 68-54v80H12z" fill="#6da8e4" stroke="#4b80b5"/><path d="M12 156l52-45 16 19 16-19 52 45" fill="#8bbbed" stroke="#4b80b5"/><path d="M7 53l-6-4m15-9-3-9m137 17 8-5" stroke="#f0bc4c" stroke-width="4" stroke-linecap="round"/></svg>';
          util.el('div', 'ref-ov-promo-heading', box, 'Calendar news & offers');
        }
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        const row = util.el('div', 'ref-ov-row', box);
        const btn = (label, how, primary) => {
          if (word && K.button[label]) label = word(K.button[label]);
          const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
          b.type = 'button';
          b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
          return b;
        };
        let dismiss;
        if (kind === 'cookie') {
          if (rng.bool(0.5)) btn('Settings', null, false);
          btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
          dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
        } else if (kind === 'promo') {
          dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
          btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
        } else if (kind === 'banner') {
          dismiss = btn('Dismiss', 'close', false);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx, util } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const win = util.el('div', 'outlook-titlebar', document.body);
        const appIcon = util.el('span', 'outlook-appicon', win);
        appIcon.innerHTML =
          '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="2" y="3" width="20" height="19" fill="#fff" stroke="#fff"/><rect x="2" y="3" width="20" height="5" fill="#0b3b91"/><path d="M5 11h3M10 11h3M15 11h3M5 15h3M10 15h3M15 15h3M5 19h3M10 19h3" stroke="#4a78d0" stroke-width="2"/></svg>';
        util.el('span', 'outlook-caption', win, 'Team Calendar - March 8, 2027');
        const winbuttons = util.el('span', 'outlook-windowbuttons', win);
        util.el('i', '', winbuttons, '−');
        util.el('i', '', winbuttons, '□');
        util.el('i', 'outlook-close', winbuttons, '×');
        const ribbon = util.el('div', 'outlook-ribbon', document.body);
        const tabs = util.el('div', 'outlook-tabs', ribbon);
        for (const t of ['File', 'Edit', 'View', 'Go', 'Tools', 'Actions', 'Help'])
          util.el('span', '', tabs, t);
        const actions = util.el('div', 'outlook-actions', ribbon);
        const groups = [
          [
            'New',
            [
              ['👥', 'New Meeting'],
              ['✏', 'Edit'],
              ['✖', 'Delete'],
            ],
          ],
          [
            'Go To',
            [
              ['↪', 'Today'],
              ['◀', 'Previous'],
              ['▶', 'Next'],
            ],
          ],
          [
            'Arrange',
            [
              ['📆', 'Day'],
              ['🗓', 'Work Week'],
              ['📅', 'Week'],
              ['🗓', 'Month'],
              ['▥', 'Schedule View'],
            ],
          ],
          [
            'Manage',
            [
              ['📂', 'Open Calendar'],
              ['✏', 'Calendar Groups'],
            ],
          ],
          [
            'Share',
            [
              ['✉', 'E-mail Calendar'],
              ['👥', 'Share Calendar'],
              ['🌐', 'Publish Online'],
            ],
          ],
          [
            'Find',
            [
              ['🔎', 'Find People'],
              ['📇', 'Address Book'],
            ],
          ],
        ];
        const ICONS = [
          ['M4 7h28v25H4z', 'M4 14h28', 'M11 4v7m14-7v7', 'M9 19h5v5H9z'],
          [
            'M13 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10',
            'M3 31c0-7 4-11 10-11s10 4 10 11',
            'M25 5a5 5 0 1 1 0 10',
            'M24 21c5 0 8 4 8 10',
          ],
          ['M7 4h19l5 5v24H7z', 'M26 4v6h5', 'M12 16h14m-14 6h14m-14 6h10'],
          ['M4 18h25', 'M20 8l10 10-10 10'],
          ['M4 8h28v24H4z', 'M4 14h28', 'M11 4v8m14-8v8', 'M9 19h3v4H9zm7 0h3v4h-3zm7 0h3v4h-3z'],
          ['M4 7h28v25H4z', 'M4 14h28', 'M11 4v7m14-7v7', 'M10 20h4v5h-4z'],
          ['M4 7h28v25H4z', 'M4 14h28', 'M11 4v7m14-7v7', 'M18 14v18'],
          ['M4 7h28v25H4z', 'M4 14h28', 'M11 4v7m14-7v7', 'M11 14v18m10-18v18'],
          ['M4 7h28v25H4z', 'M4 14h28', 'M11 4v7m14-7v7', 'M11 14v18m10-18v18', 'M4 23h28'],
          ['M4 8h28v7H4z', 'M4 20h28v5H4z', 'M4 29h20'],
          ['M4 12h22v19H4z', 'M4 17h22', 'M10 8V4h18v19', 'M23 4v7'],
          ['M6 7h17v24H6z', 'M23 13l9-8', 'M22 22l10-10', 'M22 22l-1 7 6-3'],
          ['M4 9h28v21H4z', 'M4 12l14 11 14-11'],
          [
            'M13 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10',
            'M3 31c0-7 4-11 10-11s10 4 10 11',
            'M25 5a5 5 0 1 1 0 10',
            'M24 21c5 0 8 4 8 10',
          ],
          ['M18 3a15 15 0 1 0 0 30 15 15 0 0 0 0-30', 'M3 18h30', 'M18 3c7 7 7 23 0 30', 'M18 3c-7 7-7 23 0 30'],
          ['M15 4a11 11 0 1 0 0 22 11 11 0 0 0 0-22', 'M23 23l9 9'],
          ['M5 5h26v27H5z', 'M12 5v27', 'M16 12h11m-11 6h11', 'M8 11h2m-2 6h2m-2 6h2'],
        ];
        const drawIcon = (parent, gi, i) => {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 36 36');
          svg.setAttribute('aria-hidden', 'true');
          const paths =
            ICONS[gi === 2 ? 5 + i : gi === 3 ? 10 + i : gi === 4 ? 12 + i : gi === 5 ? 15 + i : gi === 1 ? 3 + i : i];
          const calendar = `<rect x="3" y="6" width="29" height="27" fill="#fbfcff" stroke="#6480a3"/><path d="M3 7h29v6H3z" fill="#5894db"/><path d="M4 9h27" stroke="#b9ddff"/><path d="M10 3v7m15-7v7" stroke="#416395" stroke-width="2"/><path d="M4 18h27M4 23h27M4 28h27M10 14v18m7-18v18m7-18v18" stroke="#a3b6d0" stroke-width=".7"/>`;
          const people = `<circle cx="12" cy="19" r="4" fill="#f4c89d" stroke="#47617d"/><path d="M5 33v-6q7-7 14 0v6z" fill="#5d92c4" stroke="#47617d"/><circle cx="25" cy="20" r="4" fill="#f6c998" stroke="#47617d"/><path d="M19 34v-7q6-6 12 0v7z" fill="#6aa24f" stroke="#47617d"/>`;
          let art = calendar;
          if (gi === 0 && i === 0) art = calendar + '<path d="M11 19h6v5h-6z" fill="#f6d385"/>';
          if (gi === 0 && i === 1) art = calendar + people;
          if (gi === 0 && i === 2)
            art =
              '<rect x="4" y="4" width="20" height="26" fill="white" stroke="#6480a3"/><path d="M8 10h12M8 15h12M8 20h12" stroke="#7c9bbb"/><g transform="translate(9 8) scale(.8)">' +
              calendar +
              '</g>';
          if (gi === 1 && i === 0)
            art =
              '<path d="M5 4h21l-8 8q14 8 5 21l-8-7q9-6-5-10l-5 7z" fill="#59b85a" stroke="#388e43"/><path d="M7 6h15l-8 7" fill="none" stroke="#a1df8f"/>';
          if (gi === 1 && i === 1) art = calendar + '<path d="M23 24h8v7h-8z" fill="#68ad65"/>';
          if (gi === 2 && i === 0) art = calendar + '<path d="M5 14h25v4H5z" fill="#f4d37d"/>';
          if (gi === 2 && i === 1) art = calendar + '<path d="M4 14h20v18H4z" fill="#8eb9ee" opacity=".6"/>';
          if (gi === 2 && i === 2) art = calendar + '<path d="M4 14h27v9H4z" fill="#88b4ec" opacity=".6"/>';
          if (gi === 2 && i === 3) art = calendar + '<path d="M4 14h27v18H4z" fill="#88b4ec" opacity=".6"/>';
          if (gi === 2 && i === 4) art = calendar + '<path d="M7 17h15v3H7zm5 7h17v3H12z" fill="#ac83cf"/>';
          if (gi === 3 && i === 0)
            art =
              calendar +
              '<path d="M8 1v16M0 9h16" stroke="#377f44" stroke-width="6"/><path d="M8 1v16M0 9h16" stroke="#75c877" stroke-width="3"/>';
          if (gi === 3 && i === 1)
            art =
              calendar +
              '<path d="M12 28L30 10l4 4-18 18-6 2z" fill="#f0bf66" stroke="#a06e29"/><path d="M12 28l4 4-6 2z" fill="#456a91"/>';
          if (gi === 4 && i === 0)
            art =
              calendar +
              '<path d="M12 18h23v17H12z" fill="#ecf4fb" stroke="#6d8aa8"/><path d="M12 18l12 10 11-10" fill="none" stroke="#6d8aa8"/>';
          if (gi === 4 && i === 1)
            art =
              calendar + people + '<rect x="3" y="29" width="20" height="6" rx="2" fill="#efb94d" stroke="#bc892a"/>';
          if (gi === 4 && i === 2)
            art =
              '<circle cx="17" cy="16" r="14" fill="#6aafe2" stroke="#4d7ea3"/><path d="M5 7l8-3 5 4-4 9-8-1zm17 8l8 1-2 10-8 2-3-8z" fill="#79ba46"/><path d="M17 2q-8 13 0 28M3 16h28" fill="none" stroke="#d1e5b8"/><g transform="translate(16 21) scale(.47)">' +
              calendar +
              '</g>';
          if (gi === 5 && i === 1)
            art =
              '<rect x="4" y="7" width="28" height="22" fill="#fff" stroke="#6480a3"/><rect x="7" y="10" width="10" height="15" fill="#91b7db"/><circle cx="12" cy="14" r="3" fill="#f8d090"/><path d="M8 24v-4q4-4 8 0v4M21 12h8m-8 5h8m-8 5h8" stroke="#5c7896" fill="none"/>';
          if (gi === 5 && i === 0) art = '';
          const prefix = `ol-ribbon-${gi}-${i}-`;
          const gradients = [
            ['blue', '#c2ddff', '#387ac6'],
            ['paper', '#ffffff', '#e6edf7'],
            ['green', '#a2df8b', '#3c9d49'],
            ['people', '#abc8e1', '#527aa3'],
          ];
          const defs = gradients
            .map(
              ([id, a, b]) =>
                `<linearGradient id="${prefix}${id}" x2="0" y2="1"><stop stop-color="${a}"/><stop offset=".45" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`,
            )
            .join('');
          art = art
            .replaceAll('#5894db', `url(#${prefix}blue)`)
            .replaceAll('#fbfcff', `url(#${prefix}paper)`)
            .replaceAll('#59b85a', `url(#${prefix}green)`)
            .replaceAll('#5d92c4', `url(#${prefix}people)`);
          svg.innerHTML = `<defs>${defs}</defs>${art}`;
          parent.textContent = '';
          parent.appendChild(svg);
        };
        groups.forEach((g, gi) => {
          const group = util.el('div', 'outlook-group', actions);
          const items = util.el('div', 'outlook-group-items', group);
          g[1].forEach((it, i) => {
            const b = util.el('div', `outlook-action ${g[0] === 'Arrange' && i === 0 ? 'active' : ''}`, items);
            const icon = util.el('b', `outlook-icon outlook-icon-${gi}-${i}`, b, it[0]);
            drawIcon(icon, gi, i);
            util.el('span', '', b, it[1]);
          });
          util.el('small', '', group, g[0]);
        });
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        Object.assign(_c, {
          H,
          ICONS,
          W,
          actions,
          display,
          drawIcon,
          groups,
          ribbon,
          roomy,
          tabs,
          tall,
          win,
          winbuttons,
        });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        const summary = util.el('section', 'outlook-summary', document.body);
        util.el('span', 'outlook-summary-icon', summary, '▦');
        const summaryMain = util.el('div', 'outlook-summary-main', summary);
        util.el('div', 'outlook-summary-title', summaryMain, 'Scheduling Assistant');
        util.el('div', 'outlook-summary-subtitle', summaryMain, 'Day availability · Team calendar');
        const summaryFacts = util.el('div', 'outlook-summary-facts', summary);
        [
          ['♟', 'Team availability'],
          ['◷', 'Business hours'],
          ['⌖', 'Meeting details'],
        ].forEach((x) => {
          const fact = util.el('div', 'outlook-summary-fact', summaryFacts);
          util.el('b', '', fact, x[0]);
          util.el('span', '', fact, x[1]);
        });
        Object.assign(_c, { headerTools, submit, summary, summaryFacts, summaryMain });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const agenda = util.el('aside', 'outlook-agenda', document.body);
        util.el('div', 'outlook-agenda-title', agenda, 'Agenda');
        const agendaDate = util.el('div', 'outlook-agenda-date', agenda);
        const agendaItems = util.el('div', 'outlook-agenda-items', agenda);
        agendaDate.textContent = 'Upcoming';
        const FILLER = [
          ['Team lunch', '12:00 - 13:00', '#2677c9'],
          ['Inbox review', '14:30 - 15:00', '#e48618'],
          ['Planning notes', '15:30 - 16:15', '#31a14a'],
          ['Expense reports', '16:30 - 17:00', '#2677c9'],
        ];
        for (const [title, time, color] of FILLER) {
          const row = util.el('div', 'outlook-agenda-item', agendaItems);
          const stripe = util.el('i', '', row);
          stripe.style.background = color;
          const text = util.el('div', 'outlook-agenda-copy', row);
          util.el('strong', '', text, title);
          util.el('span', '', text, time);
        }
        Object.assign(_c, { agenda, agendaDate, agendaItems, stage });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
        let { submit } = _c;
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', document.body);
          const footText = rng.pick([
            '© 2024 Example Co.',
            'All changes are saved automatically.',
            'Need help? Contact your administrator.',
            'v4.2.1 · Status: all systems normal',
          ]);
          util.el(
            'span',
            'ref-foot-text',
            foot,
            word
              ? lr.pick([
                  `© 2024 Example Co. ${word('footRights')}`,
                  word('footSaved'),
                  word('footHelp'),
                  `v4.2.1 · ${word('footStatus')}`,
                ])
              : footText,
          );
          const tools = util.el('div', 'ref-tools', foot);
          if (decoys.length > 1) decoyBtn(tools, decoys[1]);
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
        const status = util.el('div', 'outlook-status', document.body);
        // Bottom dock: the app's module tabs (the status text is hidden in this design).
        const dockIcons = {
          Mail: '<svg viewBox="0 0 24 20" width="26" height="22" aria-hidden="true"><rect x="1" y="3" width="22" height="15" fill="#f6d34a" stroke="#000"/><path d="M1 3l11 9 11-9" fill="none" stroke="#000"/></svg>',
          Calendar:
            '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><rect x="2" y="3" width="20" height="19" fill="#fff" stroke="#1f3f9f" stroke-width="1.5"/><rect x="2" y="3" width="20" height="5" fill="#1f3f9f"/><path d="M5 11h3M10 11h3M15 11h3M5 15h3M10 15h3M15 15h3M5 19h3M10 19h3" stroke="#4a78d0" stroke-width="2"/></svg>',
          Contacts:
            '<svg viewBox="0 0 24 20" width="26" height="22" aria-hidden="true"><rect x="1" y="2" width="22" height="16" fill="#fff" stroke="#1f3f9f"/><circle cx="8" cy="8" r="3" fill="#d04030"/><path d="M3 16q0-5 5-5t5 5z" fill="#1f3f9f"/><path d="M14 7h7M14 11h7M14 15h5" stroke="#1f3f9f"/></svg>',
          Tasks:
            '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><rect x="3" y="3" width="18" height="19" fill="#fff" stroke="#000"/><path d="M6 12l4 5 9-12" fill="none" stroke="#d01010" stroke-width="3"/></svg>',
          Notes: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><rect x="3" y="2" width="18" height="20" fill="#ffe84a" stroke="#000"/></svg>',
        };
        for (const [tab, cls] of [['Mail', ''], ['Calendar', 'selected'], ['Contacts', ''], ['Tasks', ''], ['Notes', '']]) {
          const dockTab = util.el('span', `ol-dock-tab ${cls}`, status);
          dockTab.innerHTML = `${dockIcons[tab]}<span>${tab}</span>`;
        }
        util.el('span', '', status, 'Items: 8');
        const zoom = util.el('span', 'outlook-zoom', status);
        util.el('span', '', zoom, '100%');
        util.el('i', 'ol-zoom-minus', zoom, '−');
        const zoomTrack = util.el('i', 'ol-zoom-track', zoom);
        util.el('b', '', zoomTrack);
        util.el('i', 'ol-zoom-plus', zoom, '+');
        Object.assign(_c, { status, submit, zoom, zoomTrack });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { display, endBtn, header, label, placement, roomy, tabs, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        // The header (end control, extra buttons, and the note in header mode) lives in the menu row.
        tabs.appendChild(header);
        Object.assign(_c, { submit });
      },
  };

  env.site({
    name: 'design-use-calendar-freeslot-05',
    template: 'site/base',
    design: { parts },
  });
})();
