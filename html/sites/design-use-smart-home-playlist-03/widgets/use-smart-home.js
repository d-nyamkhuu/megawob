// Design on the use-smart-home/classic console template.
env.widget({
  task: 'use-smart-home',
  site: 'design-use-smart-home-playlist-03',
  name: 'design',
  split: 'train',
  scenarios: ['playlist'],
  template: 'use-smart-home/classic',
  design: {
    frameInset: 0, minHeight: 0, minWidth: 0, rowMin: 28, rowMax: 100,
    parts: {
      top: (base, S) => R => {
        const head = R.e('div', 'hp-heading', R.app);
        const icon = R.e('span', 'hp-speaker', head);
        icon.innerHTML = '<svg viewBox="0 0 32 40" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="3" y="2" width="26" height="35" rx="3"/><circle cx="16" cy="11" r="3.5"/><circle cx="16" cy="26" r="6"/></svg>';
        R.e('h1', '', head, 'Living Room Media');
      },
      navigation: (base, S) => R => {
        const tabs = R.e('div', 'hp-tabs', R.app);
        [['music','Music Queue'],['play','Video'],['activity','Now Playing']].forEach(([icon,label],i) => {
          const tab = R.e('div', 'hp-tab' + (i === 0 ? ' selected' : ''), tabs);
          if (i === 0) S.P.icon(R, tab, icon);
          else {
            const svg = env.util.svg('svg', {viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':1.8,class:'ah-icon'}, tab);
            env.util.svg('path', {d:i === 1 ? 'M9 7v10l8-5ZM22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z' : 'M5 12v9M12 3v18M19 15v6'}, svg);
          }
          R.e('span', '', tab, label);
        });
      },
      sidebar: () => () => {},
      heading: () => () => {},
      toolbar: () => () => {},
      statusbar: () => () => {},
      body: (base, S) => (R, shell) => {
        const body = R.e('div', 'hp-body', shell);
        return { main: R.e('section', 'hp-queue-card', body), aside: R.e('aside', 'hp-listening', body) };
      },
      queueHeading: (base, S) => R => {
        const head = R.e('div', 'hp-queue-heading', R.main);
        R.e('h2', '', head, 'Queue');
        const tools = R.e('div', 'hp-queue-tools', head);
        const move = direction => {
          const order = R.ctx.model.order.slice(), index = order.indexOf(R.selectedTrack);
          if (index < 0 || index + direction < 0 || index + direction >= order.length) return;
          [order[index], order[index + direction]] = [order[index + direction], order[index]];
          S.P.patch(R, { order });
        };
        [['↑','Move Up',-1],['↓','Move Down',1]].forEach(([icon,label,dir]) => {
          const button = R.e('button', '', tools); button.type = 'button';
          R.e('span', 'hp-tool-icon', button, icon); R.e('span', '', button, label);
          button.addEventListener('click', () => move(dir));
        });
        const remove = R.e('button', '', tools); remove.type = 'button';
        const trash = env.util.svg('svg', {viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':1.7,class:'ah-icon'}, remove);
        env.util.svg('path', {d:'M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 9v9M14 9v9'}, trash);
        R.e('span', '', remove, 'Remove');
        remove.disabled = true;
      },
      playlistAside: (base, S) => R => {
        const head = R.e('div', 'hp-plan-heading', R.aside);
        S.P.icon(R, head, 'list'); R.e('h2', '', head, 'Listening plan');
        const plan = R.e('ol', 'hp-plan-items', R.aside);
        R.s.goal.order.forEach((id, index) => {
          const track = R.s.tracks.find(t => t.id === id), i = R.s.tracks.indexOf(track);
          const row = R.e('li', 'hp-plan-item', plan);
          R.e('span', 'hp-plan-number', row, String(index + 1));
          R.e('span', 'hp-art hp-art-' + i % 5, row);
          const text = R.e('div', 'hp-plan-text', row);
          R.e('strong', '', text, track.title); R.e('span', '', text, track.artist);
        });
      },
      playlistFooter: (base, S) => R => {
        const total = R.s.tracks.reduce((sum, t) => sum + t.duration, 0);
        const footer = R.e('div', 'hp-total', R.main);
        R.e('span', '', footer, 'Total duration: ');
        R.e('strong', '', footer, env.taskDef.helpers.durationText(total));
      },
      trackRow: (base, S) => (R, queue, t, i, rowHeight) => {
        const row = R.e('div', 'ah-track ah-grip hp-track', queue);
        row.style.height = rowHeight + 'px';
        row.style.setProperty('--cover-size', Math.min(70, rowHeight - 18) + 'px');
        row.setAttribute('aria-label', 'Reorder ' + t.title);
        row.dataset.trackId = t.id;
        const number = R.e('span', 'hp-track-number', row);
        R.e('span', 'hp-art hp-art-' + i % 5, row);
        const text = R.e('div', 'hp-track-text', row);
        R.e('strong', '', text, t.title); R.e('span', '', text, t.artist);
        R.e('span', 'hp-track-duration', row, env.taskDef.helpers.durationText(t.duration));
        R.e('span', 'hp-track-more', row, '···');
        row.addEventListener('click', () => {
          R.selectedTrack = t.id;
          queue.querySelectorAll('.hp-track').forEach(el => el.classList.toggle('hp-selected', el === row));
        });
        return { row, number };
      },
      rendered: (base, S) => R => {
        const firstRow = R.main.querySelector('.hp-track');
        if (firstRow) R.aside.style.setProperty('--plan-row-height', firstRow.style.height);
        const renumber = m => m.order.forEach((id, i) => {
          const row = [...R.main.querySelectorAll('.hp-track')].find(el => el.dataset.trackId === String(id));
          if (row) row.querySelector('.hp-track-number').textContent = String(i + 1);
        });
        R.paints.push(renumber); renumber(R.ctx.model);
      },
    },
  },
});
