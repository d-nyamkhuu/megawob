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
        const logo = util.el('span', 'planner-app-icon', header);
        logo.innerHTML = '<svg viewBox="0 0 28 32" aria-hidden="true"><path d="M5 29C11 23 14 16 18 6" fill="none" stroke="#bdd18d" stroke-width="1.5"/><path d="M14 17C11 7 19 4 25 3c0 8-4 13-11 14Z" fill="#9abf6b"/><path d="M10 24C1 24 2 15 8 12c5 5 6 8 2 12Z" fill="#aaca7d"/><path d="M12 25c1-7 8-9 13-8-1 7-6 11-13 8Z" fill="#8db260"/></svg>';
        const brand = util.el('div', 'planner-title', header);
        util.el('span', 'planner-title-name', brand, 'Aurora');
        util.el('span', 'planner-title-divider', brand, '|');
        util.el('span', 'planner-title-project', brand, 'Product Release Plan');
        const search = util.el('div', 'planner-search', header);
        search.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg><span>Search tasks...</span>';
        const bell = util.el('span', 'planner-bell', header);
        bell.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17h14l-2-4V8a5 5 0 0 0-4-5V2h-2v1a5 5 0 0 0-4 5v5zM9 20h6"/></svg>';
        util.el('span', 'planner-avatar', header, 'JS');
        const windowButtons = util.el('div', 'planner-window-buttons', header);
        for (const glyph of ['–', '□', '×']) util.el('span', '', windowButtons, glyph);
        const ribbon = util.el('div', 'planner-ribbon', header);
        const ribbonTabs = util.el('div', 'planner-tabs', ribbon);
        for (const tab of ['File', 'Edit', 'View', 'Project', 'Task', 'Team', 'Help'])
          util.el('span', '', ribbonTabs, tab);
        const LI = {
          'Add Task': '<path d="M12 5v14M5 12h14"/>',
          'Add Milestone': '<path d="M12 3l9 9-9 9-9-9z"/>',
          Indent: '<path d="M4 6h16M11 12h9M11 18h9M4 9l4 3-4 3"/>',
          Outdent: '<path d="M4 6h16M4 12h9M4 18h16M20 9l-4 3 4 3"/>',
          Link: '<path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1"/>',
          Delete: '<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 11v6M14 11v6"/>',
          Calendar: '<rect x="4" y="5" width="16" height="15" rx="1"/><path d="M4 10h16M8 3v4M16 3v4"/>',
        };
        const groups = [
          ['+|Add Task', '◇|Add Milestone'],
          ['⇥|Indent', '⇤|Outdent', '↗|Link', '✕|Delete'],
          ['zoom'],
          ['today'],
        ];
        const ribbonTools = util.el('div', 'planner-ribbon-tools', ribbon);
        for (const group of groups) {
          const g = util.el('div', 'planner-ribbon-group', ribbonTools);
          if (group[0] === 'zoom') {
            util.el('span', 'planner-zoom-label', g, 'Zoom');
            util.el('span', 'planner-zoom-btn', g, '−');
            const track = util.el('span', 'planner-zoom-track', g);
            util.el('i', '', track);
            util.el('span', 'planner-zoom-btn', g, '+');
            continue;
          }
          if (group[0] === 'today') {
            const t = util.el('button', 'planner-today', g, 'Today');
            t.type = 'button';
            const c = util.el('span', 'planner-command-icon', g);
            c.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${LI.Calendar}</svg>`;
            continue;
          }
          for (const entry of group) {
            const [icon, label] = entry.split('|');
            const button = util.el('button', 'planner-command', g);
            button.type = 'button';
            const mark = util.el('span', 'planner-command-icon', button);
            mark.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${LI[label] || ''}</svg>`;
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
        const headerTools = util.el('div', 'ref-tools', _c.ribbonTabs);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        const headerNote = header.querySelector('.ref-instruction');
        if (headerNote) {
          _c.ribbonTabs.after(headerNote);
          headerNote.style.paddingRight = '16px';
        }
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
        const chev = '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
        const section = (title, first) => {
          const sec = util.el('div', first ? 'pi-sec pi-first' : 'pi-sec', properties);
          const h = util.el('div', 'pi-head', sec);
          util.el('strong', 'planner-properties-title', h, title);
          util.el('span', 'pi-chev', h).innerHTML = chev;
          return sec;
        };
        const s1 = section('Project Details', true);
        const propertyRows = [['Name', 'Aurora'], ['Description', 'Next major release'], ['Start Date', 'Aug 1, 2023'], ['End Date', 'Aug 31, 2023'], ['Status', 'On track']];
        for (const [label, value] of propertyRows) {
          const line = util.el('div', 'pi-row', s1);
          util.el('span', 'pi-k', line, label);
          const v = util.el('span', 'pi-v', line);
          if (label === 'Status') util.el('i', 'pi-dot', v).style.background = '#2f8a4a';
          v.append(value);
        }
        const s2 = section('Teams');
        for (const [n, c, col] of [['Platform', 3, '#4a93d6'], ['Product', 3, '#2f8a4a'], ['Design', 2, '#ef8a3a'], ['Operations', 2, '#7a55c8']]) {
          const line = util.el('div', 'pi-row pi-team', s2);
          util.el('i', 'pi-dot', line).style.background = col;
          util.el('span', 'pi-n', line, n);
          util.el('span', 'pi-c', line, String(c));
        }
        const s3 = section('Milestones');
        for (const [n, d] of [['Feature Freeze', 'Aug 18, 2023'], ['Beta Release', 'Aug 25, 2023'], ['General Release', 'Aug 31, 2023']]) {
          const line = util.el('div', 'pi-row pi-team', s3);
          util.el('i', 'pi-dia', line);
          util.el('span', 'pi-n', line, n);
          util.el('span', 'pi-c', line, d);
        }
        const taskNote = body.querySelector('.ref-panel');
        if (taskNote) properties.insertBefore(taskNote, s2);
        Object.assign(_c, { properties, propertyRows, stage });
      },
  };

  env.site({
    name: 'design-use-project-board-gantt-move-05',
    template: 'site/base',
    design: { parts },
  });
})();
