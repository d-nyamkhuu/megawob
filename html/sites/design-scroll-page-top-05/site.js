// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base) =>
      function (ctx) {
        const result = base(ctx);
        if (ctx.kind === 'chat') {
          const title = ctx.util.el('div', 'br-chat-title', null, '◯  Chat with us');
          result.el.insertBefore(title, result.el.firstChild);
          const input = ctx.util.el('div', 'br-chat-input', result.el, 'Type a message…');
          ctx.util.el('span', '', input, '➤');
        }
        return result;
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
        for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name]))
          root.style.setProperty(
            `--${k}`,
            { bg: '#fff', panel: '#fff', fg: '#0b1533', muted: '#293d65', line: '#dce2ec' }[k] || v,
          );
        root.style.setProperty('--accent', '#0875ff');
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        base(_c);
        const { util } = _c;
        const drawIcon = (parent, cls, markup) => {
          const el = util.el('span', cls, parent);
          el.setAttribute('aria-hidden', 'true');
          el.innerHTML = markup;
          return el;
        };
        const svg = (viewBox, paths) => `<svg viewBox="${viewBox}" focusable="false" aria-hidden="true">${paths}</svg>`;
        const icons = {
          apple: svg(
            '0 0 24 28',
            '<path d="M15.7 5.2c1.2-1.4 1.1-3.1 1.1-3.1s-1.9.1-3.1 1.5c-1 1.1-1.2 2.5-1.2 2.5s1.9.1 3.2-.9ZM12.6 7.2c-1.1 0-2-.7-3.3-.7-2.3 0-5.1 2-5.1 6 0 3.7 2.8 10.1 5.5 10.1 1 0 1.7-.7 3-.7s2 .7 3 .7c1.7 0 3.2-2.4 4.1-4.5-2.4-1.1-2.6-4.6-.2-5.8-.7-2.7-2.8-4.1-4.7-4.1-1.1 0-1.6.5-2.3.5Z"/>',
          ),
          home: svg('0 0 32 32', '<path d="M3 14 16 3l13 11M7 12v16h18V12M13 28V18h6v10"/>'),
          topics: svg('0 0 32 32', '<path d="M6 3h14l7 7v19H6zM20 3v8h7M10 16h13M10 20h13M10 24h10"/>'),
          index: svg(
            '0 0 36 32',
            '<path d="M3 8c5-2 10-1 15 2v19c-5-3-10-4-15-2zM33 8c-5-2-10-1-15 2v19c5-3 10-4 15-2zM18 10v19"/><path d="M7 12c2-.5 4 0 6 1M23 13c2-1 4-1 6-.5"/>',
          ),
          search: svg('0 0 32 32', '<circle cx="13" cy="13" r="9"/><path d="m20 20 9 9"/>'),
          help: svg('0 0 24 24', '<path d="M3 2h18v20H3z"/><path d="M9 8a3 3 0 1 1 5 2c-1.3 1-2 1.5-2 3M12 17v1"/>'),
          monitor: svg('0 0 28 24', '<path d="M2 2h24v16H2zM10 22h8M14 18v4"/>'),
          document: svg('0 0 30 32', '<path d="M4 2h15l7 7v21H4zM19 2v8h7"/><path d="M8 15h13M8 19h13M8 23h13"/>'),
        };
        const menu = util.el('div', 'mac-menu', document.body);
        drawIcon(menu, 'mac-apple', icons.apple);
        for (const item of ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Options', 'Window', 'Help'])
          util.el('span', 'mac-menu-item', menu, item);
        util.el('span', 'mac-clock', menu, '10:24 AM');
        drawIcon(menu, 'mac-menu-help', icons.help);
        drawIcon(menu, 'mac-menu-monitor', icons.monitor);
        Object.assign(_c, {
          drawIcon,
          icons,
          menu,
          svg,
        });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, menu, util } = _c;
        const titlebar = util.el('div', 'br-window-titlebar', document.body);
        const appIcon = util.el('span', 'br-app-icon', titlebar);
        appIcon.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 4q5-2 9 1v16q-4-3-9-1zM21 4q-5-2-9 1v16q4-3 9-1zM7 7v6M17 7v6"/></svg>';
        util.el('span', 'br-window-title', titlebar, 'BrightRead');
        const windowControls = util.el('div', 'br-window-controls', titlebar);
        util.el('span', '', windowControls, '−');
        util.el('span', '', windowControls, '□');
        util.el('span', '', windowControls, '×');
        const shell = util.el('header', 'ref-task', document.body);
        shell.appendChild(titlebar);
        shell.appendChild(menu);
        const header = util.el('div', 'mac-title-bar', shell);
        if (display === 'header') header.classList.add('mac-note-header');
        S.frameBrand(_c, header);
        const brand = header.querySelector('.ref-brand') || util.el('div', 'ref-brand', header);
        brand.textContent = 'BrightRead';
        Object.assign(_c, { header, shell, titlebar });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        base(_c);
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        Object.assign(_c, { body });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        stage.style.justifyContent = 'flex-start';
        stage.style.alignItems = 'stretch';
        Object.assign(_c, { stage });
      },
    'frame.panel': (base) =>
      function (_c) {
        base(_c);
        const title = _c.body.querySelector('.ref-panel-title');
        if (title) title.textContent = 'ⓘ  A quick note';
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { rng, lr, util } = _c;
        // The design supplies its status text; isolate the template's filler draws.
        _c.rng = rng.fork('chrome/site/footer');
        _c.lr = lr.fork('chrome/site/footer');
        base(_c);
        Object.assign(_c, { rng, lr });
        const foot = document.querySelector('.ref-foot') || util.el('footer', 'ref-foot', document.body);
        const text = foot.querySelector('.ref-foot-text') || util.el('span', 'ref-foot-text', foot);
        text.textContent = 'Tip: Use your mouse wheel, the page navigation or the keyboard (PageDown / Home) to move through the article.';
        const icon = util.el('span', 'br-tip-icon', null, 'ⓘ');
        foot.insertBefore(icon, foot.firstChild);
      },
  };

  env.site({
    name: 'design-scroll-page-top-05',
    template: 'site/base',
    design: { parts },
  });
})();
