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
        if (kind === 'promo') {
          const art = util.el('span', 'ref-promo-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 180 200" aria-hidden="true"><path d="M13 111L88 61 167 111v77H13z" fill="#f4bd36" stroke="#d2a12c" stroke-width="2"/><path d="M35 45h109v112H35z" fill="#fff" stroke="#dadfe3" stroke-width="2"/><path d="M51 67h77M51 86h77M51 105h77M51 124h49" stroke="#72b3ed" stroke-width="7"/><path d="M13 111l76 48 78-48v77H13z" fill="#ffd553"/><path d="M13 188l76-59 78 59" fill="#ffd966" stroke="#e9b83d" stroke-width="2"/><g stroke="#81baff" stroke-width="6" stroke-linecap="round"><path d="M88 9v15M20 80L8 73M160 78l13-8M143 34l8-13"/></g><path d="M42 31l-6-11" stroke="#ffe1a1" stroke-width="6" stroke-linecap="round"/></svg>';
          const close = util.el('button', 'ref-promo-close', box, '×');
          close.type = 'button';
          close.title = word ? word('close') : 'Close';
          close.setAttribute('aria-label', close.title);
          close.addEventListener('click', () => ctx.dismiss('close'));
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
        const { ctx } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.dataset.instructionDisplay = display;
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        // Native Workplace Shell window frame: app title, menu row and compact toolbar.
        const osTitle = util.el('div', 'os-title', header);
        const appIcon = util.el('span', 'os-appicon', osTitle);
        appIcon.innerHTML =
          '<svg viewBox="0 0 22 26"><path d="M3 1h11l6 6v18H3z" fill="#f9faf6" stroke="#42596e"/><path d="M14 1v7h6M7 12h9M7 16h9M7 20h6" fill="none" stroke="#657a8b" stroke-width="1.5"/></svg>';
        util.el('strong', 'os-apptitle', osTitle, 'Inventory Manager - Products');
        osTitle.querySelector('.os-apptitle').textContent = 'Order Manager';
        const osWindow = util.el('div', 'os-window-controls', osTitle);
        for (const mark of ['−', '□', '×']) util.el('span', 'os-window-button', osWindow, mark);
        const osMenu = util.el('nav', 'os-menu', header);
        for (const label of ['File', 'Edit', 'View', 'Products', 'Tools', 'Reports', 'Window', 'Help']) {
          util.el('span', 'os-menu-item', osMenu, label);
        }
        ['Home', 'Orders', 'Customers', 'Products', 'Reports', 'Settings'].forEach((label, i) => {
          osMenu.children[i].textContent = label;
        });
        const navArt = [
          '<path d="M2 15L16 2l14 13h-5v15h-7V20h-5v10H6V15z" fill="#6c8293" stroke="#4d6375" stroke-width="1.5"/>',
          '<rect x="4" y="2" width="25" height="29" rx="2" fill="#7197b6" stroke="#4b6c89" stroke-width="2"/><path d="M10 9h13M10 15h13M10 21h9" stroke="#e8f1f8" stroke-width="2"/><path d="M7 4h19" stroke="#a8c1d6"/>',
          '<g fill="#6c8293" stroke="#4f6477"><ellipse cx="12" cy="8" rx="5" ry="7"/><path d="M3 29v-9q9-10 18 0v9z"/><ellipse cx="26" cy="13" rx="4" ry="5"/><path d="M23 21q9-4 9 8h-9z"/></g>',
          '<path d="M3 9l14-7 13 6v20l-13 5-14-6z" fill="#bba784" stroke="#8f7e62" stroke-width="1.5"/><path d="M3 9l14 6 13-7M17 15v18" fill="none" stroke="#f1e3c5" stroke-width="2"/><path d="M11 5l13 6v7l-5-2V9" fill="#e4d6b9"/>',
          '<g fill="#768b9d" stroke="#4d6375"><path d="M3 20h6v12H3zM13 4h6v28h-6zM23 13h6v19h-6z"/></g><path d="M5 21v10M15 5v26M25 14v17" stroke="#afbdc7"/>',
          '<path d="M13 2h7l1 5 4 2 5-1 3 6-4 4v4l3 4-4 5-5-2-4 2-2 4h-6l-2-5-4-2-4 1-3-6 4-3v-5l-3-3 3-5 5 1 4-2z" transform="translate(1 -1) scale(.9)" fill="#93a3af" stroke="#607588" stroke-width="1.5"/><circle cx="16" cy="16" r="6" fill="#eeede8" stroke="#607588" stroke-width="1.5"/>',
        ];
        navArt.forEach((art, i) => {
          const icon = util.el('span', 'os-nav-icon', osMenu.children[i]);
          icon.innerHTML = `<svg viewBox="0 0 34 36" aria-hidden="true">${art}</svg>`;
        });
        const osBar = util.el('div', 'os-toolbar', header);
        for (const [icon, label] of [
          ['▧', 'New'],
          ['✎', 'Edit'],
          ['▤', 'Delete'],
          ['▣', 'Print'],
          ['▧', 'Export'],
          ['◉', 'Adjust Stock'],
          ['⚒', 'More⌄'],
        ]) {
          const item = util.el('span', 'os-tool-item', osBar);
          util.el('b', 'os-tool-icon', item, icon);
          util.el('span', '', item, label);
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { appIcon, header, navArt, osBar, osMenu, osTitle, osWindow });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { W, body, display, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        // Preserve the original heading sample size when the help panel is moved.
        const oldGap = W > 1250 ? 18 : 12;
        const oldTips = W > 1250 ? 320 : W > 1050 ? 260 : 0;
        let oldStageWidth = W * (W > 1250 ? 0.945 : 0.96) - oldTips - (oldTips ? oldGap : 0);
        if (display === 'panel') oldStageWidth -= Math.min(320, W * 0.24) + W * 0.011 + oldGap;
        const oldCardWidth = oldStageWidth - 18 - (oldStageWidth >= 1000 ? 156 : 44);
        stage.dataset.headingSampleSize = oldCardWidth > 700 ? '2' : '1';
        S.frameAlign(_c, stage);
        Object.assign(_c, { oldCardWidth, oldGap, oldStageWidth, oldTips, stage });
      },
    'frame.toast': (base, S) =>
      function (_c) {
        const { body, closeLabel, ctx, display, util } = _c;
        const help = util.el('div', 'ref-help', body);
        const panelNote = body.querySelector('.ref-panel');
        if (panelNote) help.append(panelNote);
        const tips = util.el('aside', 'ref-tips', help);
        const tipsTitle = util.el('div', 'ref-tips-title', tips);
        const bulb = util.el('span', 'ref-bulb', tipsTitle);
        bulb.innerHTML =
          '<svg viewBox="0 0 28 38"><path d="M8 27c0-5-6-7-6-14C2-2 26-2 26 13c0 7-6 9-6 14z" fill="#ffd963" stroke="#b99132" stroke-width="2"/><path d="M8 27h12v6H8z" fill="#a8aaa4" stroke="#727775" stroke-width="2"/><path d="M10 34h8l-2 3h-4z" fill="#595e5c"/><path d="M7 14C5 6 14 3 18 7" fill="none" stroke="#fff5bc" stroke-width="3" stroke-linecap="round"/></svg>';
        util.el('span', '', tipsTitle, 'Tips');
        const tipsList = util.el('ul', 'ref-tips-list', tips);
        for (const tip of [
          'Use the search box to quickly find orders by any field.',
          'Click the funnel icon in a column header to filter values.',
          'Click a column header to sort. Drag to reorder columns.',
          'Use checkboxes to select multiple orders. Shift-click selects a range.',
          'Use the toolbar to perform bulk actions on selected orders.',
          'You can resize columns by dragging the header borders.',
        ])
          util.el('li', '', tipsList, tip);
        if (display === 'toast') {
          const note = util.el('div', 'ref-note', help);
          help.prepend(note);
          util.el('div', 'ref-note-text', note, ctx.instruction);
          const x = util.el('button', 'ref-note-x', note, '×');
          x.type = 'button';
          x.setAttribute('aria-label', closeLabel);
          x.addEventListener('click', () => {
            note.style.visibility = 'hidden';
            env.log('note-close');
          });
        }
        Object.assign(_c, { bulb, help, panelNote, tips, tipsList, tipsTitle });
      },
  };

  env.site({
    name: 'design-use-data-grid-filter-03',
    template: 'site/base',
    design: { parts },
  });
})();
