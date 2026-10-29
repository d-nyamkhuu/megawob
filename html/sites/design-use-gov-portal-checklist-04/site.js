// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
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
      const body = document.querySelector('.ref-body');
      const dock = document.querySelector('.gov-dock');
      const dockHeight = dock.getBoundingClientRect().height;
      if (kind === 'banner') document.body.insertBefore(el, body);
      if (kind === 'cookie' || kind === 'chat') el.style.bottom = `${dockHeight + (kind === 'chat' ? 14 : 0)}px`;
      if (kind === 'promo') {
        el.style.top = `${body.getBoundingClientRect().top}px`;
        el.style.bottom = `${dockHeight}px`;
      }
      if (kind === 'toast') el.style.top = `${body.getBoundingClientRect().top + 12}px`;
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winbar = util.el('div', 'gov-windowbar', document.body);
      const seal = util.el('span', 'gov-appicon', winbar);
      seal.innerHTML = '<svg viewBox="0 0 54 58" fill="currentColor" aria-hidden="true"><path d="M27 2 53 16v4H1v-4L27 2ZM6 24h7v24H6zm17 0h8v24h-8zm18 0h7v24h-7zM1 52h52v6H1z"/></svg>';
      util.el('strong', '', winbar, 'Civic Support Portal');
      const wincontrols = util.el('div', 'gov-window-controls', winbar);
      const headNav = util.el('nav', 'gov-headnav-row', winbar);
      for (const item of ['Apply', 'Manage', 'Find support']) util.el('span', 'gov-headnav', headNav, item);
      const headerTools = util.el('div', 'gov-header-actions', winbar);
      // Header actions are populated after the standard end-control draws below.
      for (const mark of ['−', '□', '×']) util.el('span', '', wincontrols, mark);
      const menubar = util.el('nav', 'gov-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Records', 'Tools', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('div', 'gov-toolbar', document.body);
      for (const [icon, label] of [['▯','New'], ['📂','Open'], ['▣','Copy'], ['✕','Delete'], ['▤','Print'], ['⌕','Find']]) {
        const tool = util.el('span', 'gov-tool', toolbar);
        util.el('b', '', tool, icon);
        util.el('span', '', tool, label);
      }
      // Keep the standard episode note and end controls in the application frame.
      document.body.insertBefore(winbar, header);
      document.body.insertBefore(menubar, header);
      document.body.insertBefore(toolbar, header);
      S.frameBrand(_c, header);
      Object.assign(_c, { headNav, header, headerTools, menubar, seal, toolbar, winbar, wincontrols });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, headerTools, util, winbar } = _c;
      if (display === 'header') {
        winbar.classList.add('with-instruction');
        header.classList.add('ref-inline-task');
        const instruction = util.el('div', 'ref-instruction', winbar, ctx.instruction);
        winbar.insertBefore(instruction, headerTools);
      }
      else util.el('div', 'ref-spacer', header);
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, headerTools, label, placement, util, wantFooter } = _c;
      let submit = null;
      const toolsRow = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { submit, toolsRow });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, ctx, display, local, lr, rng, sidebar, util, word } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      {
        const side = util.el('aside', 'ref-side', body);
        if (sidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        util.el('div', 'gov-side-title', side, 'Help and guidance');
        const blocks = [
          ['About this application', 'Civic Support provides financial help for eligible households. Complete the form, attach the required documents and review your details before submitting.'],
          ['Correspondence preferences', 'We will send you important updates about your application by your chosen method. If you select Post, we will send letters to your home address.'],
          ['Document types', 'Choose the correct document type for each file you attach. Files must be clear and in PDF, JPG or PNG format (max 10 MB each).'],
          ['Required documents', 'You must provide all documents marked as Required. Your application cannot be assessed without them.'],
          ['Optional documents', 'Only provide optional documents if they are relevant to your circumstances. You can still complete your application without them.'],
        ];
        const guidance = util.el('div', 'gov-guidance', side);
        for (const [title, copy] of blocks) {
          const block = util.el('section', 'gov-guidance-block', guidance);
          util.el('h3', '', block, title);
          const paragraph = util.el('p', '', block, copy);
          if (title === 'Required documents') {
            paragraph.textContent = 'You must provide all documents marked as ';
            util.el('strong', 'civic-required-badge', paragraph, 'Required');
            paragraph.append('. Your application cannot be assessed without them.');
          }
        }
      }
      if (display === 'panel') {
        const panel = util.el('aside', 'ref-panel', body.querySelector('.ref-side'));
        body.querySelector('.ref-side').insertBefore(panel, body.querySelector('.gov-guidance'));
        const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (rng.bool(0.5)) body.classList.add('ref-panel-right');
      }
      Object.assign(_c, { body });
    },
    'frame.toast': (base, S) => function (_c) {
      const { body, closeLabel, collide, ctx, decoyBtn, decoys, display, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      const dock = util.el('nav', 'gov-dock', document.body);
      const dockIcons = {
        'Applications': '<path d="M5 2h19l6 6v24H5z"/><path d="M10 13h15m-15 6h15m-15 6h15" fill="none" stroke="#b71923" stroke-width="2"/>',
        'Saved drafts': '<path d="M2 7h11l3 4h15v4H7L2 30V7Z"/><path d="M8 17h25l-6 15H3z"/>',
        'Support and guidance': '<circle cx="14" cy="13" r="10" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="m22 22 10 10" fill="none" stroke="currentColor" stroke-width="4"/>',
        'My account': '<circle cx="17" cy="9" r="7"/><path d="M4 33v-4c0-14 26-14 26 0v4Z"/>',
      };
      for (const [icon, item, active] of [['▤', 'Applications', true], ['▰', 'Saved drafts', false], ['⌕', 'Support and guidance', false], ['●', 'My account', false]]) {
        const link = util.el('div', `gov-dock-item${active ? ' active' : ''}`, dock);
        const glyph = util.el('b', '', link);
        glyph.innerHTML = `<svg viewBox="0 0 36 36" fill="currentColor" aria-hidden="true">${dockIcons[item]}</svg>`;
        util.el('span', '', link, item);
      }
      if (display === 'toast') {
        const note = util.el('div', 'ref-note', body.querySelector('.ref-side'));
        util.el('div', 'ref-note-text', note, ctx.instruction);
        const x = util.el('button', 'ref-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', closeLabel);
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
      }
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', dock);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'ref-foot-text', foot, word ? lr.pick([`© 2024 Example Co. ${word('footRights')}`,
          word('footSaved'), word('footHelp'), `v4.2.1 · ${word('footStatus')}`]) : footText);
        const tools = util.el('div', 'ref-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const floatDock = util.el('div', 'ref-float-dock', dock);
        submit = endBtn(floatDock, 'ref-submit ref-float', label);
      }
      Object.assign(_c, { dock, dockIcons, submit });
    },
    'frame.panel': (base, S) => function (_c) {
    },
    'frame.footer': (base, S) => function (_c) {
    },
    'frame.floating': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-gov-portal-checklist-04',
    template: 'site/base',
    design: { parts },
  });
})();
