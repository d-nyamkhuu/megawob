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
        if (kind === 'banner') {
          const note = document.querySelector('.ref-instruction');
          el.style.top = `${Math.max(166, note ? note.getBoundingClientRect().bottom + 10 : 166)}px`;
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
        header.dataset.display = display;
        if (display !== 'header' || nav) {
          rng.pick(TITLES); // preserve the seeded frame draw used by sibling episodes
          const title = 'TeamTalk';
          const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
          brand.dataset.role = 'brand';
        }
        Object.assign(_c, { header });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        const project = util.el('section', 'ref-project');
        const identity = util.el('div', 'ref-project-identity', project);
        util.el('span', 'ref-project-icon', identity, '▤');
        const details = util.el('div', 'ref-project-copy', identity);
        util.el('div', 'ref-project-title', details, 'Project Orion');
        util.el('div', 'ref-project-meta', details, 'Engineering   ·   8 members   ·   Team channel');
        util.el('div', 'ref-project-description', details, 'Design, development and launch of Project Orion.');
        const shortcuts = util.el('div', 'ref-project-shortcuts', project);
        for (const [icon, label, count] of [
          ['▤', 'Files', '12'],
          ['☑', 'Tasks', '7'],
          ['♟', 'People', '8'],
          ['⚙', 'Settings', ''],
        ]) {
          const item = util.el('div', 'ref-project-shortcut', shortcuts);
          util.el('span', 'ref-project-shortcut-icon', item, icon);
          util.el('span', 'ref-project-shortcut-label', item, label);
          if (count) util.el('span', 'ref-project-shortcut-count', item, count);
        }
        Object.assign(_c, { details, headerTools, identity, project, shortcuts, submit });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, rng, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
        // Meeting design frame: the rail and status panel sit outside the live task stage.
        const rail = util.el('aside', 'meeting-rail', document.body);
        util.el('div', 'meeting-mark', rail, 'A');
        const railArt = {
          Chat: '<path d="M4 3h20a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H13l-8 6v-6H4a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z"/>',
          Meetings: '<rect x="1" y="6" width="20" height="20" rx="3"/><path d="m23 11 8-5v20l-8-5z"/>',
          People:
            '<circle cx="12" cy="9" r="6"/><circle cx="24" cy="11" r="5"/><path d="M0 30v-5c0-10 23-10 23 0v5zm24-12c6 0 8 4 8 8v4h-6v-5c0-3-1-5-2-7"/>',
          Files:
            '<path d="M6 1h15l8 8v22H6z"/><path d="M20 2v9h8M11 15h12M11 20h12M11 25h9" fill="none" stroke="#20272d" stroke-width="2"/>',
          More: '<circle cx="5" cy="16" r="3"/><circle cx="16" cy="16" r="3"/><circle cx="27" cy="16" r="3"/>',
        };
        for (const [glyph, text] of [
          ['▰', 'Chat'],
          ['▣', 'Meetings'],
          ['♟', 'People'],
          ['▤', 'Files'],
          ['•••', 'More'],
        ]) {
          const item = util.el('div', `meeting-rail-item${text === 'Meetings' ? ' active' : ''}`, rail);
          const icon = util.el('span', 'meeting-rail-icon', item);
          icon.innerHTML = `<svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor" aria-hidden="true">${railArt[text]}</svg>`;
          if (text === 'Chat') util.el('span', 'meeting-unread', icon, '2');
          util.el('span', 'meeting-rail-label', item, text);
        }
        Object.assign(_c, { rail, railArt });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, ctx, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        const heading = util.el('section', 'meeting-heading', body);
        util.el('div', 'meeting-kicker', heading, 'TEAM MEETING');
        util.el('div', 'meeting-title', heading, 'Product Design');
        util.el('div', 'meeting-date', heading, 'Mon, Apr 25, 2016　10:00 – 11:00 AM');
        const summary = util.el('aside', 'meeting-summary', body);
        const stats = util.el('div', 'meeting-stats', summary);
        for (const [title, value, caption] of [
          ['Participants', '4', 'In meeting'],
          ['Chat', '12', 'Messages'],
          ['Files', '3', 'Shared'],
        ]) {
          const cell = util.el('div', 'meeting-stat', stats);
          util.el('div', 'meeting-stat-label', cell, title);
          util.el('div', 'meeting-stat-number', cell, value);
          util.el('div', 'meeting-stat-caption', cell, caption);
        }
        const instructionPanel = body.querySelector('.ref-panel');
        if (instructionPanel) stats.after(instructionPanel);
        const tabs = util.el('div', 'meeting-tabs', summary);
        for (const [text, active] of [
          ['Chat', true],
          ['People (4)', false],
          ['Breakout Rooms', false],
        ]) {
          const tab = util.el('div', `meeting-tab${active ? ' active' : ''}`, tabs, text);
        }
        const discussion = util.el('div', 'meeting-discussion', summary);
        const notes = [
          [
            '👩🏻',
            'Sara Lopez',
            '10:02 AM',
            'Great to see everyone. Here are the notes from last week.',
            'Design-notes.docx',
            '142 KB',
          ],
          ['👨🏻', 'Matt Coleman', '10:04 AM', 'Thanks! Looking forward to today’s discussion.'],
          ['👨🏿', 'Daniel Kim', '10:06 AM', 'I’ve added a few ideas in the doc.'],
          [
            '👩🏻',
            'Jin Park',
            '10:08 AM',
            'Here’s the latest research deck for reference.',
            'Research-deck.pptx',
            '4.8 MB',
          ],
        ];
        for (const [initials, name, time, message, file, size] of notes) {
          const row = util.el('div', 'meeting-message', discussion);
          util.el('span', 'meeting-avatar', row, initials);
          const copy = util.el('div', 'meeting-message-copy', row);
          const byline = util.el('div', 'meeting-byline', copy);
          util.el('strong', '', byline, name);
          util.el('span', '', byline, time);
          util.el('div', 'meeting-message-text', copy, message);
          if (file) {
            const attachment = util.el('div', 'meeting-attachment', copy);
            util.el('span', 'meeting-file-icon', attachment, file.endsWith('pptx') ? 'P' : '▤');
            const fileCopy = util.el('span', '', attachment);
            util.el('strong', '', fileCopy, file);
            util.el('small', '', fileCopy, size);
          }
        }
        const compose = util.el('div', 'meeting-compose', summary);
        util.el('span', '', compose, 'Type a message…');
        const composeTools = util.el('span', 'meeting-compose-icons', compose);
        composeTools.innerHTML =
          '<svg viewBox="0 0 112 32" width="132" height="32" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="16" cy="16" r="12"/><path d="M10 19q6 8 12 0"/><circle cx="12" cy="12" r=".7"/><circle cx="20" cy="12" r=".7"/><path d="m51 20 11-12c6-5 13 2 8 7L56 29c-8 6-16-3-9-10l13-13m-8 16 11-12"/></g><path fill="currentColor" d="m91 4 21 12-21 12 5-10 12-2-12-2z"/></svg>';
        S.frameAlign(_c, stage);
        Object.assign(_c, {
          compose,
          composeTools,
          discussion,
          heading,
          instructionPanel,
          notes,
          stage,
          stats,
          summary,
          tabs,
        });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { H, body, endBtn, header, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        const headerNote = header.querySelector('.ref-instruction');
        const stageTop = headerNote ? Math.max(166, headerNote.getBoundingClientRect().bottom + 14) : 166;
        body.style.setProperty('--meeting-stage-top', `${stageTop}px`);
        const toastNote = document.querySelector('.ref-note');
        if (toastNote)
          body.style.setProperty('--meeting-stage-bottom', `${H - toastNote.getBoundingClientRect().top + 14}px`);
        document.body.classList.toggle(
          'meeting-has-footer',
          !!document.querySelector('.ref-foot .ref-tools > *, .ref-float-dock button'),
        );
        Object.assign(_c, { headerNote, stageTop, submit, toastNote });
      },
  };

  env.site({
    name: 'design-use-chat-meeting-04',
    template: 'site/base',
    design: { parts },
  });
})();
