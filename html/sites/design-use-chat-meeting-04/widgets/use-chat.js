// Design on templates/use-chat/workspace.js; defaults preserve the reference scaffold.
env.widget({
  task: 'use-chat',
  site: 'design-use-chat-meeting-04',
  name: 'design',
  split: 'train',
  scenarios: ['meeting'],
  template: 'use-chat/workspace',
  design: {
    inset: '0px', radius: '0px', font: 'Arial, Helvetica, sans-serif',
    panel: '#fff', bg: '#fff', fg: '#171d24', line: '#e2e4e7',
    accent: '#f04432', muted: '#7d838b', callSideAt: 10000,
    parts: {
      topbar: () => () => {},
      rail: () => () => {},
      meetingMeta: () => () => {},
      meetingHeader: (base, S) => (m) => {
        const tab = document.querySelector('.meeting-tab:nth-child(2)');
        tab.replaceChildren();
        const members = S.P.button(tab, `People (${S.spec.people.length + 1})`, 'settings', { settings: true }, 'meeting-people');
        members.setAttribute('aria-label', 'Manage members');
        members.title = 'Manage members';
      },
      meetingControls: (base, S) => (meeting, m) => {
        base(meeting, m);
        const controls = meeting.querySelector('.ch-controls');
        const symbols = [
          '<g fill="currentColor"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10h2v3a5 5 0 0 0 10 0v-3h2v3a7 7 0 0 1-6 6.93V22h4v2H7v-2h4v-2.07A7 7 0 0 1 5 13z"/></g>',
          '<g fill="currentColor"><rect x="1" y="5" width="15" height="14" rx="2"/><path d="m17 9 6-4v14l-6-4z"/></g>',
          '<g fill="currentColor"><rect x="2" y="2" width="20" height="16" rx="2"/><path d="M10 18h4v3h4v2H6v-2h4z"/></g>',
          '<path fill="currentColor" d="M6 12V5a1.4 1.4 0 0 1 2.8 0v6h.6V2.5a1.4 1.4 0 0 1 2.8 0V11h.6V3.5a1.4 1.4 0 0 1 2.8 0V12h.6V6a1.4 1.4 0 0 1 2.8 0v10c0 5-2.5 8-7 8-3 0-4.8-1.3-6.1-4L3 14c-.8-2 1-3.2 2-1.8l2 3z"/>',
        ];
        Array.from(controls.children).slice(0, 4).forEach((button, i) => {
          const ring = S.ctx.util.el('span', 'meeting-control-ring');
          const icon = button.querySelector('svg');
          if (i !== 0 || !m.muted) icon.innerHTML = symbols[i];
          ring.append(icon);
          button.prepend(ring);
          button.classList.add('meeting-control');
        });
      },
      tile: (base, S) => (tiles, person, i, m) => {
        base(tiles, person, i, m);
        const tile = tiles.lastElementChild;
        tile.classList.add('meeting-portrait-tile');
        tile.classList.add(`portrait-${i % 4}`);
        tile.querySelector('.ch-avatar').remove();
        S.ctx.util.el('div', 'meeting-video-photo', tile);
      },
      avatar: (base, S) => (parent, person, cls = '') => {
        const avatar = base(parent, person, cls);
        const i = S.spec.people.findIndex(p => p.full === person.full);
        avatar.classList.add('portrait-face', `portrait-${(i + 1) % 4}`);
        return avatar;
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const { spec } = S;
        const count = spec.people.length + 1;
        document.querySelector('.meeting-stat-number').textContent = count;
        const rows = document.querySelectorAll('.meeting-message');
        rows.forEach((row, i) => {
          const msg = (spec.history || [])[i];
          const personIndex = msg ? msg.author : i % spec.people.length;
          const person = spec.people[personIndex];
          if (person) row.querySelector('.meeting-byline strong').textContent = person.full;
          if (msg) {
            row.querySelector('.meeting-byline span').textContent = msg.time;
            if (i !== 3) row.querySelector('.meeting-message-text').textContent = msg.text;
          }
          row.querySelector('.meeting-avatar').classList.add('portrait-face', `portrait-${(personIndex + 1) % 4}`);
        });
        const file = spec.sharedFiles && spec.sharedFiles[0];
        if (file) {
          rows[0].querySelector('.meeting-attachment strong').textContent = file.name;
          rows[0].querySelector('.meeting-attachment small').textContent = file.size;
        }
      },
    },
  },
});
