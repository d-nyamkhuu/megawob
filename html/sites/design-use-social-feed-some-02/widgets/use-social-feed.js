// Adds the GNOME inspector, photo imagery, and labeled feed controls to the shared some feed.
(function () {
  'use strict';

  const DETAIL_URL = new URL('../assets/reference-details.webp', document.currentScript.src).href;
  const FACE_REGIONS = [
    [56, 177, 64, 64], [56, 315, 64, 64], [56, 458, 64, 64], [56, 584, 64, 64], [56, 850, 64, 64],
  ];
  const PHOTO_REGIONS = [
    [840, 179, 211, 62], [840, 315, 211, 70], [840, 585, 211, 68], [840, 851, 211, 54],
  ];

  function detail(el, region) {
    const [x, y, w, h] = region;
    el.style.backgroundImage = `url(${DETAIL_URL})`;
    el.style.backgroundSize = `${(1672 / w) * 100}% ${(941 / h) * 100}%`;
    el.style.backgroundPosition = `${(x / (1672 - w)) * 100}% ${(y / (941 - h)) * 100}%`;
    el.style.backgroundRepeat = 'no-repeat';
  }

  const DESIGN_CSS = `
    .as-page { inset: 0 !important; display: flex; justify-content: stretch !important; }
    .as-rail, .as-side { display: none; }
    .as-col { flex: 1 !important; width: 100% !important; border: 0; }
    .as-head { height: 43px; background: var(--header, var(--panel)); font-size: 14px; }
    .as-post { padding: 13px 18px; gap: 14px; border-bottom: 1px solid var(--line); }
    .as-text { font-size: 16px; line-height: 1.4; }
    .as-av { width: 48px; height: 48px; border-radius: 4px; font-size: 17px; }
    .as-acts { max-width: 440px; justify-content: flex-start; gap: 22px; }
    .as-act { border-radius: 3px; height: 30px; font-size: 14px; padding: 0 8px; }
    .as-act svg { width: 20px; height: 20px; }
    .as-photos { height: 100px !important; border-radius: 4px; }
    .as-menu { border-radius: 3px; min-width: 210px; }
    .as-mi { height: 35px; font-size: 14px; }
    .as-confirm { border-radius: 4px; }
    .as-confirm button { border-radius: 3px; }
    .as-track { border-radius: 0; width: 15px; background: var(--line); }
    .as-thumb { border-radius: 0; }
    .as-name { font-size: 16px; }
    .as-handle, .as-time { font-size: 13px; }
    .as-quote, .as-link { border-radius: 3px; }
    .as-link.tall .as-link-img { height: 65px; }
    .as-post:has(.as-photos) { min-height: 200px; }
  `;

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-some-02',
    name: 'design',
    split: 'train',
    scenarios: ['some'],
    template: 'use-social-feed/feed',
    design: {
      layout: 'plain',
      labels: true,
      scenarioDecor: false,
      siteCssLast: true,
      icons: {
        more: '<circle cx="12" cy="5.5" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none"/><circle cx="12" cy="18.5" r="1.7" fill="currentColor" stroke="none"/>',
      },
      css: DESIGN_CSS,
      parts: {
        begin: (base) => (R) => {
          base(R);
          const { util, spec, F } = R;
          const note = document.querySelector('.task-note');
          const progressBox = util.el('section', 'inspector-panel progress-panel', note);
          util.el('h3', '', progressBox, 'Progress');
          R.x.progressText = util.el('p', '', progressBox);
          const targetBox = util.el('section', 'inspector-panel target-panel', note);
          util.el('h3', '', targetBox, 'Target account');
          const targetPerson = spec.posts.find((p) => p.handle === spec.select.handle);
          const targetRow = util.el('div', 'target-row', targetBox);
          if (targetPerson) {
            const av = util.el('div', 'target-avatar', targetRow);
            const handles = [...new Set(spec.posts.map((p) => p.handle).concat(spec.posts.filter((p) => p.quote).map((p) => p.quote.handle)))];
            detail(av, FACE_REGIONS[handles.indexOf(targetPerson.handle) % FACE_REGIONS.length]);
          }
          const targetText = util.el('div', 'target-text', targetRow);
          util.el('b', '', targetText, spec.select.kind === 'user' ? spec.select.handle : `#${spec.select.tag}`);
          if (targetPerson) util.el('p', '', targetText, targetPerson.name);
          const notesBox = util.el('section', 'inspector-panel notes-panel', note);
          util.el('h3', '', notesBox, 'Notes');
          const notes = util.el('ul', '', notesBox);
          util.el('li', '', notes, `Click ${F.helpers.LABELS[spec.action] || spec.action} on exactly ${spec.count} posts by ${spec.select.kind === 'user' ? spec.select.handle : `#${spec.select.tag}`}.`);
          util.el('li', '', notes, 'Do not act on posts from other users.');
          const end = document.querySelector('[data-role="submit"]');
          if (end) util.el('li', '', notes, `Then click the ${end.textContent} button.`);
          const circles = util.el('span', 'gn-circles', progressBox);
          for (let i = 0; i < spec.count; i++) util.el('i', '', circles);
        },
        decorTabs: (base) => (R) => {
          base(R);
          const tabs = R.head.querySelectorAll('.as-tab');
          if (tabs[0]) tabs[0].textContent = 'For You';
          R.util.el('div', 'as-tab', R.head, 'Discover');
        },
        headed: (base) => (R) => {
          base(R);
          if (R.live) R.util.el('div', 'as-tab', R.head, 'Discover');
        },
        avatar: (base) => (R, row, post, ...args) => {
          const av = base(R, row, post, ...args);
          av.textContent = '';
          detail(av, FACE_REGIONS[R.handles.indexOf(post.handle) % FACE_REGIONS.length]);
          av.title = post.name;
          return av;
        },
        media: (base, S) => (R, host, post, p, parts) => {
          const { util } = R;
          if (post.media && post.media.kind === 'photo') {
            const grid = util.el('div', 'as-photos', host);
            const n = post.media.n;
            grid.style.gridTemplateColumns = n === 1 ? '1fr' : '1fr 1fr';
            grid.style.gridTemplateRows = n > 2 ? '1fr 1fr' : '1fr';
            for (let k = 0; k < n; k++) {
              const tile = util.el('div', 'as-photo', grid);
              if (n === 3 && k === 0) tile.style.gridRow = 'span 2';
              detail(tile, PHOTO_REGIONS[(p + k) % PHOTO_REGIONS.length]);
              tile.title = post.media.alt;
              if (k === 0) util.el('span', 'as-alt', tile, 'ALT');
            }
          } else if (post.media && post.media.kind === 'link') {
            const card = util.el('div', `as-link${R.tallLinks ? ' tall' : ''}`, host);
            detail(util.el('div', 'as-link-img', card), PHOTO_REGIONS[p % PHOTO_REGIONS.length]);
            const text = util.el('div', 'as-link-t', card);
            util.el('small', '', text, post.media.domain);
            util.el('b', '', text, post.media.title);
          }
          if (post.quote) S.P.quote(R, host, post, p, parts);
        },
        actsMade: (base, S) => (R, acts, post, p, parts) => {
          base(R, acts, post, p, parts);
          const metric = R.util.el('span', 'as-heart-count', acts);
          metric.innerHTML = S.svg(S.ICON.like);
          parts.heartCount = R.util.el('span', '', metric);
        },
        actLabel: (base) => (R, button, b, p, post, parts) => {
          if (b === 'reply' || b === 'retweet') parts.counts[b] = R.util.el('span', '', button);
          else base(R, button, b, p, post, parts);
        },
        paintAct: (base) => (R, p, parts, b, on) => {
          base(R, p, parts, b, on);
          if (parts.heartCount) {
            const post = R.spec.posts[p];
            parts.heartCount.textContent = R.F.helpers.formatCount((post.counts.like || 0) + (R.ctx.model.on.includes(R.F.helpers.keyOf(p, 'like')) ? 1 : 0));
          }
        },
        restoreScroll: () => (R, B, model, keep, first) => {
          B.feed.scrollTop = keep;
          if (first && model.scroll > 0) {
            const rows = [...B.rows.values()];
            const index = Math.min(Math.floor(model.scroll), rows.length - 1);
            if (index >= 0) {
              const top = B.feed.getBoundingClientRect().top + B.feed.clientTop;
              const offset = rows[index].getBoundingClientRect().top - top;
              const next = rows[index + 1];
              const step = next
                ? next.getBoundingClientRect().top - rows[index].getBoundingClientRect().top
                : rows[index].offsetHeight;
              B.feed.scrollTop = offset + (model.scroll - index) * step;
            }
          }
          B.lbx.set({});
        },
        painted: (base) => (R, model) => {
          base(R, model);
          const selected = model.on.filter((k) => R.spec.targets.includes(Number(k.split(':')[0])) && k.endsWith(`:${R.spec.action}`)).length;
          const action = R.spec.action;
          R.x.progressText.textContent = `${selected} of ${R.spec.count} ${action === 'like' ? 'likes ' : action === 'retweet' ? 'retweets ' : ''}selected`;
          [...document.querySelectorAll('.gn-circles i')].forEach((el, i) => el.classList.toggle('selected', i < selected));
        },
        placeMenu: () => (R, panel, trigger) => {
          const col = R.col.getBoundingClientRect();
          const triggerBox = trigger.getBoundingClientRect();
          const box = R.box.getBoundingClientRect();
          const width = panel.offsetWidth;
          const height = panel.offsetHeight;
          panel.style.left = `${Math.round(Math.max(8, triggerBox.right - col.left - width + 4))}px`;
          const below = triggerBox.bottom + 4;
          const bottom = Math.min(box.bottom, col.bottom);
          const top = below + height <= bottom - 4
            ? below
            : Math.max(col.top + 4, Math.min(triggerBox.top - 4 - height, bottom - height - 4));
          panel.style.top = `${Math.round(top - col.top)}px`;
        },
      },
    },
  });
})();
