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
        const headerBottom = document.querySelector('.ref-task').getBoundingClientRect().bottom;
        if (kind === 'promo' || kind === 'toast') {
          el.style.top = headerBottom + 8 + 'px';
        }
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
        const { display, lr, nav, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        header.classList.add(`xp-display-${display}`);
        const windowControls = util.el('div', 'xp-window-controls', header);
        for (const symbol of ['−', '□', '×']) util.el('span', '', windowControls, symbol);
        const menu = util.el('nav', 'xp-menu', header);
        for (const label of ['File', 'Edit', 'View', 'Insert', 'Tools', 'Help']) util.el('span', '', menu, label);
        const toolbar = util.el('div', 'xp-toolbar', header);
        const toolbarItems = ['New Survey', 'Open', 'Copy', 'Delete', 'Preview', 'Publish'];
        const toolbarArt = [
          '<path fill="#fff" stroke="#6d92c3" d="M5 2h13l6 6v21H5z"/><path fill="#d8e8fa" stroke="#6d92c3" d="M18 2v7h6"/>',
          '<path fill="#ffcf66" stroke="#af771b" d="M2 8h10l3-4h9v8H2z"/><path fill="#ffe3a0" stroke="#bd821e" d="M1 13h27l-6 14H1z"/><path fill="none" stroke="#f5a42b" stroke-width="2" d="M15 7h9l-3-3m3 3-3 3"/>',
          '<path fill="#e6f1ff" stroke="#5f86bc" d="M3 2h12l5 5v19H3z"/><path fill="#fff" stroke="#5f86bc" d="M11 8h11l5 5v17H11z"/><path stroke="#7da3cd" d="M14 17h10m-10 4h10m-10 4h10"/>',
          '<path fill="none" stroke="#9d2421" stroke-width="6" d="m5 5 20 21M25 5 5 26"/><path fill="none" stroke="#ef5650" stroke-width="3" d="m5 4 20 21M25 4 5 25"/>',
          '<path fill="#43b642" stroke="#218b24" stroke-width="2" d="m8 4 18 12L8 28z"/>',
          '<defs><radialGradient id="globe"><stop stop-color="#d7f3ff"/><stop offset="1" stop-color="#3c80c7"/></radialGradient></defs><circle fill="url(#globe)" stroke="#3d6aaf" cx="15" cy="15" r="13"/><path fill="#67b857" d="m5 7 5-3 3 4-3 5-5 1zm10 8 7-4 4 6-4 3-1 7-6-3z"/><path fill="#fff" stroke="#4f7ab9" d="M21 19h7v11h-7z"/>',
        ];
        for (const [i, label] of toolbarItems.entries()) {
          const item = util.el('div', 'xp-tool', toolbar);
          const icon = util.el('span', 'xp-tool-icon', item);
          icon.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true">' + toolbarArt[i] + '</svg>';
          util.el('span', '', item, label);
        }
        const search = util.el('div', 'xp-search', toolbar);
        util.el('span', 'xp-search-icon', search, '⌕');
        util.el('span', '', search, 'Search surveys');
        if (display !== 'header' || nav) {
          rng.pick(TITLES); // retain the original seeded draw
          const title = 'Twin Rivers Hospital · Service feedback';
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
          brand.dataset.role = 'brand';
        }
        Object.assign(_c, { header, menu, search, toolbar, toolbarArt, toolbarItems, windowControls });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const overview = util.el('aside', 'ref-overview', body);
        util.el('div', 'ref-overview-head', overview, 'Surveys');
        const index = util.el('div', 'ref-survey-index', overview);
        const records = [
          ['Employee Engagement', 'Draft', '2008-11-02'],
          ['IT Support Feedback', 'Published', '2008-10-21'],
          ['Patient Intake', 'Draft', '2008-11-01'],
          ['Twin Rivers Hospital · Service feedback', 'Draft', '2008-11-03'],
          ['Community Health Needs', 'Published', '2008-10-18'],
          ['Volunteer Registration', 'Draft', '2008-10-29'],
          ['Facilities Suggestion Box', 'Draft', '2008-10-12'],
          ['Annual Staff Survey', 'Published', '2008-09-30'],
          ['Training Course Evaluation', 'Draft', '2008-10-25'],
          ['Website Feedback', 'Draft', '2008-10-16'],
        ];
        const indexHead = util.el('div', 'ref-survey-row ref-survey-head', index);
        for (const value of ['Title', 'Status', 'Last Modified']) util.el('span', '', indexHead, value);
        for (const [title, status, date] of records) {
          const row = util.el('div', `ref-survey-row${title.startsWith('Twin Rivers') ? ' selected' : ''}`, index);
          util.el('span', '', row, title);
          util.el('span', '', row, status);
          util.el('span', '', row, date);
        }
        util.el('div', 'ref-overview-line', overview, 'Title　　Twin Rivers Hospital · Service feedback');
        util.el('div', 'ref-overview-line', overview, 'Status　　Draft');
        util.el('div', 'ref-overview-line', overview, 'Created　　Feb 20, 1997');
        util.el('div', 'ref-overview-line', overview, 'Last edited　 Feb 20, 1997');
        util.el('div', 'ref-overview-rule', overview);
        util.el('div', 'ref-overview-subhead', overview, 'Sections　　　3');
        util.el('div', 'ref-overview-line', overview, 'Questions　　 8');
        util.el('div', 'ref-overview-line', overview, 'Estimated time　4 minutes');
        util.el('div', 'ref-overview-rule', overview);
        util.el('div', 'ref-overview-subhead', overview, 'Response summary');
        util.el('div', 'ref-overview-line', overview, 'Total responses　　 0');
        util.el('div', 'ref-overview-line', overview, 'Completed　　　　 0');
        util.el('div', 'ref-overview-line', overview, 'Partial　　　　　 0');
        util.el('div', 'ref-overview-rule', overview);
        util.el('div', 'ref-overview-subhead', overview, 'Response policy');
        util.el('div', 'ref-overview-line', overview, 'Collect email addresses　 No');
        util.el('div', 'ref-overview-line', overview, 'One response per person　No');
        util.el('div', 'ref-overview-line', overview, 'Scheduled closing　　　Not set');
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, index, indexHead, overview, records });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, overview, rng, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', overview);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
      },
    'frame.toast': (base, S) =>
      function (_c) {
        const {
          closeLabel,
          collide,
          ctx,
          decoyBtn,
          decoys,
          display,
          endBtn,
          label,
          lr,
          overview,
          placement,
          rng,
          util,
          wantFooter,
          word,
        } = _c;
        let { submit } = _c;
        const dock = util.el('nav', 'xp-dock', document.body);
        const dockItems = [
          ['survey', 'Surveys'],
          ['templates', 'Templates'],
          ['themes', 'Themes'],
          ['branching', 'Branching'],
          ['policies', 'Response Policies'],
          ['reports', 'Reports'],
        ];
        dockItems.forEach(([icon, text], i) => {
          const item = util.el('div', `xp-dock-item${i === 0 ? ' selected' : ''}`, dock);
          const holder = util.el('span', 'xp-dock-icon', item);
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 40 40');
          svg.setAttribute('aria-hidden', 'true');
          const art = {
            survey:
              '<path fill="#b4b3aa" stroke="#4a5867" stroke-width="1.5" d="M9 7h24v31H9z"/><path fill="#fff" stroke="#5276a1" d="M7 6h23v30H7z"/><path fill="#f5cb66" stroke="#9e6d25" d="M13 4h3a3 3 0 0 1 6 0h3v5H13z"/><path stroke="#cc4436" stroke-width="2" d="m10 13 2 2 2-4m-4 10 2 2 2-4m-4 10 2 2 2-4"/><path stroke="#5a82b5" d="M17 13h9m-9 3h8m-8 5h9m-9 3h8m-8 5h9m-9 3h8"/>',
            templates:
              '<path fill="#d9e8f7" stroke="#37699e" stroke-width="2" d="M6 10h20v25H6z"/><path fill="#fff" stroke="#37699e" stroke-width="2" d="M13 5h17l5 6v23H13z"/><path stroke="#5791cb" stroke-width="2" d="M18 17h12M18 22h12M18 27h9"/>',
            themes:
              '<path fill="#e6e9e7" stroke="#426d9b" stroke-width="1.5" d="M20 5C10 5 4 12 4 21c0 8 6 14 14 14h4c3 0 5-2 5-5 0-2-2-3-2-5 0-2 2-3 5-3 4 0 6-2 6-5C36 10 29 5 20 5z"/><circle fill="#e94b45" stroke="#975b54" cx="13" cy="14" r="2.5"/><circle fill="#4d8bd1" stroke="#57738e" cx="21" cy="11" r="2.5"/><circle fill="#e6af26" stroke="#9c783d" cx="28" cy="15" r="2.5"/><circle fill="#5a9adb" stroke="#3c6489" cx="11" cy="23" r="2.5"/><path fill="#c7a466" stroke="#755b38" d="m23 22 3 2-7 12-3-2z"/>',
            branching:
              '<path fill="#f5f8fc" stroke="#315f94" stroke-width="2" d="M5 8h11v9H5zM24 5h11v9H24zM24 27h11v9H24z"/><path fill="none" stroke="#3477bd" stroke-width="3" d="M16 12h4q4 0 4-4M20 12q4 0 4 4v15M16 12h4q4 0 4 4"/><path fill="#e1aa2e" stroke="#94651c" d="M5 26h11v9H5z"/>',
            policies:
              '<path fill="#f4bb35" stroke="#9b6714" stroke-width="2" d="M10 17h20v18H10z"/><path fill="none" stroke="#694a20" stroke-width="4" d="M14 18v-5a6 6 0 0 1 12 0v5"/><circle fill="#fff4c5" cx="20" cy="25" r="2"/><path stroke="#fff4c5" stroke-width="2" d="M20 27v4"/>',
            reports:
              '<path fill="#f7f8fb" stroke="#315f94" stroke-width="2" d="M6 5h28v30H6z"/><path fill="#4d91d2" stroke="#285d99" d="M10 21h5v10h-5z"/><path fill="#f2b432" stroke="#a36c0d" d="M18 14h5v17h-5z"/><path fill="#72b64a" stroke="#457e2b" d="M26 9h5v22h-5z"/>',
          }[icon];
          svg.innerHTML = art;
          holder.appendChild(svg);
          util.el('span', 'xp-dock-label', item, text);
        });
        if (display === 'toast') {
          const note = util.el('div', 'ref-note', overview);
          util.el('div', 'ref-note-text', note, ctx.instruction);
          const x = util.el('button', 'ref-note-x', note, '×');
          x.type = 'button';
          x.setAttribute('aria-label', closeLabel);
          x.addEventListener('click', () => {
            note.style.visibility = 'hidden';
            env.log('note-close');
          });
        }
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
          dock.appendChild(foot);
        }
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
          document.querySelector('.xp-dock').appendChild(dock);
        }
        Object.assign(_c, { dock, dockItems, submit });
      },
    'frame.footer': (base, S) => function (_c) {},
    'frame.floating': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-use-form-builder-settings-02',
    template: 'site/base',
    design: { parts },
  });
})();
