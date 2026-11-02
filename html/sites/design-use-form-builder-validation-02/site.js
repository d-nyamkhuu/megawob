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
        if (kind === 'banner') {
          const win = document.querySelector('.vista-window');
          el.style.top = document.querySelector('.ref-task').getBoundingClientRect().bottom + 'px';
        }
        if (kind === 'promo') {
          el.style.top = document.querySelector('.ref-task').getBoundingClientRect().bottom + 8 + 'px';
        }
        if (['cookie', 'chat', 'toast'].includes(kind)) {
          const submit = document.querySelector('[data-role="submit"]');
          if (submit) {
            const a = el.getBoundingClientRect(),
              b = submit.getBoundingClientRect();
            if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) {
              el.style.top = 'auto';
              el.style.bottom = document.documentElement.clientHeight - b.top + 12 + 'px';
            }
          }
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const win = util.el('div', 'vista-window', document.body);
        const titlebar = util.el('div', 'vista-titlebar', win);
        const appicon = util.el('span', 'vista-appicon', titlebar);
        appicon.innerHTML =
          '<svg viewBox="0 0 24 24" width="24" height="24"><rect x="1" y="1" width="21" height="21" rx="5" fill="#eaf7ff" stroke="#86a4bd"/><circle cx="10" cy="10" r="7" fill="#6eb9e5"/><path d="M5 5l5-1 2 4-3 2-1 5-4-3z" fill="#e2f4ff"/><path d="M12 12l6-2 4 5-2 6-6-1z" fill="#65a653"/><path d="M16 12v8m-3-5h8" stroke="#dbedbf"/></svg>';
        util.el('span', 'vista-title', titlebar, 'FormBuilder - Twin Rivers Hospital · Service feedback (Draft)');
        const winbuttons = util.el('div', 'vista-window-buttons', titlebar);
        for (const [label, glyph] of [
          ['Minimize', '−'],
          ['Maximize', '□'],
          ['Close', '×'],
        ]) {
          const wb = util.el('button', `vista-window-button vista-${label.toLowerCase()}`, winbuttons, glyph);
          wb.type = 'button';
          wb.title = label;
          wb.setAttribute('aria-label', label);
        }
        const header = util.el('header', 'ref-task', win);
        const menu = util.el('nav', 'vista-menubar', header);
        for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help'])
          util.el('span', 'vista-menu-item', menu, item);
        const toolbar = util.el('div', 'vista-toolbar', header);
        const tool = (icon, label, muted) => {
          const el = util.el('div', `vista-tool${muted ? ' is-muted' : ''}`, toolbar);
          const mark = util.el('span', `vista-tool-icon ${icon}`, el);
          const shapes = {
            new: '<path d="M5 2h12l6 6v20H5z" fill="#f8fdff" stroke="#087bd9"/><path d="M17 2v7h6M7 4v22" fill="none" stroke="#91cbf1"/>',
            open: '<path d="M3 8h8l3-4h10v19H3z" fill="#e8a835" stroke="#a67b28"/><path d="M3 11h24l-5 14H1z" fill="#ffda71" stroke="#b98a36"/><path d="M5 13h19" stroke="#fff3b7" stroke-width="2"/>',
            section:
              '<rect x="4" y="3" width="21" height="24" rx="2" fill="#bde1a2" stroke="#4c994b"/><path d="M5 5h18v6H5" fill="#f3ffe8"/><path d="M10 2h7v9h10v7H17v10h-7V18H1v-7h9z" fill="#47b548" stroke="#21863a"/><path d="M12 3h3v10h10v3H15v10h-3V16H3v-3h9z" fill="#8fda70"/>',
            question:
              '<path d="M11 2h7v10h10v7H18v9h-7v-9H2v-7h9z" fill="#42b03c" stroke="#21863a"/><path d="M13 4h3v10h10v3H16v9h-3V17H4v-3h9z" fill="#8cd86b"/>',
            up: '<path d="M15 2L5 13h6v15h8V13h6z" fill="#1c93e0" stroke="#0872b9"/><path d="M15 5l-7 7h5v13" fill="none" stroke="#9fdcff" stroke-width="2"/>',
            down: '<path d="M11 2h8v15h6L15 28 5 17h6z" fill="#1c93e0" stroke="#0872b9"/><path d="M13 4v15H9l6 6" fill="none" stroke="#9fdcff" stroke-width="2"/>',
            preview:
              '<rect x="2" y="3" width="25" height="19" rx="1" fill="#314e67" stroke="#18374f"/><path d="M4 5h21v14H4z" fill="#66b6e8"/><path d="M5 6h18L5 17z" fill="#a8e1ff"/><path d="M14 22v4m-8 1h17" stroke="#45677f" stroke-width="3"/>',
          };
          mark.innerHTML = `<svg viewBox="0 0 30 30" width="28" height="28" aria-hidden="true">${shapes[icon]}</svg>`;
          util.el('span', '', el, label);
        };
        tool('new', 'New Form');
        tool('open', 'Open');
        util.el('i', 'vista-tool-divider', toolbar);
        tool('section', 'Add Section');
        tool('question', 'Add Question');
        util.el('i', 'vista-tool-divider', toolbar);
        tool('up', 'Move Up', true);
        tool('down', 'Move Down', true);
        util.el('i', 'vista-tool-divider', toolbar);
        tool('preview', 'Preview');
        S.frameBrand(_c, header);
        Object.assign(_c, { appicon, header, menu, titlebar, tool, toolbar, win, winbuttons });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, toolbar, util } = _c;
        if (display === 'header') {
          const note = util.el('div', 'ref-instruction', header, ctx.instruction);
          header.insertBefore(note, toolbar);
        } else util.el('div', 'ref-spacer', header);
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, endBtn, label, placement, toolbar, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', toolbar);
        // This Vista toolbar stays deliberately short. The optional filler labels are still
        // sampled above (preserving the seeded stream), but only the end-word decoy is shown.
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        Object.assign(_c, { headerTools, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util, win } = _c;
        const body = util.el('div', 'ref-body', win);
        S.frameSidebar(_c, body);
        Object.assign(_c, { body });
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, endBtn, label, lr, placement, rng, util, wantFooter, win, word } = _c;
        let { submit } = _c;
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', win);
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
          if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
          if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
          if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
        }
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', win);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        Object.assign(_c, { submit });
      },
    'frame.floating': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-form-builder-validation-02',
    template: 'site/base',
    design: { parts },
  });
})();
