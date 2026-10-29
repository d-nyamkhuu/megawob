// Luna meeting parts retain the workspace's controls, state updates and oracle targets.
env.widget({
  task: 'use-chat',
  site: 'design-use-chat-meeting-03',
  name: 'design',
  split: 'train',
  scenarios: ['meeting'],
  template: 'use-chat/workspace',
  design: {
    font: 'Tahoma, Arial, sans-serif', fontSize: '16px', inset: '0px', radius: '5px', callSideAt: 0,
    panel: '#fffef8', bg: '#f5f4e8', fg: '#17182c', line: '#a3b6d2', accent: '#075bd4',
    parts: {
      topbar: () => () => {},
      rail: () => () => {},
      icon: (base, S) => (parent, kind, size = 24) => {
        const svg = base(parent, kind, size);
        const art = {
          home: '<path d="M3 10L12 2l9 8v12H4z" fill="#a6ceef"/><path d="M2 11L12 2l10 9-2 2-8-8-8 8z" fill="#4e91e4"/><path d="M9 14h6v8H9z" fill="#f3cf72"/>',
          threads: '<path d="M4 3h16q2 0 2 2v12q0 2-2 2H10l-5 4v-4H4q-2 0-2-2V5q0-2 2-2z" fill="url(#luna-threads)"/>',
          camera: '<rect x="2" y="6" width="14" height="13" rx="2" fill="#516582"/><path d="M16 10l7-4v14l-7-4z" fill="#334b73"/>',
          share: '<rect x="2" y="2" width="20" height="15" rx="1" fill="#d9eaff" stroke-width="2"/><path d="M4 4h16v10H4z" fill="#8db7e5" stroke="white"/><path d="M10 17v4H6v1h12v-1h-4v-4z" fill="#46658c"/>',
          mute: '<rect x="9" y="2" width="6" height="13" rx="3" fill="#52698c"/><path d="M6 10v2a6 6 0 0012 0v-2M12 18v4m-4 0h8" fill="none" stroke-width="1.8"/>',
          hand: '<path d="M8 20L3 12q-1-3 1-3l3 3V4q1-3 3-1v7-8q2-2 3 0v8-7q2-2 3 0v8-5q2-2 3 0v10q-1 6-5 7h-3z" fill="#dbe3ed"/>',
          grid: '<rect x="2" y="2" width="8" height="8" rx="1" fill="#8fc5ff"/><rect x="14" y="2" width="8" height="8" rx="1" fill="#4c94ef"/><rect x="2" y="14" width="8" height="8" rx="1" fill="#4c94ef"/><rect x="14" y="14" width="8" height="8" rx="1" fill="#8fc5ff"/>',
        };
        if (art[kind]) svg.innerHTML = '<defs><linearGradient id="luna-' + kind + '" x2="0" y2="1"><stop stop-color="#e9f6ff"/><stop offset="1" stop-color="#65adff"/></linearGradient></defs><g stroke="#33598a" stroke-width="1.2" stroke-linejoin="round">' + art[kind] + '</g>';
        return svg;
      },
      navigation: (base, S) => parent => {
        const U = S.ctx.util, P = S.P;
        const nav = U.el('aside', 'xp-records', parent);
        const title = U.el('div', 'xp-record-title', nav); P.icon(title, 'home', 25);
        U.el('span', '', title, 'Project Alpha'); P.icon(title, 'chevron', 18);
        const channels = U.el('div', 'xp-channels', nav);
        const active = U.el('div', 'xp-record active', channels); P.icon(active, 'threads', 23);
        const text = U.el('span', '', active);
        for (const label of ['General', 'Design', 'Development', 'Marketing', 'QA']) {
          const row = U.el('div', 'xp-record', channels); P.icon(row, 'threads', 23); U.el('span', '', row, label);
        }
        const dm = U.el('section', 'xp-record-group', nav); U.el('h3', '', dm, 'Direct Messages');
        S.spec.people.slice(0, 4).forEach((p, i) => { const row = U.el('div', 'xp-record', dm); U.el('i', 'xp-dot dot-' + i, row); U.el('span', '', row, p.full); });
        const panel = document.querySelector('.ref-panel'); if (panel) nav.append(panel);
        const files = U.el('section', 'xp-record-group xp-files', nav); U.el('h3', '', files, 'Recent Files');
        [...S.spec.sources, 'Design-mockup.png', 'QA-plan.doc'].forEach((name, i) => {
          const row = U.el('div', 'xp-record' + (i === 0 ? ' selected' : ''), files);
          U.el('span', 'xp-filetype type-' + i, row, ['W', 'P', 'X', '▧', 'W'][i % 5]); U.el('span', '', row, name);
        });
        return { el: active, text };
      },
      meetingHeader: (base, S) => {
        let note, frame;
        return m => {
          base(m);
          const head = S.main.querySelector('.ch-head');
          head.querySelector('h2').textContent = 'Project Alpha  –  Team Meeting';
          if (frame !== S.app) {
            frame = S.app;
            note = document.querySelector('.ref-instruction');
          }
          if (note) { head.classList.add('xp-with-note'); head.append(note); }
        };
      },
      meetingMeta: () => () => {},
      tile: (base, S) => (tiles, p, i, m) => {
        base(tiles, p, i, m);
        const tile = tiles.lastElementChild;
        tile.classList.add('xp-photo');
        tile.style.setProperty('--portrait-x', i % 2 ? '90.625%' : '9.375%');
        tile.style.setProperty('--portrait-y', i % 4 > 1 ? '86%' : '5%');
        if (i === 0 && !m.camera) tile.classList.add('xp-camera-off');
      },
      avatar: (base, S) => (parent, p, cls = '') => {
        const el = base(parent, p, cls);
        const index = p.full === 'You' ? 0 : S.spec.people.findIndex(x => x.full === p.full) + 1;
        el.classList.add('xp-avatar');
        el.style.setProperty('--portrait-x', Math.max(0, index) % 2 ? '83.333%' : '16.667%');
        el.style.setProperty('--portrait-y', Math.max(0, index) % 4 > 1 ? '77%' : '10%');
        return el;
      },
      callSide: (base, S) => (parent, m) => {
        base(parent, m);
        const side = parent.lastElementChild;
        side.querySelector('.ch-callsidehead').textContent = 'Participants (' + (S.spec.people.length + 1) + ')';
        side.querySelectorAll('.ch-person').forEach(row => S.P.icon(row, 'camera', 22));
      },
      meetingControls: (base, S) => (meeting, m) => {
        base(meeting, m);
        const controls = meeting.querySelector('.ch-controls');
        [...controls.children].forEach((b, i) => { if ([4, 5, 7, 8].includes(i)) b.classList.add('xp-extra-control'); });
        const rooms = [...controls.children].find(b => b.textContent === 'Rooms');
        if (rooms) rooms.querySelector('span').textContent = 'Breakout Rooms';
        const manage = S.main.querySelector('[data-chat-control="settings"]');
        if (manage) { manage.replaceChildren(); S.P.icon(manage, 'people', 26); S.ctx.util.el('span', '', manage, 'Participants'); controls.append(manage); }
      },
      drawMeeting: (base, S) => {
        let endFooter, endDock, frame;
        return m => {
        if (frame !== S.app) {
          frame = S.app;
          endFooter = document.querySelector('.ref-foot');
          endDock = document.querySelector('.ref-float-dock');
        }
        base(m);
        const U = S.ctx.util, P = S.P, meeting = S.main.querySelector('.ch-meeting');
        const lower = U.el('div', 'xp-lower', meeting);
        const chat = U.el('section', 'xp-chat', lower);
        const tabs = U.el('div', 'xp-chat-tabs', chat);
        P.button(tabs, 'Chat', null, null, 'xp-tab active'); P.button(tabs, 'Meeting Notes', null, null, 'xp-tab');
        const messages = P.pane(U.el('div', 'xp-chat-messages ch-scroll', chat), 'meetingchat');
        (S.spec.history || []).slice(0, 4).forEach((msg, i) => {
          const row = U.el('div', 'xp-message', messages); const p = S.spec.people[msg.author]; P.avatar(row, p);
          const body = U.el('div', 'xp-message-body', row), meta = U.el('div', 'xp-message-meta', body);
          U.el('b', '', meta, p.full); U.el('time', '', meta, msg.time); U.el('div', 'xp-message-text', body, msg.text);
        });
        const compose = U.el('div', 'xp-meeting-compose', chat);
        const draft = U.el('input', '', compose); draft.placeholder = 'Type a message...'; draft.setAttribute('aria-label', 'Meeting chat message');
        P.button(compose, 'Send', null, null);
        const side = meeting.querySelector('.ch-callside');
        if (side) {
          lower.append(side);
          if (endFooter) side.append(endFooter);
          if (endDock) side.append(endDock);
        }
        const controls = meeting.querySelector('.ch-controls');
        const participants = controls.querySelector('[data-chat-control="settings"]');
        const rooms = [...controls.children].find(b => b.textContent === 'Breakout Rooms');
        if (participants && rooms) controls.insertBefore(participants, rooms);
        };
      },
    },
  },
});
