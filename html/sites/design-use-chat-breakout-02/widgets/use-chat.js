// Design on templates/use-chat/workspace.js; defaults preserve the reference scaffold.
env.widget({
  task: 'use-chat',
  site: 'design-use-chat-breakout-02',
  name: 'design',
  split: 'train',
  scenarios: ['breakout'],
  template: 'use-chat/workspace',
  design: {
    panel: '#ffffff', bg: '#f5f8fc', fg: '#10132e', muted: '#7685a6',
    line: '#c3cee0', accent: '#00358e',
    parts: {
      icon: (base, S) => (parent, kind, size = 24) => {
        if (kind !== 'people') return base(parent, kind, size);
        const svg = S.ctx.util.svg('svg', { viewBox: '0 0 48 40', width: size, height: size, 'aria-hidden': 'true' }, parent);
        svg.innerHTML = '<g fill="currentColor" stroke="#ffffff" stroke-width="1.2"><circle cx="10" cy="13" r="6"/><circle cx="38" cy="13" r="6"/><path d="M1 36v-7a9 9 0 0118 0v7zM29 36v-7a9 9 0 0118 0v7z"/><circle cx="24" cy="10" r="8"/><path d="M10 38v-8a14 14 0 0128 0v8z"/></g>';
        return svg;
      },
      topbar: (base, S) => (parent) => {
        const U = S.ctx.util;
        const bar = U.el('div', 'aqua-manager-title', parent, 'Breakout Rooms');
        const dots = U.el('span', 'win31-window-buttons', bar);
        for (let i = 0; i < 3; i++) U.el('span', 'win31-window-button', dots);
      },
      rail: () => () => {},
      navigation: (base, S) => (parent) => {
        const el = S.ctx.util.el('div', 'aqua-hidden-navigation', parent);
        return { el, text: S.ctx.util.el('span', '', el) };
      },
      meetingHeader: (base, S) => (m) => {
        const U = S.ctx.util, P = S.P;
        const head = U.el('header', 'aqua-manager-header', S.main);
        const emblem = U.el('div', 'aqua-manager-emblem', head);
        P.icon(emblem, 'people', 48);
        U.el('h2', '', head, 'Breakout Rooms');
        const controls = U.el('div', 'aqua-session-controls', head);
        const session = U.el('div', 'aqua-session', controls);
        U.el('span', '', session, 'Main Session');
        U.el('span', 'aqua-session-time', session, '00:12:36');
        for (const [kind, title, key, ev] of [
          ['mute', 'Microphone', 'mute', { toggle: 'muted' }],
          ['camera', 'Camera', 'camera', { toggle: 'camera' }],
          ['more', 'Room options', null, null],
          ['people', 'Manage members', 'settings', { settings: true }],
        ]) {
          const b = P.iconButton(controls, kind, title, key, ev, 'aqua-header-icon');
          if (kind === 'people') U.el('span', '', b, String(S.spec.people.length + 2));
          if (kind === 'more') b.addEventListener('click', () => {
            const menu = S.main.querySelector('.aqua-room-options');
            if (menu) menu.hidden = !menu.hidden;
          });
        }
      },
      meetingMeta: () => () => {},
      breakoutNotice: () => () => {},
      breakoutControls: (base, S) => (parent, m) => {
        const menu = S.ctx.util.el('div', 'aqua-room-options', parent);
        menu.hidden = true;
        base(menu, m);
      },
      room: (base, S) => (board, room, rooms, m) => {
        base(board, room, rooms, m);
        const el = rooms.get(room);
        el.classList.add(room === -1 ? 'aqua-unassigned' : 'aqua-workshop');
        el.dataset.room = room;
        // One roster across the top of the board, the three rooms below it.
        if (room === -1) el.style.gridColumn = '1 / -1';
        el.querySelector('.ch-roomstatus')?.remove();
        el.querySelector('.ch-roomfooter')?.remove();
        const header = el.querySelector('.ch-roomhead');
        if (room === -1) {
          header.querySelector('svg')?.remove();
          header.querySelector('span').textContent = 'Unassigned Participants';
        } else {
          header.querySelector('svg')?.remove();
          const icon = S.P.icon(header, 'people', 37);
          header.prepend(icon);
        }
        const empty = el.querySelector('.ch-empty');
        if (empty && room !== -1) empty.textContent = 'Drag participants here';
      },
      participant: (base, S) => (roster, person, i) => {
        const card = base(roster, person, i);
        card.querySelector('small')?.remove();
        S.ctx.util.el('span', 'aqua-drag-grip', card, '⠿');
        return card;
      },
      avatar: (base, S) => (parent, person, cls = '') => {
        const avatar = base(parent, person, cls);
        const i = Math.max(0, S.spec.people.findIndex(p => p.full === person.full)) % 6;
        avatar.classList.add('aqua-photo', 'aqua-photo-' + i);
        return avatar;
      },
    },
  },
});
