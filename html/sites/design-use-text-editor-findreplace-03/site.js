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
      if (kind === 'promo') {
        const heading = util.el('h2', 'workspace-promo-title', null, 'Stay in the loop');
        box.prepend(heading);
        const email = util.el('input', 'workspace-promo-email', box);
        email.type = 'email';
        email.placeholder = 'Your email address';
        email.setAttribute('aria-label', 'Your email address');
        box.insertBefore(email, row);
        const x = util.el('button', 'workspace-promo-close', box, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.addEventListener('click', () => dismiss.click());
      }
      if (kind === 'chat') {
        const entry = util.el('div', 'workspace-chat-entry', box);
        const input = util.el('input', '', entry);
        input.placeholder = 'Type a message…';
        input.setAttribute('aria-label', 'Chat message');
        const send = util.el('button', '', entry, '➤');
        send.type = 'button';
        send.setAttribute('aria-label', 'Send chat message');
        send.addEventListener('click', () => { env.log('overlay-click', { label: 'Send chat message' }); input.value = ''; });
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { content, local, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (true) {
        rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'WorkSpace');
        brand.dataset.role = 'brand';
      }
      if (true) {
        const n = util.el('nav', 'ref-nav', header);
        local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        for (const label of ['Files', 'Edit', 'View', 'Run', 'Tools', 'Help']) {
          const a = util.el('a', 'ref-navlink', n, label);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const actions = util.el('div', 'studio-actions', header);
      util.el('span', 'studio-search', actions, '⌕');
      util.el('i', '', actions);
      util.el('span', 'studio-avatar', actions, 'JD');
      Object.assign(_c, { actions, headerTools, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, header, util } = _c;
      const editorWindow = util.el('section', 'workspace-window', body);
      const windowTitle = util.el('div', 'workspace-window-title', editorWindow);
      util.el('span', 'workspace-file-icon', windowTitle);
      util.el('strong', '', windowTitle, 'Project Plan');
      const headerNote = header.querySelector('.ref-instruction');
      if (headerNote) windowTitle.append(headerNote);
      const windowControls = util.el('div', 'workspace-window-controls', windowTitle);
      for (const symbol of ['−', '□', '×']) util.el('span', '', windowControls, symbol);
      const stage = util.el('main', 'ref-stage', editorWindow);
      S.frameAlign(_c, stage);
      const docs = util.el('aside', 'workspace-documents', body);
      util.el('div', 'workspace-pane-title', docs, 'Documents');
      for (const [name, date, selected] of [
        ['Project Plan', 'Apr 12, 2002', true], ['Requirements', 'Apr 10, 2002'], ['Design Notes', 'Apr 09, 2002'],
        ['API Guide', 'Apr 07, 2002'], ['Test Plan', 'Apr 05, 2002'], ['Release Notes', 'Apr 02, 2002'],
        ['Meeting Minutes', 'Mar 28, 2002'], ['Product Brief', 'Mar 25, 2002'], ['Roadmap', 'Mar 22, 2002'],
        ['Status Report', 'Mar 20, 2002'], ['QA Checklist', 'Mar 18, 2002'], ['Marketing Plan', 'Mar 15, 2002'],
        ['Competitive Analysis', 'Mar 12, 2002'], ['Technical Specs', 'Mar 08, 2002'], ['Budget', 'Mar 05, 2002'],
      ]) {
        const row = util.el('div', `workspace-doc${selected ? ' selected' : ''}`, docs);
        util.el('span', 'workspace-file-icon', row);
        util.el('span', 'workspace-doc-name', row, name);
        util.el('span', 'workspace-doc-date', row, date);
      }
      const help = util.el('aside', 'studio-help', editorWindow);
      const panelNote = body.querySelector('.ref-panel');
      util.el('h2', '', help, 'Document Details');
      for (const [label, value, icon] of [['Type:', 'Document', '▤'], ['Size:', '24 KB', ''], ['Modified:', 'Apr 12, 2002   10:24 AM', ''], ['Author:', 'Alex Rivera', '']]) {
        const row = util.el('div', 'workspace-detail', help);
        util.el('span', '', row, label);
        if (icon) util.el('i', 'workspace-detail-icon workspace-file-icon', row);
        util.el('b', '', row, value);
      }
      util.el('h3', '', help, 'Related Documents');
      for (const name of ['Requirements', 'Design Notes', 'API Guide']) {
        const row = util.el('div', 'workspace-related', help);
        util.el('span', 'workspace-file-icon', row);
        util.el('a', '', row, name);
      }
      util.el('h3', '', help, 'Tags');
      util.el('p', 'workspace-tags', help, 'driver card\nhardware\nfield engineering\nrelease 1.0');
      if (panelNote) help.append(panelNote);
      editorWindow.style.setProperty('--ws-title-height', `${windowTitle.getBoundingClientRect().height}px`);
      Object.assign(_c, { docs, editorWindow, headerNote, help, panelNote, stage, windowControls, windowTitle });
    },
    'frame.footer': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, util, wantFooter, word } = _c;
      let { submit } = _c;
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot', document.body);
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
      const dock = util.el('nav', 'workspace-dock', document.body);
      const dockArt = {
        Home: '<path d="M2 19 20 3l18 16h-5v19H23V25h-7v13H7V19Z"/>',
        Documents: '<path fill="#fff9d0" d="M5 2h22l9 9v28H5Z"/><path fill="#a5cbed" d="M27 2v10h9"/><path fill="none" stroke="#1265b0" stroke-width="2" d="M10 18h20M10 23h20M10 28h20M10 33h20"/>',
        Calendar: '<rect x="4" y="6" width="32" height="32" rx="2"/><path stroke="#e64120" stroke-width="7" d="M5 13h30"/><path fill="none" stroke-width="2" d="M12 1v11M28 1v11M9 23h22M9 30h22M16 19v15M24 19v15"/>',
        Contacts: '<circle cx="20" cy="8" r="6"/><circle cx="6" cy="11" r="5"/><circle cx="34" cy="11" r="5"/><path d="M1 22q5-9 11 0v13H1Zm27 0q6-9 11 0v13H28Z"/><path d="M11 23q9-12 18 0v17H11Z"/>',
        Tasks: '<rect x="3" y="3" width="34" height="34" rx="2"/><path fill="none" stroke="#104785" stroke-width="4" d="m10 19 7 7L30 11"/>',
        Reports: '<path d="M5 23h7v13H5Zm12-9h7v22h-7Zm12-9h7v31h-7Z"/><path stroke-width="2" d="M2 39h37"/>',
      };
      for (const [icon, label] of [['⌂', 'Home'], ['▤', 'Documents'], ['▦', 'Calendar'], ['♟', 'Contacts'], ['✓', 'Tasks'], ['▥', 'Reports']]) {
        const item = util.el('div', `workspace-dock-item${label === 'Documents' ? ' active' : ''}`, dock);
        const art = util.el('b', '', item);
        art.innerHTML = `<svg viewBox="0 0 40 42" width="40" height="42" fill="#b9daf7" stroke="#0a3869" stroke-width="1" aria-hidden="true">${dockArt[label]}</svg>`;
        util.el('span', '', item, label);
      }
      Object.assign(_c, { dock, dockArt, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-text-editor-findreplace-03',
    template: 'site/base',
    design: { parts },
  });
})();
