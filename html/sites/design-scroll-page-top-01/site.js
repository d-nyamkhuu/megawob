// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
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
            { bg: '#fff', panel: '#fff', fg: '#111', muted: '#333', line: '#111' }[k] || v,
          );
        root.style.setProperty('--accent', accent);
        root.dataset.theme = name;
        Object.assign(_c, { accent, content, name, rng, root, tr, util });
      },
    'frame.placement': (base, S) =>
      function (_c) {
        const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = roomy && rng.bool(0.35);
        const nav = W >= 1180 && rng.bool(0.5);
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
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
          collide,
          cr,
          decoys,
          drawIcon,
          icons,
          label,
          menu,
          nav,
          placement,
          sidebar,
          svg,
          wantFooter,
        });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, menu, util } = _c;
        const shell = util.el('header', 'ref-task', document.body);
        shell.appendChild(menu);
        const header = util.el('div', 'mac-title-bar', shell);
        if (display === 'header') header.classList.add('mac-note-header');
        S.frameBrand(_c, header);
        Object.assign(_c, { header, shell });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const {
          collide,
          decoyBtn,
          decoys,
          drawIcon,
          endBtn,
          header,
          icons,
          label,
          placement,
          shell,
          util,
          wantFooter,
        } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        const appTools = util.el('div', 'mac-app-tools', shell);
        for (const [icon, label] of [
          ['home', 'Home'],
          ['topics', 'Help Topics'],
          ['index', 'Index'],
          ['search', 'Search'],
        ]) {
          const tool = util.el('div', 'mac-app-tool', appTools);
          drawIcon(tool, `mac-app-icon mac-icon-${icon}`, icons[icon]);
          util.el('span', '', tool, label);
        }
        Object.assign(_c, { appTools, headerTools, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { drawIcon, icons, util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const topicIndex = util.el('aside', 'mac-topic-index', body);
        util.el('div', 'mac-index-heading', topicIndex, 'Help Topics');
        for (const item of [
          'Getting Started',
          'Using Files and Folders',
          'Working with Applications',
          'Printing Documents',
          'Managing Your Disk',
          'Network and Sharing',
          'Security and Passwords',
          'Customizing Your Macintosh',
          'Troubleshooting',
          'Keyboard Shortcuts',
          'Accessibility',
          'Frequently Asked Questions',
          'Macintosh Help',
          'Glossary',
          'Contact Support',
        ]) {
          const row = util.el('div', `mac-topic${item === 'Macintosh Help' ? ' selected' : ''}`, topicIndex);
          drawIcon(row, 'mac-doc-icon', icons.document);
          util.el('span', '', row, item);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, topicIndex });
      },
  };

  env.site({
    name: 'design-scroll-page-top-01',
    template: 'site/base',
    design: { parts },
  });
})();
