// OS/2 publishing calendar. The shared parts retain drag/drop registration and model updates.
function publisherDocument(u, parent) {
  const svg = u.svg('svg', { viewBox: '0 0 44 58', class: 'publisher-document', 'aria-hidden': 'true' }, parent);
  u.svg('path', { d: 'M2 2H31L42 13V56H2Z', fill: '#fff', stroke: '#090b0b', 'stroke-width': 3 }, svg);
  u.svg('path', { d: 'M30 2V14H42M9 14H25M9 20H35M9 25H35M9 30H35M9 35H35M9 40H35M9 45H35', fill: 'none', stroke: '#090b0b', 'stroke-width': 2.2 }, svg);
  return svg;
}

env.widget({
  task: 'use-site-builder',
  site: 'design-use-site-builder-social-03',
  name: 'design',
  split: 'train',
  scenarios: ['social'],
  template: 'use-site-builder/studio',
  design: {
    inset: 8,
    fontFamily: 'Arial, sans-serif',
    fontSize: '22px',
    radius: '0',
    colors: { panel: '#f6f6f6', bg: '#cbcdce', fg: '#101010', muted: '#202020', line: '#888b8c', accent: '#007d87' },
    parts: {
      header: () => () => {},
      toolbar: () => () => {},
      navigation: () => () => {},
      footer: (base, S) => () => {
        const u = S.ctx.util;
        const foot = u.el('div', 'publisher-details', S.els.app);
        const selected = u.el('section', 'publisher-selected', foot);
        u.el('div', 'publisher-panel-title', selected, 'Selected Post');
        const contents = u.el('div', 'publisher-selection', selected);
        publisherDocument(u, contents);
        const identity = u.el('div', 'publisher-identity', contents);
        const name = u.el('b', '', identity);
        const type = u.el('div', '', identity);
        const metadata = u.el('div', 'publisher-metadata', contents);
        u.el('span', '', metadata, 'Channels:');
        const networks = u.el('div', 'publisher-networks', metadata);
        const bird = u.svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, networks);
        u.svg('path', { d: 'M22 5l-2 2c0 8-6 14-14 14-2 0-4-1-5-2 3 0 5-1 6-2-3 0-4-2-4-3h2C2 13 1 11 2 9l2 1C1 7 3 4 3 4c3 4 7 5 10 5-1-5 5-7 7-4l3-1-1 2 2-1z', fill: '#050505' }, bird);
        u.el('b', 'publisher-facebook', networks, 'f');
        const insta = u.svg('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: '#050505', 'stroke-width': 2, 'aria-hidden': 'true' }, networks);
        u.svg('rect', { x: 3, y: 3, width: 18, height: 18, rx: 4 }, insta);
        u.svg('circle', { cx: 12, cy: 12, r: 4 }, insta);
        u.svg('circle', { cx: 17.5, cy: 6.5, r: 1, fill: '#050505' }, insta);
        u.el('span', '', metadata, 'Tags:'); u.el('span', '', metadata, '—');
        u.el('span', '', metadata, 'Description:');
        const description = u.el('span', 'publisher-description', metadata);
        S.els.selectPost = (it) => {
          const index = S.spec.items.indexOf(it);
          name.textContent = it.label;
          type.textContent = `Social • ${['Image', 'Text', 'Image', 'Link'][index % 4]}`;
          description.textContent = it.copy || '—';
          description.title = it.copy || '';
          for (const post of Object.values(S.st.posts)) post.classList.toggle('publisher-active', post.dataset.post === it.id);
          S.els.selectedPost = it.id;
        };
        const schedule = u.el('section', 'publisher-schedule', foot);
        u.el('div', 'publisher-panel-title', schedule, 'Schedule');
        const metric = u.el('div', 'publisher-count', schedule);
        S.P.publish(schedule);
        const status = u.el('span', 'publisher-status', schedule);
        S.st.saved = u.el('span', 'publisher-status', schedule);
        return { status, metric };
      },
      channels: (base, S) => () => {
        base();
        const side = S.st.drafts.parentElement;
        for (const node of [...side.children]) if (node !== S.st.drafts) node.remove();
        const title = S.ctx.util.el('div', 'publisher-panel-title', side, `Draft Posts (${S.spec.items.length})`);
        side.prepend(title);
      },
      calendar: (base, S) => () => {
        base();
        const wrap = S.st.panes.calendar;
        wrap.parentElement.querySelector('.ab-socialbar').remove();
        const calendar = wrap.querySelector('.ab-calendar');
        const heads = [...calendar.querySelectorAll('.ab-day')];
        heads[0].textContent = '';
        heads.slice(1).forEach((head) => { head.textContent = head.textContent.replace(' ', '\n'); });
        calendar.querySelectorAll('.ab-hour').forEach((el) => el.remove());
        for (let hour = 8; hour <= 17; hour++) {
          const time = `${String(hour).padStart(2, '0')}:00`;
          const gridRow = hour - 6;
          const label = S.ctx.util.el('div', 'ab-hour', calendar, time);
          label.style.gridArea = `${gridRow} / 1`;
          const taskRow = S.spec.times.indexOf(time);
          for (let day = 0; day < 5; day++) {
            const cell = taskRow < 0 ? S.ctx.util.el('div', 'publisher-empty-cell', calendar) : S.st.cells[taskRow * 5 + day];
            cell.style.gridArea = `${gridRow} / ${day + 2}`;
          }
        }
      },
      history: (base) => (cell, i, row) => {
        base(cell, i, row); // Preserve the context RNG draw for each archive entry.
        cell.lastElementChild.remove();
      },
      postView: (base, S) => (drafts, it) => {
        const u = S.ctx.util;
        const post = S.P.ref({ post: it.id }, u.el('div', 'ab-post', drafts));
        post.dataset.post = it.id;
        publisherDocument(u, post);
        const text = u.el('div', 'publisher-post-text', post);
        u.el('b', '', text, it.label);
        u.el('div', 'publisher-post-kind', text, `Social • ${['Image', 'Text', 'Image', 'Link'][S.spec.items.indexOf(it) % 4]}`);
        const meta = u.el('div', 'ab-postmeta', post);
        u.el('span', '', meta);
        post.title = it.copy;
        post.addEventListener('pointerdown', () => S.els.selectPost(it));
        return post;
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        S.els.selectPost(S.spec.items[0]);
      },
      paintSocial: (base, S) => (model) => {
        base(model);
        const button = S.els.app.querySelector('.publisher-schedule .ab-btn');
        button.classList.toggle('publisher-activated', model.committed);
        button.setAttribute('aria-pressed', String(model.committed));
      },
    },
  },
});
