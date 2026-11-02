// Ledger design: table rows, photo avatars, preview scenes, and fixed action columns.
env.widget({
  task: 'use-social-feed',
  site: 'design-use-social-feed-some-07',
  name: 'design',
  split: 'train',
  scenarios: ['some'],
  template: 'use-social-feed/feed',
  design: {
    scenarioDecor: false,
    timeFormat: 'plain',
    icons: {
      like: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    },
    parts: {
      header: (base) => (R) => {
        base(R);
        const thead = R.util.el('div', 'as-thead', R.col);
        for (const h of ['Like', 'Author', 'Content', 'Time', 'Engagement']) {
          R.util.el('span', 'th-' + h.toLowerCase(), thead, h);
        }
      },
      metaText: () => (R, meta, post) => {
        R.util.el('span', 'as-name', meta, post.name);
        R.util.el('span', 'as-handle', meta, post.handle);
        R.util.el('span', 'as-time', meta, post.time);
      },
      avatar: (base) => (R, row, post, ...args) => {
        const av = base(R, row, post, ...args);
        av.classList.remove('aq-photo');
        av.textContent = '';
        const avatarRow = [168, 222, 277, 332, 500, 557][R.handles.indexOf(post.handle) % 6];
        av.style.backgroundImage = 'url("sites/design-use-social-feed-some-07/assets/ledger-scenes.webp")';
        av.style.backgroundSize = '1672px 940px';
        av.style.backgroundPosition = `-114px -${avatarRow}px`;
        return av;
      },
      afterText: (base) => (R, main, post, p, parts, row, m) => {
        base(R, main, post, p, parts, row, m);
        const scene = R.util.el('div', 'as-scene', main);
        scene.style.backgroundPosition = `-361px -${[166, 220, 275, 330, 386, 442, 499, 555][p % 8]}px`;
        scene.setAttribute('aria-hidden', 'true');
        row.addEventListener('click', (event) => {
          if (event.target.closest('button,.as-showmore')) return;
          const preview = document.querySelector('.pv-body');
          if (!preview) return;
          preview.replaceChildren();
          const pic = R.util.el('div', 'pv-scene', preview);
          pic.style.backgroundPosition = scene.style.backgroundPosition;
          R.util.el('b', '', preview, post.handle);
          R.util.el('p', '', preview, post.text);
        });
      },
      actions: (base) => (R, main, post, p, parts, row) => {
        const acts = base(R, main, post, p, parts, row);
        for (const [button, el] of Object.entries(parts.acts)) {
          if (button === 'like') el.classList.add('like-toggle');
          if (R.labels) {
            const label = el.querySelector('span');
            if (label) {
              label.className = 'as-action-label';
              label.hidden = true;
            }
            if (button !== 'share') parts.counts[button] = R.util.el('span', '', el);
          }
        }
        return acts;
      },
      paint: (base) => (R) => {
        base(R);
        const selected = document.querySelector('.selected-value');
        if (selected) {
          selected.textContent = String(R.ctx.model.on.length);
        }
      },
    },
  },
});
