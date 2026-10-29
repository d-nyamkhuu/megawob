// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const RIBBON_ICONS = {
    'New Task':
      '<path d="M11 5h18l7 7v29H11z" fill="#fff" stroke="#437cad" stroke-width="1.5"/><path d="M29 5v8h7" fill="#dae9fa" stroke="#437cad"/><path d="M10 2l2 5 5-1-2 5 3 3-5 1-2 5-3-5-5-1 3-4-1-5 4 2z" fill="#ffd541" stroke="#eaa225"/>',
    'New Milestone':
      '<path d="M22 5L38 22 22 39 6 22z" fill="#ffbd16" stroke="#dc8c00" stroke-width="1.5"/><path d="M22 8L35 22 22 35 9 22z" fill="#ffce37"/>',
    'Delete':
      '<path d="M10 7l12 12L34 7l5 5-12 12 12 12-5 5-12-12-12 12-5-5 12-12L5 12z" fill="#ed5859" stroke="#bb3539"/>',
    'Indent':
      '<path d="M18 7h23v6H18zm0 11h23v6H18zm0 11h23v6H18z" fill="#92999b" stroke="#e5ecef"/><path d="M16 18L5 25l11 7v-4h13v-6H16z" fill="#79b766" stroke="#57984c"/>',
    'Outdent':
      '<path d="M18 7h23v6H18zm0 11h23v6H18zm0 11h23v6H18z" fill="#afb9bd" stroke="#eaf0f4"/><path d="M16 18L5 25l11 7v-4h13v-6H16z" fill="#79b766" stroke="#57984c"/>',
    'Link Tasks':
      '<g fill="none" stroke="#087be9" stroke-width="5"><rect x="17" y="3" width="13" height="25" rx="6" transform="rotate(40 23 16)"/><rect x="10" y="16" width="13" height="25" rx="6" transform="rotate(40 16 29)"/></g><path d="M16 29l12-14" fill="none" stroke="#9cd6ff" stroke-width="2"/>',
    'Unlink Tasks':
      '<rect x="4" y="19" width="35" height="12" rx="5" fill="#d4e2ec" stroke="#8fa8bb" stroke-width="2"/><path d="M11 24h20" stroke="#a4bacc" stroke-width="3"/><path d="M32 8L12 39" stroke="#e36864" stroke-width="4"/>',
    'Move Earlier':
      '<path d="M19 7L3 23l16 15v-10h23V17H19z" fill="#289cff" stroke="#006cdb" stroke-width="1.5"/><path d="M18 10L6 23l12 11" fill="none" stroke="#a2d6ff"/>',
    'Move Later':
      '<path d="M26 7l16 16-16 15V28H3V17h23z" fill="#289cff" stroke="#006cdb" stroke-width="1.5"/><path d="M27 10l12 13-12 11" fill="none" stroke="#a2d6ff"/>',
    'Zoom In':
      '<path d="M27 28l13 14" stroke="#686d70" stroke-width="7" stroke-linecap="round"/><circle cx="18" cy="17" r="12" fill="#f8fcff" stroke="#659dd1" stroke-width="3"/><path d="M11 17h14m-7-7v14" stroke="#2081da" stroke-width="4"/>',
    'Zoom Out':
      '<path d="M27 28l13 14" stroke="#686d70" stroke-width="7" stroke-linecap="round"/><circle cx="18" cy="17" r="12" fill="#f8fcff" stroke="#659dd1" stroke-width="3"/><path d="M11 17h14" stroke="#2081da" stroke-width="4"/>',
    'Fit Timeline':
      '<rect x="7" y="6" width="32" height="35" fill="#f9fcff" stroke="#38638b" stroke-width="2"/><path d="M6 11h34M13 16v20m20-20v20M16 18h13v6H16zm4 9h8v7h-8" fill="#bbdbf6" stroke="#3474b5" stroke-width="2"/>',
    'Today':
      '<rect x="5" y="5" width="35" height="37" fill="#fff" stroke="#0066c3" stroke-width="2"/><path d="M5 6h35v9H5z" fill="#087af3"/><path d="M10 3v9m24-9v9" stroke="#99c8f6" stroke-width="3"/><text x="22" y="35" text-anchor="middle" font-family="Arial" font-size="23" font-weight="bold" fill="#222">14</text>',
    'Show Critical Path':
      '<path d="M8 13v10h15v11h14" fill="none" stroke="#2e5b98" stroke-width="2"/><path d="M4 7h22v8H4zm11 15h24v8H15zm10 14h23v8H25z" fill="#e3615b" stroke="#075494" stroke-width="1.6"/><path d="M5 9h20m-9 15h22m-12 14h21" stroke="#ffdc82" stroke-width="2"/>',
  };

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        document.body.dataset.overlay = kind;
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
          b.addEventListener('click', () => {
            if (how) {
              ctx.dismiss(how);
              if (kind === 'banner') document.querySelector('.pj-app')?.dispatchEvent(new Event('planner-layout'));
            } else env.log('overlay-click', { label });
          });
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
          const mark = util.el('span', 'planner-cookie-icon', el);
          mark.innerHTML =
            '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="#edab46" stroke="#bc721b" stroke-width="2"/><g fill="#784319"><circle cx="13" cy="12" r="2"/><circle cx="25" cy="10" r="2"/><circle cx="29" cy="23" r="2.5"/><circle cx="18" cy="25" r="2"/><circle cx="11" cy="22" r="2"/><circle cx="23" cy="32" r="2"/><circle cx="21" cy="18" r="1.5"/></g></svg>';
          el.prepend(mark);
        }
        if (kind === 'chat') {
          const title = util.el('div', 'planner-chat-title', el, '●  Team Support');
          el.prepend(title);
          util.el('div', 'planner-chat-reply', el, 'I have a question about the release plan.');
          const message = util.el('div', 'planner-chat-message', el);
          const input = util.el('input', '', message);
          input.placeholder = 'Type a message...';
          input.setAttribute('aria-label', 'Message to support');
          const send = util.el('button', '', message, '➤');
          send.type = 'button';
          send.onclick = () => env.log('decoy', { label: 'Support message' });
        }
        if (kind === 'promo') {
          const title = util.el('strong', 'planner-promo-title', box, 'Get product updates');
          box.prepend(title);
          const email = util.el('input', 'planner-promo-email', box);
          email.placeholder = 'Your email address';
          email.setAttribute('aria-label', 'Email address');
          box.insertBefore(email, row);
        }
        if (kind === 'banner') {
          document.querySelector('.ref-task').after(el);
          document.querySelector('.pj-app')?.dispatchEvent(new Event('planner-layout'));
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        document.body.dataset.instruction = display;
        document.body.dataset.overlay = '';
        util.el('span', 'planner-app-icon', header, '▤');
        const windowButtons = util.el('div', 'planner-window-buttons', header);
        for (const glyph of ['–', '□', '×']) util.el('span', '', windowButtons, glyph);
        const ribbon = util.el('div', 'planner-ribbon', header);
        const ribbonTabs = util.el('div', 'planner-tabs', ribbon);
        for (const tab of ['Home', 'View', 'Project', 'Format'])
          util.el('span', tab === 'Home' ? 'active' : '', ribbonTabs, tab);
        const groups = [
          ['✚|New Task', '◆|New Milestone', '✕|Delete'],
          ['⇥|Indent', '⇤|Outdent'],
          ['↗|Link Tasks', '↙|Unlink Tasks'],
          ['⬅|Move Earlier', '➡|Move Later'],
          ['⊕|Zoom In', '⊖|Zoom Out', '▣|Fit Timeline'],
          ['▣|Today', '▤|Show Critical Path'],
        ];
        const ribbonTools = util.el('div', 'planner-ribbon-tools', ribbon);
        for (const group of groups) {
          const g = util.el('div', 'planner-ribbon-group', ribbonTools);
          for (const entry of group) {
            const [icon, label] = entry.split('|');
            const button = util.el('button', 'planner-command', g);
            button.type = 'button';
            const mark = util.el('span', 'planner-command-icon', button);
            mark.innerHTML = `<svg viewBox="0 0 48 48" aria-hidden="true">${RIBBON_ICONS[label] || icon}</svg>`;
            util.el('span', 'planner-command-label', button, label);
          }
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { groups, header, ribbon, ribbonTabs, ribbonTools, windowButtons });
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
        const headerNote = header.querySelector('.ref-instruction');
        if (headerNote)
          headerNote.style.paddingRight = `${Math.ceil(headerTools.getBoundingClientRect().width) + 32}px`;
        Object.assign(_c, { headerNote, headerTools, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const viewTabs = util.el('div', 'planner-view-tabs', body);
        for (const label of ['Timeline', 'Board', 'Resources', 'Reports']) {
          const tab = util.el('button', label === 'Timeline' ? 'active' : '', viewTabs, label);
          tab.type = 'button';
          tab.onclick = () => env.log('decoy', { what: 'view', label });
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, viewTabs });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const properties = util.el('section', 'planner-properties', body);
        util.el('strong', 'planner-properties-title', properties, 'Task Properties');
        const propertyRows = [
          [
            ['ID', ''],
            ['Name', ''],
            ['Start date', ''],
            ['Duration', ''],
            ['Finish date', ''],
          ],
          [
            ['Predecessors', ''],
            ['Resources', ''],
            ['Status', ''],
            ['% Complete', ''],
          ],
        ];
        for (const row of propertyRows) {
          const line = util.el('div', 'planner-property-row', properties);
          for (const [label, value] of row) {
            const field = util.el('label', 'planner-property', line);
            util.el('span', '', field, label + ':');
            const input = util.el('input', '', field);
            input.value = value;
            input.readOnly = true;
            input.setAttribute('aria-label', label);
            if (['Start date', 'Predecessors', 'Resources', 'Status', 'Duration', '% Complete'].includes(label)) {
              field.classList.add('planner-property-choice');
              util.el('b', '', field, ['Duration', '% Complete'].includes(label) ? '▴\n▾' : '▾');
            }
          }
        }
        Object.assign(_c, { properties, propertyRows, stage });
      },
  };

  env.site({
    name: 'design-use-project-board-gantt-move-01',
    template: 'site/base',
    design: { parts },
  });
})();
