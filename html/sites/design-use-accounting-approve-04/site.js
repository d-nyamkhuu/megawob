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
        if (kind === 'cookie') {
          const end = document.querySelector('[data-role="submit"]');
          if (end) {
            const rect = end.getBoundingClientRect();
            if (rect.top > window.innerHeight - 120) el.style.right = window.innerWidth - rect.left + 14 + 'px';
          }
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const menu = util.el('div', 'mac-menu', document.body);
        const drawIcon = (parent, path, cls = '') => {
          const svg = util.svg(
            'svg',
            { viewBox: '0 0 24 24', class: 'mac-bitmap-icon ' + cls, 'aria-hidden': 'true' },
            parent,
          );
          util.svg('path', { d: path }, svg);
          return svg;
        };
        const personPath = 'M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M4 22v-3a8 8 0 0 1 16 0v3z';
        drawIcon(
          menu,
          'M17 2c-2 0-4 2-4 4 3 0 4-2 4-4 M12 7C6 3 1 9 4 16c2 5 4 7 7 5 2-1 3-1 5 0 2 1 4-2 5-5-4-2-4-6-1-8-2-2-4-2-8-1z',
          'mac-apple',
        );
        for (const item of ['LedgerPro', 'File', 'Edit', 'View', 'Records', 'Tools', 'Window', 'Help']) {
          util.el('span', 'mac-menu-item', menu, item);
        }
        util.el('span', 'mac-menubar-right', menu, '▣　 Mon Apr 10　9:24 AM');
        const header = util.el('header', 'ref-task mac-titlebar', document.body);
        util.el('span', 'mac-window-box mac-close', header, '□');
        util.el('div', 'ap-title', header, 'LedgerPro – Accounting Workspace');
        util.el('span', 'mac-window-box mac-min', header, '—');
        util.el('span', 'mac-window-box mac-max', header, '□');
        S.frameBrand(_c, header);
        Object.assign(_c, { drawIcon, header, menu, personPath });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction mac-instruction-row', document.body, ctx.instruction);
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { drawIcon, personPath, util } = _c;
        const tabs = util.el('nav', 'mac-tabs', document.body);
        const tabNames = [
          ['M2 8l10-6 10 6z M4 10v9m5-9v9m6-9v9m5-9v9M2 22h20M2 19h20', 'Reconcile'],
          ['M4 2h12l5 5v14H4zM16 2v6h5M7 7h5M7 11h10M7 15h10M7 18h7M2 5v18h15', 'Journal'],
          ['M5 2l2 2 2-2 3 2 3-2 2 2 2-2v20l-3-2-3 2-3-2-3 2-2-2zM8 8h8m-8 4h8m-8 4h6', 'Expenses'],
          ['M8 4H4v18h16V4h-4M9 2h6v5H9zM8 13l3 3 6-7', 'Approve'],
          ['M3 2v20h20M7 18V9h3v9zm5 0V4h3v14zm5 0V7h3v11z', 'Reports'],
        ];
        tabNames.forEach(([icon, title], i) => {
          const tab = util.el('div', `mac-tab${i === 3 ? ' active' : ''}`, tabs);
          drawIcon(tab, icon, 'mac-tab-icon');
          util.el('span', '', tab, title);
        });
        const body = util.el('div', 'ref-body mac-body', document.body);
        const help = util.el('aside', 'mac-help', body);
        const helpHead = util.el('div', 'mac-help-head', help);
        drawIcon(
          helpHead,
          'M2 3c4-2 7-1 10 1 3-2 6-3 10-1v17c-4-2-7-1-10 1-3-2-6-3-10-1zM12 4v17M5 7h4M5 11h4M5 15h4M15 7h4M15 11h4M15 15h4',
        );
        util.el('strong', '', helpHead, 'Help & Tips');
        const helpText = util.el('div', 'mac-help-copy', help);
        helpText.innerHTML =
          '<p>Build the approval route for an invoice using the policy at right.</p><p>Select staff from the list and add them to the route in the required order.</p><p>The policy determines which approvers are required based on the invoice amount.</p><p>After the route is complete, approve for payment.</p><hr><b>Icons:</b><div class="mac-legend">♟　= Staff member<br>♟♟ = Department<br>▤　= Invoice<br>➜　= Add to route<br>⬆　= Move up<br>⬇　= Move down<br>▤　= Remove from route</div>';
        const legend = helpText.querySelector('.mac-legend');
        legend.replaceChildren();
        const legendIcons = [
          [personPath, 'Staff member'],
          [
            'M8 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6M1 21v-5a7 7 0 0 1 14 0v5zM18 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6m-1 8c4-1 6 3 6 6v4h-6z',
            'Department',
          ],
          ['M5 2h10l5 5v15H5zM15 2v6h5M8 11h8M8 15h8M8 19h5', 'Invoice'],
          ['M2 9h10V4l10 8-10 8v-5H2z', 'Add to route'],
          ['M9 22V12H4l8-10 8 10h-5v10z', 'Move up'],
          ['M9 2v10H4l8 10 8-10h-5V2z', 'Move down'],
          ['M5 6h14l-1 16H6zM3 6h18M9 6V2h6v4M9 10v8m6-8v8', 'Remove from route'],
        ];
        legendIcons.forEach(([path, title], i) => {
          const row = util.el('div', 'mac-legend-row', legend);
          drawIcon(row, path, i === 0 || i === 1 || i === 3 || i === 4 || i === 5 ? 'mac-icon-filled' : '');
          util.el('span', '', row, '= ' + title);
        });
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, help, helpHead, helpText, legend, legendIcons, tabNames, tabs });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, helpText, lr, rng, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
          helpText.querySelectorAll('p').forEach((p) => p.remove());
          helpText.prepend(panel);
        }
      },
  };

  env.site({
    name: 'design-use-accounting-approve-04',
    template: 'site/base',
    design: { parts },
  });
})();
