// Keeps the column headings, portrait crops, and selectable post detail pane of this timeline design.
(function () {
  'use strict';

  env.widget({
    task: 'use-social-feed',
    site: 'design-use-social-feed-one-06',
    name: 'design',
    split: 'train',
    scenarios: ['one'],
    template: 'use-social-feed/feed',
    design: {
      css: '',
      title: 'Timeline',
      timeFormat: 'plain',
      icons: {
        retweet: '<path d="M3 8l4-4 4 4M7 4v13a3 3 0 0 0 3 3h3M21 16l-4 4-4-4M17 20V7a3 3 0 0 0-3-3h-3"/>',
      },
      parts: {
        headed: (base) => (R) => {
          base(R);
          const columns = R.util.el('div', 'as-columns', R.col);
          for (const label of ['Author', 'Post', 'Time']) R.util.el('span', '', columns, label);
        },
        ready: (base, S) => (R) => {
          base(R);
          const { ctx, spec, F, x } = R;
          x.selected = F.helpers.feedOf(spec, ctx.model)[0];
          const detail = document.querySelector('.detail-pane');
          detail.addEventListener('pointerenter', () => {
            if (x.selected !== undefined && ctx.model.hover !== x.selected) R.up({ hover: x.selected });
          });
          detail.addEventListener('pointerleave', () => {
            if (ctx.model.hover === x.selected) R.up({ hover: null });
          });
          x.portrait = (el, handle) => {
            const tile = R.handles.indexOf(handle) % 6;
            el.style.backgroundImage = `url(${new URL('assets/avatar-source.webp', document.querySelector('link[href*="site.css"]').href).href})`;
            el.style.backgroundSize = tile === 0 ? '2533.333% 1517.742%' : '2533.333% 1383.824%';
            el.style.backgroundPosition = `2.366% ${[31.969, 42.841, 54.525, 66.323, 78.351, 90.378][tile]}%`;
            if (tile === 0 && el.classList.contains('dp-av')) {
              el.style.backgroundSize = '1520% 871.296%';
              el.style.backgroundPosition = '66.5826% 29.1717%';
            }
          };
          const detailButtons = [...detail.querySelectorAll('.dp-btn')];
          for (const btn of detailButtons) {
            const key = btn.dataset.action;
            btn.innerHTML = S.svg(S.ICON[key]) + (key === 'more' ? '' : `<span>${F.helpers.LABELS[key]}</span>`);
            btn.addEventListener('click', () => {
              const pt = R.fd && R.fd.parts.get(x.selected);
              const control = pt && (key === 'more' ? pt.more : pt.acts && pt.acts[key]);
              if (control) control.click();
            });
          }
          x.paintDetail = () => {
            const post = spec.posts[x.selected];
            if (!post) return;
            detail.querySelector('.dp-head b').textContent = post.handle;
            detail.querySelector('.dp-sub').textContent = `Apr 22, 2024   ${post.time}`;
            detail.querySelector('.dp-text').textContent = post.text;
            x.portrait(detail.querySelector('.dp-av'), post.handle);
            for (const [p, row] of R.fd.rows) row.classList.toggle('selected', p === x.selected);
            for (const btn of detailButtons) {
              btn.classList.toggle('on', ctx.model.on.includes(F.helpers.keyOf(x.selected, btn.dataset.action)));
            }
            detail.querySelector('.dp-stats').innerHTML = `<b>${post.counts.retweet || 0}</b> Reposts &nbsp; <b>${post.counts.like || 0}</b> Likes`;
            const replies = spec.posts.filter(p => p.handle !== post.handle).slice(0, 3);
            [...detail.querySelectorAll('.dp-reply')].forEach((row, i) => {
              if (!replies[i]) return;
              row.querySelector('b').textContent = replies[i].handle;
              x.portrait(row.querySelector('.dp-rav'), replies[i].handle);
            });
            document.querySelector('.post-count').textContent = `${R.fd.rows.size} posts`;
          };
        },
        avatar: (base, S) => (R, row, post, p) => {
          const av = R.util.el('div', 'as-av', row, S.initials(post.name));
          av.textContent = '';
          R.x.portrait(av, post.handle);
          av.title = post.name;
          row.addEventListener('click', () => { R.x.selected = p; R.x.paintDetail(); });
          return av;
        },
        metaText: () => (R, meta, post) => {
          const { util } = R;
          util.el('span', 'as-name', meta, post.name);
          const handleText = util.el('span', '', util.el('span', 'as-handle', meta), post.handle);
          handleText.style.fontSize = `clamp(10px, calc(100cqw / ${post.handle.length * 0.68}), 1em)`;
          util.el('span', 'as-time', meta, post.time);
        },
        showMore: (base) => (R, hosts, p) => {
          const sm = base(R, hosts, p);
          hosts.row.append(sm);
          return sm;
        },
        paintOverlays: (base) => (R, m) => {
          if (!R.fd.rows.has(R.x.selected)) R.x.selected = R.fd.rows.keys().next().value;
          R.x.paintDetail();
          base(R, m);
        },
      },
    },
  });
})();
