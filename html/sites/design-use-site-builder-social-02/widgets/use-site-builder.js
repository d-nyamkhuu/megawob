// Publishing studio design; defaults reproduce this scenario's scaffold.
env.widget({
  task: 'use-site-builder',
  site: 'design-use-site-builder-social-02',
  name: 'design',
  split: 'train',
  scenarios: ['social'],
  template: 'use-site-builder/studio',
  design: {
    inset: 0,
    fontFamily: '"Arial Narrow", "Liberation Sans Narrow", Arial, sans-serif',
    fontSize: '18px',
    colors: { bg: '#faf9f6', panel: '#ffffff', fg: '#101923', muted: '#647080', line: '#d5d8dc', accent: '#a5f526' },
    parts: {
      header: (base, S) => () => {
        const head = S.ctx.util.el('header', 'studio-heading', S.els.app);
        S.ctx.util.el('h1', '', head, `Draft Posts (${S.spec.items.length})`);
        S.P.publish(head);
      },
      publishView: (base, S) => (parent) => {
        const button = base(parent);
        S.P.icon(button, 'calendar');
        button.prepend(button.lastChild);
        return button;
      },
      toolbar: () => () => {},
      navigation: (base, S) => () => {
        const u = S.ctx.util;
        const side = u.el('aside', 'studio-summary', S.els.app);
        u.el('h2', '', side, 'Social Publishing');
        const nav = u.el('div', 'studio-sections', side);
        for (const [icon, name, count] of [['calendar','Calendar',''], ['pages','Drafts',S.spec.items.length], ['clock','Scheduled','0'], ['mail','Published','18'], ['image','Content Library','']]) {
          const row = u.el('div', `studio-section${name === 'Calendar' ? ' active' : ''}`, nav);
          S.P.icon(row, icon); u.el('span', '', row, name);
          const n = u.el('span', 'studio-count', row, String(count));
          if (name === 'Scheduled') S.els.scheduleCount = n;
          if (name === 'Drafts') S.els.draftCount = n;
        }
        const accounts = u.el('section', 'studio-accounts', side);
        u.el('h3', '', accounts, 'Connected Accounts');
        for (const [network, glyph] of [['Facebook','f'], ['Instagram','◎'], ['Twitter','♥'], ['LinkedIn','in']]) {
          const row = u.el('div', 'studio-account', accounts);
          const badge = u.el('b', `network network-${network.toLowerCase()}`, row, network === 'Twitter' ? '' : glyph);
          if (network === 'Twitter') {
            const svg = u.svg('svg', {viewBox:'0 0 24 24', fill:'currentColor'}, badge);
            u.svg('path', {d:'M23 3a9 9 0 0 1-2.6.8 4.5 4.5 0 0 0 2-2.5 9 9 0 0 1-2.9 1.1A4.5 4.5 0 0 0 12 6.5c0 .4 0 .7.1 1A12.8 12.8 0 0 1 2.8 2.8a4.5 4.5 0 0 0 1.4 6 4.5 4.5 0 0 1-2-.6v.1a4.5 4.5 0 0 0 3.6 4.4 5 5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 17.8a12.7 12.7 0 0 0 19.6-10.7V6.5A9 9 0 0 0 23 3z'}, svg);
          }
          const text = u.el('div', '', row, network); u.el('small', '', text, '1 account');
        }
        const status = u.el('section', 'studio-status', side);
        u.el('h3', '', status, 'Post Status');
        for (const [name, count] of [['Drafts', S.spec.items.length], ['Scheduled', 0], ['Published', 18]]) {
          const row = u.el('div', 'studio-status-row', status);
          u.el('i', name.toLowerCase(), row); u.el('span', '', row, name);
          const n = u.el('span', 'studio-count', row, String(count));
          if (name === 'Scheduled') S.els.statusScheduled = n;
          if (name === 'Drafts') S.els.statusDrafts = n;
        }
      },
      channels: (base, S) => () => {
        base();
        const tray = S.st.drafts.parentElement;
        tray.className = 'studio-tray'; tray.removeAttribute('style');
        for (const child of [...tray.children]) if (child !== S.st.drafts) child.remove();
        S.st.drafts.className = 'ab-pane studio-drafts';
      },
      calendar: (base, S) => () => {
        base();
        const u = S.ctx.util;
        const main = S.st.panes.calendar.parentElement;
        const bar = main.querySelector('.ab-socialbar');
        const previous = bar.querySelector('button');
        bar.replaceChildren();
        u.el('h2', 'ab-grow', bar, 'Weekly Schedule');
        bar.appendChild(previous);
        u.el('span', 'studio-week-range', bar, 'Mon 18 – Sun 24');
        S.P.iconButton(bar, 'chevron', 'Next period', () => S.P.showPanel('Calendar periods', [['Next week', 'Upcoming posts']]));
        const week = u.el('button', 'ab-btn studio-this-week', bar); week.type = 'button';
        S.P.icon(week, 'calendar'); u.el('span', '', week, 'This week');
        const calendar = S.st.panes.calendar.firstElementChild;
        const times = [...new Set([...Array.from({length:10}, (_, i) => `${String(i + 8).padStart(2,'0')}:00`), ...S.spec.times])].sort();
        calendar.style.setProperty('--time-rows', times.length);
        const children = [...calendar.children];
        children[0].textContent = 'Time';
        children.slice(0, 6).forEach((el, i) => { el.style.gridColumn = i + 1; el.style.gridRow = 1; });
        for (const [i, day] of ['Sat 23', 'Sun 24'].entries()) {
          const el = u.el('div', 'ab-day', calendar, day); el.style.gridColumn = i + 7; el.style.gridRow = 1;
        }
        for (const el of children.slice(6)) if (el.classList.contains('ab-hour')) el.remove();
        times.forEach((time, i) => {
          const hour = u.el('div', 'ab-hour', calendar, time); hour.style.gridColumn = 1; hour.style.gridRow = i + 2;
          for (let day = 0; day < 7; day++) {
            if (day < 5 && S.spec.times.includes(time)) continue;
            const cell = u.el('div', 'studio-empty-cell', calendar); cell.style.gridColumn = day + 2; cell.style.gridRow = i + 2;
          }
        });
        S.st.cells.forEach((cell, i) => { cell.style.gridColumn = i % 5 + 2; cell.style.gridRow = times.indexOf(S.spec.times[Math.floor(i / 5)]) + 2; });
      },
      history: (base, S) => (...args) => { base(...args); args[0].querySelector('.ab-history').remove(); },
      postView: (base, S) => (drafts, it) => {
        const u = S.ctx.util;
        const post = S.P.ref({ post: it.id }, u.el('div', 'ab-post', drafts));
        const photo = u.el('div', 'studio-post-photo', post);
        const photoIndex = S.spec.items.indexOf(it) % 4;
        photo.style.backgroundPosition = `${photoIndex % 2 * 100}% ${Math.floor(photoIndex / 2) * 100}%`;
        u.el('span', 'studio-post-menu', post, '•••');
        u.el('b', '', post, it.label); u.el('p', '', post, it.copy);
        const networks = u.el('div', 'studio-post-networks', post);
        for (const [network, glyph] of [['facebook','f'], ['instagram','◎'], ['linkedin','in']]) u.el('b', `network network-${network}`, networks, glyph);
        const meta = u.el('div', 'ab-postmeta', post); u.el('span', '', meta);
        return post;
      },
      paintSocial: (base, S) => (model) => {
        base(model);
        const scheduled = Object.values(model.schedule).filter((v) => v >= 0).length;
        for (const key of ['scheduleCount','statusScheduled']) S.els[key].textContent = scheduled;
        for (const key of ['draftCount','statusDrafts']) S.els[key].textContent = S.spec.items.length - scheduled;
      },
    },
  },
});
