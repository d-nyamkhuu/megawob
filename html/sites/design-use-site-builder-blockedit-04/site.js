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
        const appbar = document.querySelector('.gnome-appbar').getBoundingClientRect();
        const end = document.querySelector('[data-role="submit"]');
        const endRect = end && end.getBoundingClientRect();
        const bottom = endRect && endRect.top > window.innerHeight / 2 ? window.innerHeight - endRect.top + 12 : 12;
        if (kind === 'banner' || kind === 'toast') el.style.top = `${appbar.bottom + (kind === 'toast' ? 12 : 0)}px`;
        if (kind === 'cookie') el.style.bottom = `${bottom > 12 ? bottom : 0}px`;
        if (kind === 'chat') el.style.bottom = `${bottom}px`;
        if (kind === 'promo') {
          el.style.top = `${appbar.bottom}px`;
          el.style.bottom = `${bottom}px`;
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, lr, nav, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : 'Rivermere Public Library');
          brand.dataset.role = 'brand';
        }
        Object.assign(_c, { header });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { H, body, display, endBtn, header, label, name, placement, stage, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }

        // Native GNOME-style application frame for this page-builder design.
        // The original frame nodes remain in use: instruction and episode end controls
        // are moved into the visible app bars, preserving their handlers and settings.
        const titlebar = util.el('div', 'gnome-titlebar', document.body);
        util.el('span', 'gnome-app-title', titlebar, 'Coral Reef Dive Center  —  Page Editor');
        const winControls = util.el('div', 'gnome-window-controls', titlebar);
        for (const glyph of ['−', '□', '×']) util.el('span', 'gnome-window-control', winControls, glyph);
        const menubar = util.el('nav', 'gnome-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help'])
          util.el('span', 'gnome-menu-item', menubar, item);
        const appbar = util.el('div', 'gnome-appbar', document.body);
        const paths = {
          'Add Block': 'M12 7v10M7 12h10',
          Duplicate: 'M8 8H3v13h13v-5M8 3h13v13H8z',
          Delete: 'M4 6h16M9 3h6M6 6l1 15h10l1-15M10 9v9M14 9v9',
          'Move Up': 'M12 21V3M4 11l8-8 8 8',
          'Move Down': 'M12 3v18M4 13l8 8 8-8',
          Dashboard: 'M3 11l9-8 9 8M5 10v11h5v-7h4v7h5V10',
          Pages: 'M6 2h9l5 5v15H6zM14 2v6h6M9 12h8M9 16h8',
          Blog: 'M4 3h15v8M4 3v18h9M7 7h8M7 11h5M12 18l7-7 3 3-7 7-4 1z',
          Media: 'M3 4h18v16H3zM3 17l6-6 4 4 3-3 5 6M8 8h.01',
          Campaigns: 'M3 10l15-6v16L3 14zM8 16l1 6h4l-2-5M21 8v8',
          Social: 'M21 5l-3 1a5 5 0 0 0-8 5C6 11 3 8 2 7c-1 6 2 10 6 11-2 2-5 2-7 2 10 5 19-3 19-12z',
          SEO: 'M15 15l7 7M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0M6 10h8',
          Analytics: 'M5 21V12M12 21V3M19 21V7',
          Settings:
            'M9 3l1-2h4l1 2 3 2 3 1v4l-2 2 1 4-3 3-3-1-3 2H7l-1-3-3-2v-4l2-2V6zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
          blocks: 'M6 2h9l5 5v15H6zM14 2v6h6',
          images: 'M3 4h18v16H3zM3 17l6-6 4 4 3-3 5 6M8 8h.01',
          links: 'M9 15l6-6M8 17l-2 2a4 4 0 0 1-5-5l5-5a4 4 0 0 1 5 0M16 7l2-2a4 4 0 0 1 5 5l-5 5a4 4 0 0 1-5 0',
          words: 'M3 5h18M3 10h18M3 15h11M3 20h7',
        };
        const drawIcon = (parent, name) => {
          const svg = util.svg(
            'svg',
            {
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-width': 1.8,
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'aria-hidden': 'true',
            },
            parent,
          );
          if (name === 'Add Block')
            util.svg('circle', { cx: 12, cy: 12, r: 10, fill: 'currentColor', stroke: 'none' }, svg);
          util.svg('path', { d: paths[name], stroke: name === 'Add Block' ? '#fff' : 'currentColor' }, svg);
        };
        const actionGroup = util.el('div', 'gnome-action-group', appbar);
        for (const [glyph, text] of [
          ['+', 'Add Block'],
          ['▢', 'Duplicate'],
          ['▤', 'Delete'],
          ['↑', 'Move Up'],
          ['↓', 'Move Down'],
        ]) {
          const control = util.el('div', 'gnome-action', actionGroup);
          drawIcon(util.el('span', 'gnome-action-icon', control), text);
          util.el('span', '', control, text);
        }
        if (display === 'header') {
          const note = header.querySelector('.ref-instruction');
          if (note) {
            note.classList.add('gnome-task-note');
            appbar.appendChild(note);
          }
        }
        const oldTools = header.querySelector('.ref-tools');
        if (oldTools) {
          oldTools.classList.add('gnome-end-tools');
          appbar.appendChild(oldTools);
        }
        const status = util.el('div', 'gnome-draft-status', appbar);
        util.el('span', 'gnome-status-dot', status);
        util.el('span', '', status, 'Draft (unpublished)');
        appbar.appendChild(status);
        util.el('div', 'gnome-publish-slot', appbar);
        const summary = util.el('aside', 'gnome-summary', body);
        const brandRow = util.el('div', 'gnome-brand', summary);
        const coral = util.el('span', 'gnome-coral', brandRow);
        coral.innerHTML =
          '<svg viewBox="0 0 32 36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 33V6m0 20L7 20 4 10m12 11 8-7 3-8M16 15 10 9 9 3m7 8 5-6V2M16 31 7 28 3 22m13 7 10-6 3-6M7 20l-5-3m22-3 5-2M11 34h12M12 18 8 15m12 5 2 4M15 7l-2-5"/></svg>';
        util.el('strong', '', brandRow, 'Coral Reef Dive Center');
        const navItems = [
          ['⌂', 'Dashboard'],
          ['▤', 'Pages'],
          ['▧', 'Blog'],
          ['▧', 'Media'],
          ['⚑', 'Campaigns'],
          ['♡', 'Social'],
          ['⌕', 'SEO'],
          ['▥', 'Analytics'],
          ['⚙', 'Settings'],
        ];
        for (const [icon, text] of navItems) {
          const row = util.el('div', text === 'Pages' ? 'gnome-side-item is-active' : 'gnome-side-item', summary);
          drawIcon(util.el('span', 'gnome-side-icon', row), text);
          util.el('span', '', row, text);
        }
        const stats = util.el('div', 'gnome-summary-card', summary);
        util.el('strong', '', stats, 'Page Summary');
        for (const [icon, text] of [
          ['▯', '4 blocks'],
          ['▧', '2 images'],
          ['↗', '3 links'],
          ['≡', '412 words'],
        ]) {
          const row = util.el('div', 'gnome-stat', stats);
          drawIcon(util.el('span', '', row), text.split(' ').slice(1).join(' '));
          util.el('span', '', row, text);
        }
        if (display === 'panel') {
          const panel = body.querySelector('.ref-panel');
          if (panel) {
            if (H < 800) {
              panel.classList.add('gnome-panel-fallback');
              appbar.appendChild(panel);
            } else summary.insertBefore(panel, stats);
          }
        }
        const headerNote = appbar.querySelector('.gnome-task-note, .gnome-panel-fallback');
        if (headerNote) {
          const instructionbar = util.el('div', 'gnome-instructionbar', document.body);
          instructionbar.appendChild(headerNote);
          if (oldTools) instructionbar.appendChild(oldTools);
          document.body.insertBefore(instructionbar, menubar);
        }
        body.insertBefore(summary, stage);
        document.body.insertBefore(titlebar, header);
        document.body.insertBefore(menubar, header);
        document.body.insertBefore(appbar, body);
        header.classList.add('gnome-original-chrome');
        body.classList.add('gnome-content');
        stage.style.justifyContent = 'stretch';
        stage.style.alignItems = 'stretch';
        Object.assign(_c, {
          actionGroup,
          appbar,
          brandRow,
          coral,
          drawIcon,
          headerNote,
          menubar,
          navItems,
          oldTools,
          paths,
          stats,
          status,
          submit,
          summary,
          titlebar,
          winControls,
        });
      },
  };

  env.site({
    name: 'design-use-site-builder-blockedit-04',
    template: 'site/base',
    design: { parts },
  });
})();
