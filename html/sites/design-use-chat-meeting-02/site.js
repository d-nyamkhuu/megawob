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
      if (kind === 'promo') util.el('h2', 'wg-promo-title', box, 'Stay in the Loop');
      if (kind === 'chat') util.el('div', 'wg-support-title', box, 'Need help?');
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      if (kind === 'promo') {
        const email = util.el('input', 'wg-promo-email', box);
        email.type = 'email';
        email.placeholder = 'Enter your email address';
        email.setAttribute('aria-label', 'Email address');
      }
      if (kind === 'chat') {
        const compose = util.el('div', 'wg-support-compose', box);
        const field = util.el('input', '', compose);
        field.placeholder = 'Type a message...';
        field.setAttribute('aria-label', 'Support message');
        const send = util.el('button', '', compose, '➤');
        send.type = 'button';
        send.setAttribute('aria-label', 'Send support message');
        send.addEventListener('click', () => { env.log('decoy', { what: 'support-message' }); field.value = ''; });
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
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.dataset.display = display;
      document.body.dataset.instructionDisplay = display;
      if (display !== 'header' || nav) rng.pick(TITLES); // preserve the seeded frame draw used by sibling episodes
      const title = 'WorkGroup Central';
      const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
      brand.dataset.role = 'brand';
      const tabs = util.el('nav', 'wg-tabs', header);
      for (const item of ['Home', 'Channels', 'Meetings', 'Documents', 'Projects', 'People']) {
        const tab = util.el('button', item === 'Meetings' ? 'wg-tab active' : 'wg-tab', tabs, item);
        tab.type = 'button';
        tab.addEventListener('click', () => env.log('decoy', { what: 'tab', label: item }));
      }
      const utility = util.el('nav', 'ref-top-links', header);
      for (const item of ['My Profile', 'Directory', 'Help', 'Log Out']) {
        const link = util.el('a', '', utility, item);
        link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'utility', label: item }); });
      }
      util.el('div', 'ref-date', header, 'Thu, Apr 22, 1999');
      Object.assign(_c, { brand, header, tabs, title, utility });
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
      const project = util.el('section', 'ref-project', document.body);
      const identity = util.el('div', 'ref-project-identity', project);
      util.el('span', 'ref-project-icon', identity, '▤');
      const details = util.el('div', 'ref-project-copy', identity);
      util.el('div', 'ref-project-title', details, 'Project Orion');
      util.el('div', 'ref-project-meta', details, 'Engineering   ·   8 members   ·   Team channel');
      util.el('div', 'ref-project-description', details, 'Design, development and launch of Project Orion.');
      const shortcuts = util.el('div', 'ref-project-shortcuts', project);
      for (const [icon, label, count] of [['▤', 'Files', '12'], ['☑', 'Tasks', '7'], ['♟', 'People', '8'], ['⚙', 'Settings', '']]) {
        const item = util.el('div', 'ref-project-shortcut', shortcuts);
        util.el('span', 'ref-project-shortcut-icon', item, icon);
        util.el('span', 'ref-project-shortcut-label', item, label);
        if (count) util.el('span', 'ref-project-shortcut-count', item, count);
      }
      Object.assign(_c, { details, headerTools, identity, project, shortcuts, submit });
    },
    'frame.toast': (base, S) => function (_c) {
      const { closeLabel, ctx, display, header, util } = _c;
      const tips = util.el('section', 'meeting-tips', document.body);
      util.el('span', 'meeting-tips-mark', tips, '?');
      const tipsCopy = util.el('div', 'meeting-tips-copy', tips);
      util.el('b', '', tipsCopy, 'Meeting Tips');
      const tipList = util.el('ul', '', tipsCopy);
      const controlTip = util.el('li', '', tipList, 'Use the controls on the right to mute or unmute your microphone, start or stop your camera, share your screen, or ');
      util.el('b', '', controlTip, 'raise your hand.');
      util.el('li', '', tipList, 'Share a document or application to show it to everyone in the meeting.');
      const roomTip = util.el('li', '', tipList, 'The host can create breakout rooms and assign participants to ');
      util.el('b', '', roomTip, 'smaller discussions.');
      if (display === 'toast') {
        const note = util.el('div', 'ref-note', document.body);
        util.el('div', 'ref-note-text', note, ctx.instruction);
        const x = util.el('button', 'ref-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', closeLabel);
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
        const noteHeight = note.getBoundingClientRect().height;
        if (noteHeight > 66) {
          header.style.height = (112 + noteHeight - 66) + 'px';
          header.style.minHeight = header.style.height;
        }
      }
      Object.assign(_c, { controlTip, roomTip, tipList, tips, tipsCopy });
    },
  };

  env.site({
    name: 'design-use-chat-meeting-02',
    template: 'site/base',
    design: { parts },
  });
})();
