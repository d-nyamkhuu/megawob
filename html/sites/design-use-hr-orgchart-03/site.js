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
        if (kind === 'banner') {
          const header = document.querySelector('.ref-task');
          const top = header.getBoundingClientRect().bottom;
          el.style.top = `${top}px`;
          document.body.append(el);
        }
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
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const caption = util.el('div', 'win-caption', header);
        const peopleIcon =
          '<svg viewBox="0 0 34 32" aria-hidden="true"><g stroke="#111" stroke-width="1"><circle cx="11" cy="7" r="5" fill="#1689ef"/><path d="M3 28V19q0-8 8-8t8 8v9Z" fill="#1689ef"/><circle cx="25" cy="7" r="5" fill="#ffc51b"/><path d="M17 28V19q0-8 8-8t8 8v9Z" fill="#000080"/><circle cx="16" cy="15" r="5" fill="#ffcf18"/><path d="M8 31V26q0-8 8-8t8 8v5Z" fill="#00aa60"/></g></svg>';
        util.el('span', 'win-app-icon', caption).innerHTML = peopleIcon;
        util.el('span', '', caption, 'People Operations - Employee Directory');
        const windowControls = util.el('div', 'win-window-controls', caption);
        for (const symbol of ['−', '□', '×']) util.el('span', '', windowControls, symbol);
        const menu = util.el('div', 'win-menu', header);
        for (const item of ['File', 'Edit', 'View', 'Employee', 'Reports', 'Tools', 'Help'])
          util.el('span', '', menu, item);
        const toolbar = util.el('div', 'win-toolbar', header);
        const icons = [
          '<svg viewBox="0 0 32 32"><path d="M7 2h13l6 6v22H7z" fill="#fff" stroke="#222" stroke-width="2"/><path d="M20 2v7h6M11 15h11M11 20h11" stroke="#164d9c" stroke-width="2"/></svg>',
          '<svg viewBox="0 0 32 32"><path d="m7 23 2-7L23 2l7 7-14 14-7 2z" fill="#ffe34d" stroke="#222" stroke-width="2"/><path d="m20 5 7 7" stroke="#c33" stroke-width="3"/></svg>',
          '<svg viewBox="0 0 32 32"><circle cx="8" cy="9" r="5" fill="#1674dc" stroke="#111"/><path d="M8 14v13m-5-7h10" stroke="#111" stroke-width="3"/><circle cx="24" cy="9" r="5" fill="#e33" stroke="#111"/><path d="M24 14v13m-5-7h10M12 9h8m-3-4 4 4-4 4" fill="none" stroke="#111" stroke-width="2"/></svg>',
          '<svg viewBox="0 0 32 32"><g fill="#111" stroke="#111"><path d="M4 10h8l2 18H2Zm16 0h8l2 18H18Z"/><rect x="6" y="3" width="5" height="10"/><rect x="21" y="3" width="5" height="10"/><path d="M11 12h10v7H11"/></g><g fill="#fff"><ellipse cx="7" cy="23" rx="2" ry="3"/><ellipse cx="24" cy="23" rx="2" ry="3"/><path d="m6 6 3-1v5H6Zm16 0 3-1v5h-3Z"/></g></svg>',
          '<svg viewBox="0 0 32 32"><path d="M16 3v7M6 12h20M6 12v6m10-6v6m10-6v6M6 18H3v10h8V18zm10 0h-4v10h8V18zm10 0h-4v10h8V18z" fill="#fff" stroke="#164d9c" stroke-width="2"/><circle cx="16" cy="4" r="3" fill="#f6c32e"/></svg>',
          '<svg viewBox="0 0 32 32"><path d="M4 28V12h6v16zm9 0V5h6v23zm9 0V9h6v19z" fill="#1674dc" stroke="#111" stroke-width="2"/><path d="M2 29h29" stroke="#111" stroke-width="2"/></svg>',
          '<svg viewBox="0 0 32 32"><path d="M3 14h26v13H3z" fill="#aaa" stroke="#111" stroke-width="1.5"/><path d="m5 15 5-7h18l-4 7Z" fill="#eee" stroke="#111"/><path d="m10 3-3 13h17l5-13Z" fill="#fff" stroke="#111" stroke-width="1.5"/><path d="M13 6h11m-12 4h11" stroke="#000080" stroke-width="2"/><path d="M8 21h16v9H8z" fill="#ddd" stroke="#111"/><path d="M4 18h3" stroke="#000080"/></svg>',
        ];
        for (const [idx, text] of ['New', 'Edit', 'Move', 'View', 'Org Chart', 'Reports', 'Print'].entries()) {
          const tool = util.el('div', 'win-tool', toolbar);
          util.el('span', 'win-tool-icon', tool).innerHTML = icons[idx];
          util.el('span', '', tool, text);
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { caption, header, icons, menu, peopleIcon, toolbar, windowControls });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, peopleIcon, rng, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        const detail = util.el('aside', 'org-detail', body);
        util.el('div', 'org-detail-title', detail, 'Employee Details');
        const help = util.el('aside', 'org-help', body);
        util.el('div', 'org-help-title', help, 'About This View');
        util.el(
          'p',
          'org-help-copy',
          help,
          'This screen shows the company’s reporting structure. Select an employee to view their details, direct reports, and manager.',
        );
        util.el('div', 'org-help-title org-help-subtitle', help, 'Tips');
        const tips = util.el('ul', 'org-help-list', help);
        for (const tip of [
          'Click the + or − icons to expand or collapse teams.',
          'Use Edit or Move to change an employee’s manager.',
          'Use the search box below to find employees by name or department.',
        ])
          util.el('li', '', tips, tip);
        util.el('div', 'org-help-title org-help-subtitle', help, 'Icons');
        const legend = util.el('div', 'org-help-legend', help);
        for (const [symbol, label] of [
          ['●', 'Executive'],
          ['●', 'Manager'],
          ['●', 'Employee'],
          ['●', 'Selected Employee'],
          ['👥', 'Department (collapsed)'],
          ['⊞', 'Department (expanded)'],
        ]) {
          const row = util.el('div', 'org-help-legend-row', legend);
          const icon = util.el('span', 'org-help-symbol', row, symbol);
          if (symbol === '●') {
            icon.classList.add('w31-icon');
            icon.innerHTML =
              '<svg viewBox="0 0 28 34" aria-hidden="true"><circle cx="14" cy="9" r="7"/><path d="M3 32V24Q3 17 10 16L14 19L18 16Q25 17 25 24V32Z"/></svg>';
          }
          if (symbol === '👥') icon.innerHTML = peopleIcon;
          if (symbol === '⊞') {
            icon.textContent = '−';
            icon.classList.add('win-legend-expanded');
          }
          util.el('span', '', row, label);
        }
        // Preserve the original frame draw order without letting per-seed alignment
        // move the anchored task widget away from its locate() coordinates.
        rng.pick(['center', 'center', 'flex-start', 'flex-end']);
        rng.pick(['center', 'center', 'flex-start', 'flex-end']);
        Object.assign(_c, { detail, help, legend, stage, tips });
      },
    'frame.toast': (base, S) =>
      function (_c) {
        const { closeLabel, ctx, display, util } = _c;
        if (display === 'toast') {
          const noteDock = util.el('div', 'ref-note-dock', document.body);
          const note = util.el('div', 'ref-note', noteDock);
          util.el('div', 'ref-note-text', note, ctx.instruction);
          const x = util.el('button', 'ref-note-x', note, '×');
          x.type = 'button';
          x.setAttribute('aria-label', closeLabel);
          x.addEventListener('click', () => {
            note.style.visibility = 'hidden';
            env.log('note-close');
          });
        }
        const status = util.el('div', 'win-status', document.body);
        util.el('span', 'win-status-company', status);
        util.el('span', 'win-status-count', status);
        Object.assign(_c, { status });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { endBtn, label, placement, status, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        document.body.append(status);
        Object.assign(_c, { submit });
      },
  };

  env.site({
    name: 'design-use-hr-orgchart-03',
    template: 'site/base',
    design: { parts },
  });
})();
