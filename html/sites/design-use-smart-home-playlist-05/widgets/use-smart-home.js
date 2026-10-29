// Design on the use-smart-home/classic console template.
env.widget({
  task: 'use-smart-home',
  site: 'design-use-smart-home-playlist-05',
  name: 'design',
  split: 'train',
  scenarios: ['playlist'],
  template: 'use-smart-home/classic',
  design: {
    frameInset: 0,
    minHeight: 150,
    rowMin: 32,
    rowMax: 52,
    parts: {
      top: () => () => {},
      navigation: () => () => {},
      sidebar: () => () => {},
      toolbar: () => () => {},
      statusbar: () => () => {},
      frame: (base) => R => {
        const app = base(R);
        app.classList.add('hh-console');
        return app;
      },
      body: () => R => {
        const body = R.e('div', 'hh-playlist-columns', R.app.querySelector('.ah-shell'));
        const main = R.e('section', 'ah-main hh-queue-panel', body);
        const aside = R.e('section', 'ah-aside hh-listening', body);
        const tips = R.e('section', 'hh-tips', body);
        const tipsHead = R.e('div', 'hh-tips-title', tips);
        env.homeConsoleIcon(R.e('span', 'hh-section-symbol', tipsHead), 'bulb');
        R.e('h2', '', tipsHead, 'Tips');
        const points = R.e('ul', '', tips);
        for (const point of ['Select a track and use Move Up or Move Down to change the order.', 'You can remove a track from the queue if needed.', 'The total queue duration updates automatically.']) R.e('li', '', points, point);
        return { main, aside };
      },
      heading: (base, S) => R => {
        const head = R.e('div', 'hh-queue-title', R.main);
        env.homeConsoleIcon(R.e('span', 'hh-section-symbol', head), 'music');
        R.e('h2', '', head, 'Music Queue');
        const actions = R.e('section', 'hh-queue-actions', R.main);
        [['▲', 'Move Up'], ['▼', 'Move Down'], ['━', 'Remove']].forEach(([symbol, label]) => {
          const b = R.e('button', '', actions);
          R.e('span', 'hh-action-symbol', b, symbol);
          R.e('span', '', b, label);
          b.type = 'button';
          b.addEventListener('click', () => S.P.showInfo(R, label, [[label, label === 'Play' ? 'Audio preview is unavailable. Connect a media source to listen.' : 'Drag a track to change its place in the queue.']]));
        });
      },
      playlistAside: (base, S) => R => {
        const title = R.e('div', 'hh-listening-title', R.aside);
        env.homeConsoleIcon(R.e('span', 'hh-section-symbol', title), 'plan');
        R.e('h2', '', title, 'Listening plan');
        const list = R.e('div', 'hh-listening-rows', R.aside);
        R.s.goal.order.forEach((id, i) => {
          const t = R.s.tracks.find(t => t.id === id);
          const row = R.e('div', 'hh-listening-row', list);
          R.e('span', 'hh-plan-number', row, String(i + 1));
          R.e('div', 'hh-plan-text', row, `${t.title} — ${t.artist}`);
        });
        // Keep the live task fact registered, while presenting it beneath the queue.
        S.P.fact(R, 'Queue duration');
        R.facts['Queue duration'].parentElement.hidden = true;
      },
      queueHeading: () => R => {
        const head = R.e('div', 'hh-track-columns', R.main);
        ['#', 'Title', 'Artist', 'Album', 'Duration'].forEach(label => R.e('span', '', head, label));
      },
      playlistFooter: () => R => {
        const footer = R.e('div', 'hh-total-duration', R.main);
        R.e('span', '', footer, 'Total Duration:');
        footer.appendChild(R.facts['Queue duration']);
      },
      trackRow: () => (R, queue, t, i, rowHeight) => {
        const row = R.e('div', 'ah-track hh-queue-row', queue);
        row.style.height = rowHeight + 'px';
        const grip = R.e('span', 'ah-grip', row);
        grip.setAttribute('aria-label', 'Reorder ' + t.title);
        const number = R.e('span', 'hh-track-number', row);
        const cover = R.e('div', 'hh-album-picture', row);
        cover.dataset.art = i % 6;
        R.e('div', 'hh-track-name', row, t.title);
        R.e('span', 'hh-track-artist', row, t.artist);
        R.e('span', 'hh-track-album', row, ['Hearth and Horizon','Brighter Days','Next Exit','Windward','Still Life'][i % 5]);
        R.e('span', 'hh-track-duration', row, env.taskDef.helpers.durationText(t.duration));
        return { row, number };
      },
      rendered: () => R => {
        const plainNumbers = () => R.main.querySelectorAll('.hh-track-number').forEach(n => { n.textContent = String(Number(n.textContent)); });
        R.paints.push(plainNumbers);
        plainNumbers();
        const taskCard = document.querySelector('.ref-panel');
        if (taskCard) {
          R.aside.parentElement.insertBefore(taskCard, R.aside);
          R.aside.parentElement.classList.add('hh-has-panel');
        }
        const syncPlaying = () => {
          const first = R.main.querySelector('.hh-queue-row');
          const details = document.querySelector('.hh-playing-details');
          const art = document.querySelector('.hh-playing-song .hh-album-picture');
          if (first && details && art) {
            details.querySelector('strong').textContent = first.querySelector('.hh-track-name').textContent;
            details.querySelector('span').textContent = first.querySelector('.hh-track-artist').textContent;
            art.dataset.art = first.querySelector('.hh-album-picture').dataset.art;
          }
        };
        R.paints.push(syncPlaying);
        syncPlaying();
      },
    },
  },
});
