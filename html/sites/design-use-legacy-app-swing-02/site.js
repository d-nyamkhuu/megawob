// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const ICON_PATHS = {
    Home: 'M2 11 12 2l10 9h-3v11h-5v-7h-4v7H5V11z',
    Routing:
      'M12 7v5M5 17v-5h14v5M9 4a3 3 0 1 0 6 0 3 3 0 0 0-6 0M2 20a3 3 0 1 0 6 0 3 3 0 0 0-6 0m7 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0m7 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0',
    'Work Orders': 'M5 2h10l5 5v15H5zM14 2v6h6M9 12h7M9 16h7',
    Equipment: 'M21 2a7 7 0 0 1-8 9L4 21a2 2 0 0 1-3-3l10-9a7 7 0 0 1 9-8l-5 5 3 3z',
    Parts: 'M2 7 12 1l10 6v12l-10 5-10-5zM2 7l10 6 10-6M12 13v11',
    Vendors: 'M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8m9 0a3 3 0 1 0 0-6M1 22v-4a7 7 0 0 1 14 0v4zm15-9a6 6 0 0 1 7 5v4h-5',
    Reports: 'M3 22V12h4v10m3 0V3h4v19m3 0V7h4v15',
    Administration:
      'M9 1h6l1 4 4-1 3 5-3 3 3 3-3 5-4-1-1 4H9l-1-4-4 1-3-5 3-3-3-3 3-5 4 1zm3 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
  };

  const desktopIcon = (name) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICON_PATHS[name] || ICON_PATHS.Administration}"/></svg>`;

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
        if (kind === 'banner') document.querySelector('.ref-body').before(el);
        if (kind === 'promo') {
          const art = util.el('div', 'swing-promo-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 140 160" aria-hidden="true"><circle cx="70" cy="80" r="46" fill="#008df2"/><path d="M36 60h68v45H36zM36 61l34 28 34-28" fill="white" stroke="#008df2" stroke-width="4"/><circle cx="22" cy="24" r="11" fill="#b4d8fc"/><circle cx="118" cy="130" r="12" fill="#b4d8fc"/><circle cx="114" cy="12" r="9" fill="#b4d8fc"/></svg>';
          util.el('h2', 'swing-promo-title', box, 'Stay in the loop');
          const close = util.el('button', 'swing-promo-close', box, '×');
          close.type = 'button';
          close.setAttribute('aria-label', 'Close');
          close.addEventListener('click', () => ctx.dismiss('close'));
        }
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo') {
          const email = util.el('input', 'swing-promo-email', box);
          email.type = 'email';
          email.placeholder = 'Your email address';
          email.setAttribute('aria-label', 'Your email address');
          const consent = util.el('label', 'swing-promo-consent', box);
          const check = util.el('input', '', consent);
          check.type = 'checkbox';
          util.el('span', '', consent, 'I agree to receive product updates and marketing communications.');
        }
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
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const titlebar = util.el('div', 'swing-titlebar', header);
        util.el('div', 'swing-company', titlebar, '⚙');
        util.el('div', 'swing-appname', titlebar, 'Operations Manager');
        util.el('div', 'swing-meta', titlebar, '−　 □　 ×');
        const appnav = util.el('nav', 'swing-nav', header);
        for (const [i, item] of ['File', 'Edit', 'View', 'Records', 'Tools', 'Window', 'Help'].entries()) {
          const a = util.el('a', `swing-navlink${i === 3 ? ' active' : ''}`, appnav, item);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label: item });
          });
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { appnav, header, titlebar });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, titlebar, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        const headerNote = header.querySelector('.ref-instruction');
        if (headerNote) {
          headerNote.classList.add('swing-instruction');
          titlebar.appendChild(headerNote);
        }
        Object.assign(_c, { headerNote });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        const toolbarIcons = [
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h10l4 4v14H5zM14 3v5h5M8 12h8M8 16h8"/></svg>',
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h7l2 2h9v11H3zM3 7l2-3h6l2 3"/></svg>',
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-9 0 1 14h10l1-14M10 10v8m4-8v8"/></svg>',
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14-5L4 8m0-5v5h5M4 13a8 8 0 0 0 14 5l2-2m0 5v-5h-5"/></svg>',
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h10l4 4v14H5zM14 3v5h5M8 12h8M8 16h8"/></svg>',
        ];
        for (const [i, text] of ['New', 'Open', 'Delete', 'Refresh', 'Reports⌄'].entries()) {
          const tool = util.el('button', 'swing-toolbar-action', headerTools);
          tool.innerHTML = `${toolbarIcons[i]}<span>${text}</span>`;
          tool.type = 'button';
          tool.addEventListener('click', () => env.log('decoy', { what: 'toolbar', label: text }));
        }
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        Object.assign(_c, { headerTools, submit, toolbarIcons });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rail = util.el('aside', 'swing-rail', body);
        util.el('div', 'swing-rail-heading', rail, 'Operations');
        const sections = [
          ['♧', 'Routing'],
          ['▤', 'Work Orders'],
          ['🔧', 'Equipment'],
          ['⬡', 'Parts'],
          ['●', 'Vendors'],
          ['⚙', 'Administration'],
        ];
        for (const [i, [icon, labelText]] of sections.entries()) {
          const a = util.el('a', `swing-rail-link${i === 0 ? ' active' : ''}`, rail);
          util.el('span', 'swing-rail-icon', a).innerHTML = desktopIcon(labelText);
          util.el('span', '', a, labelText);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'sidebar', label: labelText });
          });
        }
        const summary = util.el('section', 'swing-summary', rail);
        util.el('div', 'swing-summary-heading', summary, 'Summary');
        for (const [labelText, count] of [
          ['Routing Records', '48'],
          ['Work Orders', '132'],
          ['Equipment', '86'],
          ['Parts', '314'],
          ['Vendors', '27'],
        ]) {
          const row = util.el('div', 'swing-summary-row', summary);
          util.el('span', '', row, labelText);
          util.el('span', '', row, count);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, rail, sections, summary });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const dock = util.el('nav', 'swing-dock', document.body);
        const dockIcons = ['⌂', '♧', '▤', '🔧', '⬡', '●', '▥'];
        for (const [i, item] of [
          'Home',
          'Routing',
          'Work Orders',
          'Equipment',
          'Parts',
          'Vendors',
          'Reports',
        ].entries()) {
          const a = util.el('a', `swing-docklink${i === 1 ? ' active' : ''}`, dock);
          util.el('span', 'swing-dock-icon', a).innerHTML = desktopIcon(item);
          util.el('span', '', a, item);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'dock', label: item });
          });
        }
        util.el('div', 'swing-dock-status', dock, 'Records: 48　 |　 Selected: 1');
        Object.assign(_c, { dock, dockIcons, stage });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { dock, endBtn, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const footer = document.querySelector('.ref-foot');
        if (footer) dock.insertBefore(footer, dock.lastElementChild);
        Object.assign(_c, { footer, submit });
      },
  };

  env.site({
    name: 'design-use-legacy-app-swing-02',
    template: 'site/base',
    design: { parts },
  });
})();
