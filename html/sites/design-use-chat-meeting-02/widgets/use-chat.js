// Design on templates/use-chat/workspace.js; defaults preserve the reference scaffold.
env.widget({
  task: 'use-chat',
  site: 'design-use-chat-meeting-02',
  name: 'design',
  split: 'train',
  scenarios: ['meeting'],
  template: 'use-chat/workspace',
  design: {
    inset: '0', radius: '0', font: 'Arial, sans-serif', fontSize: '18px',
    panel: '#f0f1f2', bg: '#e5e8e9', fg: '#171717', line: '#92999e', accent: '#173f72',
    parts: {
      // All task state and registered controls still go through the workspace parts.
      // Only the presentation of the meeting is replaced; this design draws no RNG.
      topbar: () => () => {},
      rail: () => () => {},
      navigation: () => () => ({ el: document.createElement('div'), text: document.createElement('span') }),
      icon: (base, S) => (parent, kind, size = 24) => {
        const art = {
          people: '<g fill="currentColor"><circle cx="9" cy="12" r="6"/><circle cx="24" cy="9" r="7"/><circle cx="39" cy="12" r="6"/><rect x="1" y="21" width="15" height="21" rx="4"/><rect x="16" y="19" width="16" height="27" rx="5"/><rect x="33" y="21" width="14" height="21" rx="4"/></g>',
          room: '<g fill="none" stroke="currentColor" stroke-width="4"><rect x="5" y="5" width="38" height="38" rx="2"/><path d="M14 7v10l-7 7 7 7v10m20-34v10l7 7-7 7v10M16 24h16"/></g><g fill="currentColor"><rect x="1" y="19" width="10" height="10" rx="2"/><rect x="37" y="19" width="10" height="10" rx="2"/></g>',
          mute: '<rect x="16" y="2" width="16" height="32" rx="8" fill="currentColor"/><path d="M11 23v4a13 13 0 0 0 26 0v-4M24 40v6m-8 0h16" fill="none" stroke="currentColor" stroke-width="3"/>',
          micOff: '<rect x="16" y="2" width="16" height="32" rx="8" fill="currentColor"/><path d="M11 23v4a13 13 0 0 0 26 0v-4M24 40v6m-8 0h16M5 4l38 40" fill="none" stroke="currentColor" stroke-width="3"/>',
          camera: '<rect x="2" y="12" width="27" height="25" rx="4" fill="currentColor"/><path d="M31 18l15-7v27l-15-7z" fill="currentColor"/>',
          share: '<rect x="2" y="4" width="44" height="35" rx="1" fill="currentColor"/><rect x="6" y="8" width="36" height="27" fill="#5b91cb"/><path d="M20 38h9l1 6h7v2H12v-2h7z" fill="currentColor"/>',
          hand: '<path d="M13 27V10a2 2 0 0 1 4 0v13V5a2 2 0 0 1 4 0v18V3a2 2 0 0 1 4 0v20V8a2 2 0 0 1 4 0v16V14a2 2 0 0 1 4 0v19c0 9-5 14-13 14-7 0-11-4-14-11L2 25c-1-4 3-5 5-2l6 8z" fill="currentColor" transform="translate(6 0)"/>',
        };
        if (!art[kind]) return base(parent, kind, size);
        const svg = S.ctx.util.svg('svg', { viewBox: '0 0 48 48', width: size, height: size, 'aria-hidden': 'true' }, parent);
        svg.innerHTML = art[kind];
        return svg;
      },
      drawMeeting: (base, S) => (m) => {
        const { ctx, spec: s, P, main } = S, U = ctx.util;
        const layout = U.el('div', 'wg-meeting-layout', main);
        const meeting = U.el('section', 'wg-meeting meeting-panel', layout);
        const head = U.el('div', 'meeting-gallery-head', meeting);
        const title = U.el('b', '', head);
        P.icon(title, 'people', 28);
        U.el('span', '', title, 'Product Team Meeting');
        U.el('span', 'wg-timer', head, '00:12:36');
        if (m.share !== null) {
          const bar = U.el('div', 'ch-sharing', meeting, `You are sharing: ${s.sources[m.share]}  `);
          P.button(bar, 'Stop sharing', 'stopShare', { stopShare: true });
        }
        const content = U.el('div', 'wg-meeting-content', meeting);
        const grid = P.pane(U.el('div', 'wg-portrait-grid', content), 'tiles');
        [{ full: 'You', role: 'Host' }, ...s.people].forEach((p, i) => P.tile(grid, p, i, m));
        P.meetingControls(content, m);

        const chat = U.el('section', 'meeting-panel meeting-chat', layout);
        const chatHead = U.el('div', 'meeting-panel-head', chat);
        const channel = U.el('b', 'wg-panel-title', chatHead);
        P.icon(channel, 'people', 28);
        U.el('span', '', channel, '# ' + m.name);
        P.button(chatHead, 'Channel Settings', 'settings', { settings: true }, 'meeting-panel-action').title = 'Manage members';
        const transcript = P.pane(U.el('div', 'meeting-transcript ch-scroll', chat), 'meetingchat');
        (s.history || []).forEach(msg => {
          const row = U.el('div', 'meeting-message', transcript);
          U.el('span', 'meeting-avatar', row);
          const copy = U.el('div', 'meeting-message-copy', row);
          const byline = U.el('div', 'meeting-byline', copy);
          U.el('b', '', byline, s.people[msg.author].full);
          U.el('time', '', byline, msg.time);
          U.el('div', 'meeting-message-text', copy, msg.text);
        });
        const composer = U.el('div', 'meeting-composer', chat);
        const format = U.el('div', 'meeting-format', composer);
        for (const [tag, label] of [['b', 'B'], ['i', 'I'], ['u', 'U']]) U.el(tag, '', format, label);
        P.icon(format, 'link', 22);
        const draft = U.el('textarea', 'meeting-compose-field', composer);
        draft.setAttribute('aria-label', 'Meeting chat message');
        const sendRow = U.el('div', 'meeting-send-row', composer);
        U.el('span', 'meeting-channel-select', sendRow, '# ' + m.name + '  ▾');
        const send = P.button(sendRow, 'Send', null, null, 'meeting-send');
        send.addEventListener('click', () => {
          if (!draft.value.trim()) return;
          const row = U.el('div', 'meeting-message', transcript);
          U.el('span', 'meeting-avatar', row);
          const copy = U.el('div', 'meeting-message-copy', row);
          U.el('b', 'wg-chat-author', copy, 'You');
          U.el('div', '', copy, draft.value.trim());
          draft.value = '';
          transcript.scrollTop = transcript.scrollHeight;
        });

        const roster = U.el('div', 'meeting-roster', layout);
        const taskCard = ctx.stage.parentElement.querySelector('.ref-panel');
        if (taskCard) roster.style.paddingTop = (taskCard.getBoundingClientRect().height + 10) + 'px';
        const people = U.el('section', 'meeting-panel meeting-people', roster);
        const peopleHead = U.el('div', 'meeting-panel-head', people);
        const peopleTitle = U.el('b', 'wg-panel-title', peopleHead);
        P.icon(peopleTitle, 'people', 28);
        U.el('span', '', peopleTitle, `Participants (${s.people.length + 1})`);
        const peopleTable = P.pane(U.el('div', 'meeting-table', people), 'callside');
        const row = (parent, a, b, heading = false) => {
          const r = U.el('div', 'meeting-table-row' + (heading ? ' meeting-table-labels' : ''), parent);
          U.el('span', 'meeting-cell', r, a);
          const cell = U.el('span', 'meeting-cell', r, b);
          return cell;
        };
        row(peopleTable, 'Name', 'Status', true);
        [{ full: 'You', role: 'Host' }, ...s.people].forEach((p, i) => {
          const cell = row(peopleTable, p.full + (i === 0 ? ' (Host)' : ''), '');
          cell.classList.add('meeting-status-cell');
          U.el('span', 'meeting-status-dot', cell);
          U.el('span', '', cell, i === 0 && m.hand ? 'Hand raised' : 'In Meeting');
        });
        const rooms = U.el('section', 'meeting-panel meeting-rooms', roster);
        const roomsHead = U.el('div', 'meeting-panel-head', rooms);
        const roomTitle = U.el('b', 'wg-panel-title', roomsHead);
        P.icon(roomTitle, 'room', 28);
        U.el('span', '', roomTitle, 'Breakout Rooms');
        P.button(roomsHead, 'Manage Rooms', null, null, 'meeting-panel-action');
        const table = U.el('div', 'meeting-table', rooms);
        row(table, 'Room', 'Participants', true);
        row(table, 'Main Meeting', String(1 + m.rooms.filter(x => x === -1).length));
        s.roomNames.forEach((name, i) => row(table, name, String(m.rooms.filter(x => x === i).length)));
        if (m.sharePicker) P.sharePicker(m);
      },
      tile: (base, S) => (parent, p, i, m) => {
        // The remaining attendees are in the roster; four active video feeds fill the gallery.
        if (i > 3) return;
        const tile = S.ctx.util.el('div', 'wg-portrait meeting-person-' + (i + 1) + (i === 0 && m.hand ? ' hand' : ''), parent);
        const caption = S.ctx.util.el('div', 'wg-caption', tile);
        S.ctx.util.el('span', '', caption, p.full + (i === 0 ? ' (Host)' : ''));
        if (i === 0 && m.hand) S.P.icon(caption, 'hand', 20);
        if (i === 0 && m.muted) S.P.icon(caption, 'micOff', 20);
      },
      meetingControls: (base, S) => (parent, m) => {
        const { P, ctx } = S;
        const controls = ctx.util.el('div', 'wg-controls', parent);
        for (const [key, kind, label, action, pressed, name] of [
          ['mute', m.muted ? 'micOff' : 'mute', m.muted ? 'Mic Off' : 'Mic On', { toggle: 'muted' }, m.muted, m.muted ? 'Unmute' : 'Mute'],
          ['camera', 'camera', m.camera ? 'Camera On' : 'Camera Off', { toggle: 'camera' }, !m.camera, m.camera ? 'Stop video' : 'Start video'],
          ['share', 'share', 'Share Screen', { sharePicker: true }, m.share !== null, 'Share screen'],
          ['hand', 'hand', m.hand ? 'Lower Hand' : 'Raise Hand', { toggle: 'hand' }, m.hand, m.hand ? 'Lower hand' : 'Raise hand'],
        ]) {
          const b = P.button(controls, '', key, action, 'wg-control' + (pressed ? ' wg-pressed' : ''));
          b.setAttribute('aria-label', name); b.setAttribute('aria-pressed', String(pressed)); b.title = name;
          P.icon(b, kind, 48);
          const words = label.split(' ');
          const text = ctx.util.el('span', '', b);
          ctx.util.el('span', '', text, words[0]);
          ctx.util.el('span', '', text, words.slice(1).join(' '));
        }
      },
    },
  },
});
