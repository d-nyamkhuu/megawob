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
        // Overlay decoration uses no episode draws and leaves the sampled controls intact.
        const textNode = box.querySelector('.ref-ov-text');
        if (kind === 'cookie') {
          const icon = util.el('span', 'planner-cookie-icon', el);
          icon.innerHTML =
            '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="#ffc442"/><path d="M5 10a19 19 0 0 0 28 25A19 19 0 0 1 5 10" fill="#efa92c"/><g fill="#91520f"><circle cx="12" cy="12" r="3"/><circle cx="26" cy="10" r="2.5"/><circle cx="21" cy="21" r="3"/><circle cx="10" cy="26" r="2.5"/><circle cx="29" cy="29" r="3"/><circle cx="20" cy="33" r="2"/></g></svg>';
          el.prepend(icon);
          const heading = util.el('strong', 'planner-cookie-title', textNode, 'We use cookies');
          textNode.prepend(heading);
        } else if (kind === 'chat') {
          const chatHeader = util.el('div', 'planner-chat-header', el);
          util.el('strong', '', chatHeader, 'Need help?');
          chatHeader.append(row);
          el.prepend(chatHeader);
          const conversation = util.el('div', 'planner-chat-body', el);
          const avatar = util.el('span', 'planner-chat-avatar', conversation);
          avatar.innerHTML =
            '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#398fe2"/><circle cx="20" cy="14" r="8" fill="#bddfff"/><path d="M5 36a15 15 0 0 1 30 0" fill="#bddfff"/></svg>';
          conversation.append(textNode);
          const input = util.el('div', 'planner-chat-compose', el);
          util.el('span', '', input, 'Type a message…');
          const send = util.el('button', '', input, '➤');
          send.type = 'button';
          send.setAttribute('aria-label', 'Send message');
          send.addEventListener('click', () => env.log('overlay-click', { label: 'Send message' }));
        } else if (kind === 'promo') {
          const art = util.el('div', 'planner-newsletter-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 120 90" aria-hidden="true"><path fill="#ffc42e" d="M23 35 60 6l37 29v47H23z"/><path fill="#173660" d="M32 21h56v43H32z"/><path fill="#fff" d="M37 26h46v40H37z"/><path stroke="#cbd8e5" stroke-width="4" d="M44 36h32M44 45h32M44 54h21"/><path fill="#ffda39" d="m23 35 37 28 37-28v47H23z"/><path fill="#f2b41c" d="m23 82 37-29 37 29z"/><path stroke="#368cdd" stroke-width="5" d="m12 16 6 6m84 37 8 3M60 0v6"/><path stroke="#ffcf3d" stroke-width="5" d="m105 12-7 7M8 42l8-3"/></svg>';
          box.prepend(art);
          const heading = util.el('h2', 'planner-newsletter-title', box, 'Stay in the loop');
          art.after(heading);
          const email = util.el('input', 'planner-newsletter-email', box);
          email.type = 'text';
          email.placeholder = 'Enter your email address';
          email.setAttribute('aria-label', 'Email address');
          box.insertBefore(email, row);
          dismiss.classList.add('planner-overlay-close');
          dismiss.setAttribute('aria-label', dismiss.textContent);
          dismiss.textContent = '×';
        } else if (kind === 'banner') {
          const icon = util.el('span', 'planner-announcement-icon', el, '⚑');
          el.prepend(icon);
          const body = document.querySelector('.ref-body');
          document.body.insertBefore(el, body);
          const fit = () => document.querySelector('.planner-workspace')?.dispatchEvent(new Event('planner-layout'));
          fit();
          dismiss.addEventListener('click', fit);
        }
        const endControl = document.querySelector('[data-role="submit"]');
        if (endControl && (kind === 'cookie' || kind === 'chat')) {
          const endRect = endControl.getBoundingClientRect();
          if (endRect.top > window.innerHeight / 2) el.style.bottom = `${window.innerHeight - endRect.top + 12}px`;
        }
        if (kind === 'promo') {
          const header = document.querySelector('.ref-task');
          el.style.top = `${header.getBoundingClientRect().bottom}px`;
          if (endControl) {
            const endRect = endControl.getBoundingClientRect();
            if (endRect.top > window.innerHeight / 2) el.style.bottom = `${window.innerHeight - endRect.top + 12}px`;
          }
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const project = util.el('div', 'planner-project', header);
        const people = util.el('span', 'planner-people', project);
        people.innerHTML =
          '<svg viewBox="0 0 32 24" aria-hidden="true"><circle cx="16" cy="6" r="4"/><circle cx="6" cy="8" r="3"/><circle cx="26" cy="8" r="3"/><path d="M9 23v-6a7 7 0 0 1 14 0v6zM0 22v-5a6 6 0 0 1 8-5v10zM24 22V12a6 6 0 0 1 8 5v5z"/></svg>';
        util.el('span', '', project, 'Website Relaunch');
        util.el('span', 'planner-project-arrow', project, '▾');
        const ribbon = util.el('div', 'planner-ribbon', header);
        const tabs = util.el('div', 'planner-tabs', ribbon);
        for (const [label, active] of [
          ['Overview', false],
          ['Timeline', true],
          ['Tasks', false],
          ['Team', false],
          ['Reports', false],
        ]) {
          const tab = util.el('span', active ? 'planner-tab is-active' : 'planner-tab', tabs, label);
        }
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
            util.el('span', 'planner-command-icon', button, icon);
            util.el('span', 'planner-command-label', button, label);
          }
        }
        S.frameBrand(_c, header);
        Object.assign(_c, { groups, header, people, project, ribbon, ribbonTools, tabs });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const summary = util.el('aside', 'planner-summary', body);
        const status = util.el('section', 'planner-card planner-status', summary);
        util.el('h2', 'planner-card-title', status, 'Status Summary');
        const statusRows = util.el('div', 'planner-status-rows', status);
        for (const [label, count, color] of [
          ['Not Started', '4', 'blue'],
          ['In Progress', '1', 'green'],
          ['Completed', '0', 'yellow'],
          ['Blocked', '0', 'red'],
        ]) {
          const row = util.el('div', 'planner-status-row', statusRows);
          util.el('i', `planner-swatch ${color}`, row);
          util.el('span', 'planner-status-label', row, label);
          util.el('span', 'planner-count', row, count);
        }
        const total = util.el('div', 'planner-total', status);
        util.el('strong', '', total, 'Total Items');
        util.el('strong', '', total, '6');
        const milestone = util.el('section', 'planner-card planner-milestones', summary);
        util.el('h2', 'planner-card-title', milestone, 'Upcoming Milestones');
        const milestoneHead = util.el('div', 'planner-table-head', milestone);
        util.el('span', '', milestoneHead, 'Date');
        util.el('span', '', milestoneHead, 'Milestone');
        const milestoneRow = util.el('div', 'planner-table-row', milestone);
        util.el('span', '', milestoneRow, 'Jul 19, 2002');
        const milestoneLabel = util.el('span', 'planner-diamond-label', milestoneRow);
        util.el('i', 'planner-milestone-diamond', milestoneLabel);
        util.el('span', '', milestoneLabel, 'Go live');
        const teams = util.el('section', 'planner-card planner-teams', summary);
        util.el('h2', 'planner-card-title', teams, 'Teams');
        const teamHead = util.el('div', 'planner-team-row planner-table-head', teams);
        util.el('span', '', teamHead, 'Team');
        util.el('span', '', teamHead, 'Tasks');
        for (const [team, count] of [
          ['Marketing', '2'],
          ['Design', '1'],
          ['Engineering', '1'],
          ['QA', '1'],
          ['Operations', '1'],
        ]) {
          const row = util.el('div', 'planner-team-row', teams);
          util.el('span', '', row, team);
          util.el('span', '', row, count);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, {
          body,
          milestone,
          milestoneHead,
          milestoneLabel,
          milestoneRow,
          status,
          statusRows,
          summary,
          teamHead,
          teams,
          total,
        });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, rng, summary, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
          summary.prepend(panel);
        }
      },
    'frame.footer': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, lr, placement, rng, teams, util, wantFooter, word } = _c;
        let { submit } = _c;
        if (wantFooter) {
          const foot = util.el('footer', 'ref-foot', teams);
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
        }
        Object.assign(_c, { submit });
      },
  };

  env.site({
    name: 'design-use-project-board-gantt-move-04',
    template: 'site/base',
    design: { parts },
  });
})();
