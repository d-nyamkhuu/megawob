// Design on the shared use-calendar/workspace template.
env.widget({
  task: 'use-calendar',
  site: 'design-use-calendar-month-02',
  name: 'design',
  split: 'train',
  scenarios: ['month'],
  template: 'use-calendar/workspace',
  design: {
    colors: ['#4e9fe0', '#55b86b', '#d5aa24', '#4e9fe0'],
    theme: { panel: '#fbfaf0', bg: '#fbfaf0', fg: '#071747', muted: '#93969d', line: '#7ba3c3', accent: '#289eb7' },
    parts: {
      monthCell: (base) => (st, grid, day, month) => {
        const cell = base(st, grid, day, month);
        if (day < 1 || day > month.days) {
          const index = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(month.name);
          const previousDays = [31, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30][index];
          st.u.el('span', 'ac-number', cell, String(day < 1 ? previousDays + day : day - month.days));
        }
        return cell;
      },
      buildMonth: (base) => (st) => {
        base(st);
        const heading = st.u.el('div', 'pixel-month-heading');
        heading.appendChild(st.period);
        st.main.insertBefore(heading, st.refs.monthGrid);
        // Keep the existing navigation controls and their handlers inside the card.
        st.root.appendChild(document.querySelector('.calendar-datebar'));
      },
      monthEvent: (base) => (st, parent, event) => {
        const node = base(st, parent, event);
        node.dataset.tone = String(event.tone % 4);
        return node;
      },
    },
  },
});
