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
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
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
        const header = document.querySelector('.ref-task');
        const toolbar = document.querySelector('.carbon-toolbar');
        const top = Math.max(
          header ? header.getBoundingClientRect().bottom : 0,
          toolbar ? toolbar.getBoundingClientRect().bottom : 0,
        );
        if (kind === 'banner' || kind === 'toast' || kind === 'promo')
          el.style.top = `${top + (kind === 'toast' ? 10 : 0)}px`;
        if (kind === 'cookie' || kind === 'promo') el.style.bottom = 'var(--carbon-footer-height, 0px)';
        if (kind === 'chat') el.style.bottom = 'calc(var(--carbon-footer-height, 0px) + 12px)';
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.theme': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
        const { rng, util, content } = ctx;
        let name = rng.pick(Object.keys(THEMES));
        const root = document.documentElement;
        let accent = rng.pick(ACCENTS);
        const tr = rng.fork('chrome/theme');
        if (tr.bool(0.08)) {
          name = 'low';
          accent = tr.pick(LOW_ACCENTS);
        }
        // This design is the dark developer calendar in the reference image.
        name = 'dark';
        accent = '#63ee72';
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(`--${k}`, v);
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx, util } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');

        // Carbon-era application frame surrounding the task window.
        const winbar = util.el('div', 'carbon-titlebar', document.body);
        util.el('span', 'carbon-appicon', winbar, '▦');
        util.el('strong', '', winbar, 'Calendar');
        const wincontrols = util.el('div', 'carbon-window-controls', winbar);
        util.el('span', '', wincontrols, '—');
        util.el('span', '', wincontrols, '□');
        util.el('span', '', wincontrols, '×');
        const menubar = util.el('nav', 'carbon-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Go', 'Event', 'Share', 'Window', 'Help'])
          util.el('span', '', menubar, item);
        const toolbar = util.el('div', 'carbon-toolbar', document.body);
        for (const [icon, label] of [
          ['event', 'New Event'],
          ['people', 'New Meeting'],
          ['delete', 'Delete'],
          ['day', 'Day'],
          ['week', 'Week'],
          ['month', 'Month'],
          ['list', 'List'],
          ['today', 'Today'],
        ]) {
          const item = util.el('div', 'carbon-tool', toolbar);
          const graphic = util.el('span', 'carbon-tool-icon carbon-icon-' + icon, item);
          if (icon === 'people') {
            graphic.innerHTML =
              '<svg viewBox="0 0 36 34"><path fill="#d5e1ed" stroke="#18242d" d="M20 4c8-3 12 9 5 13l6 4 1 8H15l1-8 5-4C16 15 16 7 20 4z"/><path fill="#a9cdeb" stroke="#18242d" d="M11 4c9-2 12 10 5 14l7 5 1 8H3l1-8 7-5C5 15 5 7 11 4z"/></svg>';
          } else if (icon === 'delete') {
            graphic.innerHTML =
              '<svg viewBox="0 0 36 34"><circle cx="18" cy="17" r="12" fill="#cb5a52" stroke="#f4c4bf" stroke-width="3"/><path d="m10 9 16 16" stroke="#fff" stroke-width="4"/></svg>';
          } else {
            graphic.innerHTML =
              '<svg viewBox="0 0 36 34"><rect x="6" y="5" width="24" height="26" rx="2" fill="#ecf0f3" stroke="#222b33"/><path d="M6 11h24M12 3v7M24 3v7" stroke="#707d88" stroke-width="2"/><path d="M10 15h16M10 20h16M10 25h16" stroke="#8b959c"/><path d="M16 13v15M22 13v15" stroke="#8b959c"/></svg>';
            if (icon === 'day')
              graphic.innerHTML =
                '<svg viewBox="0 0 36 34"><rect x="6" y="5" width="24" height="26" rx="2" fill="#f4f5f6" stroke="#202b34"/><path d="M6 11h24M12 3v7M24 3v7" stroke="#73808b" stroke-width="2"/><path d="M11 16h5v10h-5zM20 16h5v4h-5zM20 23h5v3h-5z" fill="#c1cbd3" stroke="#667887"/></svg>';
            if (icon === 'week')
              graphic.innerHTML =
                '<svg viewBox="0 0 36 34"><rect x="6" y="5" width="24" height="26" rx="2" fill="#e8eff6" stroke="#202b34"/><path d="M6 11h24M12 3v7M24 3v7" stroke="#718495" stroke-width="2"/><path d="M11 15h5v12h-5zM21 15h5v12h-5z" fill="#fff" stroke="#59738a"/><path d="M12 19h3m-3 4h3m7-4h3m-3 4h3" stroke="#59738a"/></svg>';
            if (icon === 'list')
              graphic.innerHTML =
                '<svg viewBox="0 0 36 34"><rect x="5" y="5" width="26" height="26" rx="3" fill="#ecf0f3" stroke="#202b34"/><path d="M5 11h26M10 3v7M26 3v7" stroke="#77838d" stroke-width="2"/><path d="M11 16h2m3 0h10m-15 5h2m3 0h10m-15 5h2m3 0h10" stroke="#637582" stroke-width="2"/></svg>';
            if (icon === 'event') util.el('b', 'carbon-calendar-number', graphic, '31');
            if (icon === 'event') util.el('b', 'carbon-add-event', graphic, '+');
            if (icon === 'today') util.el('b', 'carbon-calendar-number', graphic, '30');
          }
          util.el('span', '', item, label);
        }
        const search = util.el('div', 'carbon-search', toolbar);
        util.el('span', '', search, '⌕');
        util.el('span', '', search, 'Search Events');
        Object.assign(_c, { H, W, display, menubar, roomy, search, tall, toolbar, winbar, wincontrols });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, display, endBtn, header, label, placement, toolbar, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        if (display !== 'header') toolbar.appendChild(headerTools);
        Object.assign(_c, { headerTools, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const appside = util.el('aside', 'carbon-appside', body);
        const monthHead = util.el('div', 'carbon-side-month', appside);
        util.el('span', '', monthHead, '‹');
        util.el('strong', '', monthHead, 'November 2027');
        util.el('span', '', monthHead, '›');
        const mini = util.el('div', 'carbon-mini-calendar', appside);
        for (const day of ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']) util.el('span', 'carbon-mini-weekday', mini, day);
        for (const day of [
          31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
          30, 1, 2, 3, 4,
        ])
          util.el('span', day === 12 ? 'carbon-mini-selected' : '', mini, String(day));
        for (const [title, rows] of [
          ['Calendars', ['My Calendar', 'Team', 'Projects', 'Holidays', 'Birthdays']],
          ['People', ['Alex Carter', 'Jamie Park', 'Morgan Lee', 'Taylor Kim', 'Riley Chen']],
          ['Rooms', ['Conference Room A', 'Conference Room B', 'Studio 1', 'Studio 2']],
        ]) {
          const group = util.el('section', 'carbon-side-group', appside);
          util.el('div', 'carbon-side-heading', group, title);
          rows.forEach((row, i) => {
            const line = util.el('div', 'carbon-side-row', group);
            util.el('i', 'carbon-check' + (title !== 'Rooms' && row !== 'Birthdays' ? ' checked' : ''), line);
            if (title !== 'Rooms') util.el('i', `carbon-swatch swatch-${i}`, line);
            util.el('span', '', line, row);
          });
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { appside, body, mini, monthHead });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        const floatwin = util.el('section', 'carbon-float-window', body);
        const floatbar = util.el('div', 'carbon-floatbar', floatwin);
        util.el('span', '', floatbar, '●');
        util.el('span', '', floatbar, '●');
        util.el('span', '', floatbar, '●');
        floatwin.appendChild(stage);
        S.frameAlign(_c, stage);
        const dock = util.el('nav', 'calendar-dock', document.body);
        const dockItems = [
          ['▣', 'Calendar'],
          ['☑', 'Tasks'],
          ['▱', 'Projects'],
          ['♙', 'People'],
          ['◴', 'Reports'],
        ];
        for (const [icon, text] of dockItems) {
          const item = util.el('div', `calendar-dock-item${text === 'Calendar' ? ' active' : ''}`, dock);
          util.el('span', 'calendar-dock-icon', item, icon);
          util.el('span', '', item, text);
        }
        const dockTools = util.el('div', 'calendar-dock-tools', dock);
        util.el('span', '', dockTools, '⌕');
        util.el('span', '', dockTools, '♧');
        util.el('span', '', dockTools, '⚙');
        Object.assign(_c, { dock, dockItems, dockTools, floatbar, floatwin, stage });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const foot = document.querySelector('.ref-foot');
        const floatDock = document.querySelector('.ref-float-dock');
        document.body.style.setProperty(
          '--carbon-footer-height',
          `${(foot ? foot.getBoundingClientRect().height : 0) + (floatDock ? floatDock.getBoundingClientRect().height : 0)}px`,
        );
        Object.assign(_c, { floatDock, foot, submit });
      },
  };

  env.site({
    name: 'design-use-calendar-move-04',
    template: 'site/base',
    design: { parts },
  });
})();
